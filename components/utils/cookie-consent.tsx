"use client";

import { useEffect, useState } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

type ConsentState = "granted" | "denied";

type ConsentUpdate = {
  analytics_storage: ConsentState;
  ad_storage: ConsentState;
  ad_user_data: ConsentState;
  ad_personalization: ConsentState;
};

type WindowWithConsentHelpers = Window & {
  gtag?: (command: "consent", action: "update", params: ConsentUpdate) => void;
  dataLayer?: unknown[];
  __onbastCookieConsentInited?: boolean;
  __onbastOpenCookiePreferences?: () => void;
};

const updateGtagConsent = (cookie: CookieConsent.CookieValue | undefined) => {
  const categories = Array.isArray(cookie?.categories) ? cookie.categories : [];

  const granted: ConsentUpdate = {
    analytics_storage: categories.includes("analytics") ? "granted" : "denied",
    ad_storage: categories.includes("marketing") ? "granted" : "denied",
    ad_user_data: categories.includes("marketing") ? "granted" : "denied",
    ad_personalization: categories.includes("marketing") ? "granted" : "denied",
  };

  const w = window as WindowWithConsentHelpers;
  if (typeof w.gtag === "function") w.gtag("consent", "update", granted);
  else if (Array.isArray(w.dataLayer)) w.dataLayer.push(["consent", "update", granted]);
};

const getConsentCategories = () => {
  if (typeof document === "undefined") return [];
  const name = "onbast_cookie_consent=";
  const cookie = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(name));

  if (!cookie) return [];
  const rawValue = cookie.slice(name.length);

  try {
    const parsed = JSON.parse(decodeURIComponent(rawValue));
    return Array.isArray(parsed?.categories) ? parsed.categories : [];
  } catch {
    return [];
  }
};

const hasAnalyticsConsent = () => getConsentCategories().includes("analytics");

export const CookieConsentManager = () => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const schedule = typeof queueMicrotask === "function"
      ? queueMicrotask
      : (cb: () => void) => setTimeout(cb, 0);

    schedule(() => setAnalyticsEnabled(hasAnalyticsConsent()));

    const w = window as WindowWithConsentHelpers;
    if (w.__onbastCookieConsentInited) return;
    w.__onbastCookieConsentInited = true;

    const cc = CookieConsent as unknown as {
      showPreferences?: () => void;
      showPreferencesModal?: () => void;
      showSettings?: () => void;
    };

    w.__onbastOpenCookiePreferences = () => {
      if (typeof cc.showPreferences === "function") cc.showPreferences();
      else if (typeof cc.showPreferencesModal === "function") cc.showPreferencesModal();
      else if (typeof cc.showSettings === "function") cc.showSettings();
    };

    CookieConsent.run({
      cookie: {
        name: "onbast_cookie_consent",
        expiresAfterDays: 182,
        sameSite: "Lax",
      },
      guiOptions: {
        consentModal: {
          layout: "box",
          position: "bottom left",
          equalWeightButtons: true,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          position: "right",
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
          readOnly: false,
        },
        marketing: {
          enabled: false,
          readOnly: false,
        },
      },
      language: {
        default: "es",
        translations: {
          es: {
            consentModal: {
              title: "Cookies y privacidad",
              description:
                "Usamos cookies para mejorar la experiencia, medir rendimiento y, si lo aceptas, personalizar publicidad. Puedes aceptar, rechazar o configurar tus preferencias.",
              acceptAllBtn: "Aceptar todas",
              acceptNecessaryBtn: "Rechazar",
              showPreferencesBtn: "Configurar",
            },
            preferencesModal: {
              title: "Preferencias de cookies",
              acceptAllBtn: "Aceptar todas",
              acceptNecessaryBtn: "Rechazar",
              savePreferencesBtn: "Guardar preferencias",
              closeIconLabel: "Cerrar",
              serviceCounterLabel: "Servicio|Servicios",
              sections: [
                {
                  title: "Resumen",
                  description:
                    "Puedes activar o desactivar categorías. Las cookies necesarias siempre están activas para que la web funcione.",
                },
                {
                  title: "Necesarias",
                  description: "Imprescindibles para el funcionamiento del sitio.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Analítica",
                  description: "Nos ayudan a medir el rendimiento y uso del sitio (p. ej. Vercel Analytics).",
                  linkedCategory: "analytics",
                },
                {
                  title: "Marketing",
                  description: "Permiten medir y personalizar anuncios (p. ej. Google Ads).",
                  linkedCategory: "marketing",
                },
              ],
            },
          },
        },
      },
      onFirstConsent: ({ cookie }) => {
        updateGtagConsent(cookie);
        const categories = Array.isArray(cookie?.categories) ? cookie.categories : [];
        setAnalyticsEnabled(categories.includes("analytics"));
      },
      onConsent: ({ cookie }) => {
        updateGtagConsent(cookie);
        const categories = Array.isArray(cookie?.categories) ? cookie.categories : [];
        setAnalyticsEnabled(categories.includes("analytics"));
      },
      onChange: ({ cookie }) => {
        updateGtagConsent(cookie);
        const categories = Array.isArray(cookie?.categories) ? cookie.categories : [];
        setAnalyticsEnabled(categories.includes("analytics"));
      },
    });
  }, []);

  return (
    <>
      {analyticsEnabled ? (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      ) : null}
    </>
  );
};
