"use server";

import { z } from "zod";
import { client } from "@/sanity/lib/client";
import { headers } from "next/headers";

interface PlanRequestData {
  plan: {
    title: string;
    price: string;
    buttonLinkID: string;
  };
  addons: string[];
  location: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    message: string;
    website?: string;
  };
}

interface ActionResponse {
  success: boolean;
  error?: string;
}

const PlanRequestSchema = z.object({
  plan: z.object({
    title: z.string().trim().min(1).max(120),
    price: z.string().optional().default(""),
    buttonLinkID: z.string().trim().min(1).max(120),
  }),
  addons: z.array(z.string().trim().min(1).max(120)).max(20).default([]),
  location: z.string().trim().min(1).max(120),
  contact: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(1).max(40),
    message: z.string().trim().max(4000).optional().default(""),
    website: z.string().trim().max(200).optional().default(""),
  }),
});

const PRICING_PLAN_ALLOWED_ADDONS_QUERY = `*[_type == "pricingPlan" && buttonLinkID.current == $planId][0]{
  "allowedAddonIds": allowedAddons[]->id.current
}`;

const PRICING_ADDON_TITLES_BY_IDS_QUERY = `*[_type == "pricingAddon" && id.current in $addonIds] | order(title asc) {
  title,
  "id": id.current
}`;

type PricingAddonTitle = { id: string; title: string };

type RateLimitState = { count: number; resetAt: number };

const getRateLimitStore = () => {
  const g = globalThis as unknown as { __onbastPlanRateLimit?: Map<string, RateLimitState> };
  if (!g.__onbastPlanRateLimit) g.__onbastPlanRateLimit = new Map();
  return g.__onbastPlanRateLimit;
};

const checkRateLimit = (key: string) => {
  const store = getRateLimitStore();
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const max = 3;

  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const };
  }

  if (current.count >= max) return { ok: false as const };

  store.set(key, { count: current.count + 1, resetAt: current.resetAt });
  return { ok: true as const };
};

const sendResendEmail = async (input: { subject: string; text: string; replyTo?: string; requestId?: string }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false as const, error: "Missing RESEND_API_KEY" };
  }

  const from = process.env.RESEND_FROM;
  if (!from) {
    return { ok: false as const, error: "Missing RESEND_FROM" };
  }
  const to = process.env.PLANS_NOTIFY_EMAIL || "info@onbast.com";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: input.subject,
      text: input.text,
      ...(input.replyTo ? { reply_to: [input.replyTo] } : {}),
    }),
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await res.json().catch(() => null)
      : await res.text().catch(() => "");

    const message =
      typeof body === "object" && body && "message" in body && typeof (body as any).message === "string"
        ? (body as any).message
        : typeof body === "string"
          ? body
          : "Unknown error";

    return { ok: false as const, error: `Resend error (${res.status}): ${message}` };
  }

  const body = await res.json().catch(() => null);
  const id = typeof body === "object" && body && "id" in body && typeof (body as any).id === "string" ? (body as any).id : undefined;

  if (id) {
    console.info("[submitPlanRequest] Resend accepted", { requestId: input.requestId, resendEmailId: id });
  } else {
    console.info("[submitPlanRequest] Resend accepted", { requestId: input.requestId });
  }

  return { ok: true as const, id };
};

export async function submitPlanRequest(data: PlanRequestData): Promise<ActionResponse> {
  const requestId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  try {
    const parsed = PlanRequestSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Datos inválidos. Revisa el formulario." };
    }

    if (parsed.data.contact.website) {
      console.info("[submitPlanRequest] Honeypot triggered", { requestId });
      return { success: true };
    }

    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0]?.trim() : "unknown";
    const rateKey = `${ip}:${parsed.data.contact.email}`;
    const rate = checkRateLimit(rateKey);
    if (!rate.ok) {
      return { success: false, error: "Demasiadas solicitudes. Espera 10 minutos e inténtalo de nuevo." };
    }

    const policy = await client.fetch<{ allowedAddonIds?: string[] | null }>(
      PRICING_PLAN_ALLOWED_ADDONS_QUERY,
      { planId: parsed.data.plan.buttonLinkID }
    );

    if (!policy) {
      return { success: false, error: "El plan seleccionado no existe o no está disponible." };
    }

    const allowedAddonIds = Array.isArray(policy?.allowedAddonIds)
      ? policy.allowedAddonIds.filter((id): id is string => typeof id === "string" && id.length > 0)
      : [];

    if (allowedAddonIds.length > 0) {
      const allowedSet = new Set(allowedAddonIds);
      const invalidAddon = parsed.data.addons.find((id) => !allowedSet.has(id));
      if (invalidAddon) {
        return { success: false, error: "Has seleccionado un add-on no compatible con el plan base." };
      }
    }

    const addonTitles = parsed.data.addons.length
      ? await client.fetch<PricingAddonTitle[]>(PRICING_ADDON_TITLES_BY_IDS_QUERY, { addonIds: parsed.data.addons })
      : [];

    const addonLabel = parsed.data.addons.length
      ? parsed.data.addons
          .map((id) => {
            const found = addonTitles.find((a) => a.id === id);
            return found ? `${found.title} (${id})` : id;
          })
          .join("\n")
      : "Ninguno";

    const subject = `Nueva solicitud de plan: ${parsed.data.plan.title} (${parsed.data.location})`;
    const text = [
      "Nueva solicitud de Plan (Configurador)",
      "",
      `Plan: ${parsed.data.plan.title}`,
      `Plan ID: ${parsed.data.plan.buttonLinkID}`,
      `Precio: ${parsed.data.plan.price || ""}`,
      `Ubicación: ${parsed.data.location}`,
      "",
      "Add-ons:",
      addonLabel,
      "",
      "Contacto:",
      `Nombre: ${parsed.data.contact.name}`,
      `Email: ${parsed.data.contact.email}`,
      `Teléfono: ${parsed.data.contact.phone}`,
      "",
      "Mensaje:",
      parsed.data.contact.message || "",
    ].join("\n");

    const sendResult = await sendResendEmail({
      subject,
      text,
      replyTo: parsed.data.contact.email,
      requestId,
    });

    if (!sendResult.ok) {
      console.error("[submitPlanRequest] Resend error", { requestId, error: sendResult.error });
      return {
        success: false,
        error: "No se ha podido enviar el email. Revisa la configuración de Resend (sender/domain) y vuelve a intentar.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("[submitPlanRequest] Unhandled error", { requestId, error });
    return { success: false, error: "Error interno del servidor." };
  }
}
