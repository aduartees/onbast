import React from "react";
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { PRICING_PLANS_QUERY, PRICING_SERVICE_ADDONS_QUERY, SETTINGS_QUERY } from "@/sanity/lib/queries";
import { PricingWizard } from "@/components/sections/pricing-wizard";
import { FadeIn } from "@/components/ui/fade-in";
import { ScrollReset } from "@/components/utils/scroll-reset";
import { Navbar } from "@/components/layout/navbar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Footer } from "@/components/layout/footer";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { LuminousPill } from "@/components/ui/luminous-pill";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Configura tu Plan | ONBAST",
  description: "Personaliza tu estrategia digital. Elige servicios, añade funcionalidades y define tu alcance geográfico.",
};

export const revalidate = 3600; // ISR 1 hour

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [settings, plans, addons] = await Promise.all([
    client.fetch(SETTINGS_QUERY, {}, { next: { revalidate: 60 } }),
    client.fetch(PRICING_PLANS_QUERY, {}, { next: { revalidate } }),
    client.fetch(PRICING_SERVICE_ADDONS_QUERY, {}, { next: { revalidate } }),
  ]);

  const uniqueAddons = Array.isArray(addons)
    ? Array.from(
        new Map(
          addons
            .filter((a: any) => typeof a?.id === "string" && a.id.length)
            .map((a: any) => [a.id, a])
        ).values()
      )
    : [];
  const { service: initialPlanId, location: initialLocation } = await searchParams;

  // Convert searchParams to strings if they are arrays (shouldn't happen for these)
  const planId = Array.isArray(initialPlanId) ? initialPlanId[0] : initialPlanId;
  const loc = Array.isArray(initialLocation) ? initialLocation[0] : initialLocation;

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://onbast.com";

  const parseNumericPrice = (value: unknown) => {
    if (typeof value !== "string") return undefined;
    const numeric = value.replace(/[^0-9]/g, "");
    return numeric.length ? numeric : undefined;
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", item: `${baseUrl}/` },
    { name: "Planes", item: `${baseUrl}/planes` },
  ]);

  const termsOfServiceUrl = `${baseUrl}/condiciones-del-servicio`;

  const orgId = `${baseUrl}#org`;
  const websiteId = `${baseUrl}#website`;
  const pageId = `${baseUrl}/planes#webpage`;

  const organizationSchema = {
    "@type": "Organization",
    "@id": orgId,
    name: settings?.agency?.name || "ONBAST",
    url: baseUrl,
    ...(settings?.agency?.logo ? { logo: settings.agency.logo } : {}),
    ...(settings?.agency?.email ? { email: settings.agency.email } : {}),
    ...(settings?.agency?.phone ? { telephone: settings.agency.phone } : {}),
    ...(settings?.agency?.socialProfiles?.length ? { sameAs: settings.agency.socialProfiles } : {}),
  };

  const websiteSchema = {
    "@type": "WebSite",
    "@id": websiteId,
    url: baseUrl,
    name: settings?.agency?.name || "ONBAST",
    publisher: { "@id": orgId },
  };

  const webpageSchema = {
    "@type": "WebPage",
    "@id": pageId,
    url: `${baseUrl}/planes`,
    name: "Configura tu Plan",
    description: metadata.description,
    isPartOf: { "@id": websiteId },
    about: { "@id": orgId },
  };

  const catalogItems = [
    ...(Array.isArray(plans)
      ? plans
          .map((plan: any, index: number) => {
            const numericPrice = parseNumericPrice(plan?.price);
            if (!numericPrice) return null;

            const additionalProperty = (Array.isArray(plan?.features) ? plan.features : [])
              .filter((f: unknown) => typeof f === "string" && f.trim().length > 0)
              .map((feature: string) => ({
                "@type": "PropertyValue",
                name: "Incluye",
                value: feature,
              }));

            const itemOffered = {
              "@type": "Service",
              name: plan?.title,
              ...(plan?.description ? { description: plan.description } : {}),
              ...(additionalProperty.length ? { additionalProperty } : {}),
              provider: { "@id": orgId },
            };

            return {
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Offer",
                name: plan?.title,
                description: plan?.description,
                price: numericPrice,
                priceCurrency: plan?.currency || "EUR",
                availability: "https://schema.org/InStock",
                url: `${baseUrl}/planes?service=${encodeURIComponent(plan?.buttonLinkID || "")}`,
                seller: { "@id": orgId },
                termsOfService: termsOfServiceUrl,
                itemOffered,
              },
            };
          })
          .filter(Boolean)
      : []),
    ...(Array.isArray(uniqueAddons)
      ? uniqueAddons
          .map((addon: any, index: number) => {
            const numericPrice = parseNumericPrice(addon?.price);
            if (!numericPrice) return null;
            return {
              "@type": "ListItem",
              position: (plans?.length || 0) + index + 1,
              item: {
                "@type": "Offer",
                name: addon?.title,
                description: addon?.description,
                price: numericPrice,
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                url: `${baseUrl}/planes`,
                seller: { "@id": orgId },
                termsOfService: termsOfServiceUrl,
              },
            };
          })
          .filter(Boolean)
      : []),
  ];

  const offerCatalogSchema = {
    "@type": "OfferCatalog",
    name: "Planes y Extras",
    itemListElement: catalogItems,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, websiteSchema, webpageSchema, breadcrumbSchema, offerCatalogSchema],
  };

  return (
    <>
      <Navbar data={settings} />
      <Breadcrumbs />

      <main className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white">
        <ScrollReset />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section className="h-[80vh] w-full sticky top-0 z-0 flex flex-col items-center justify-center bg-neutral-950 overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-neutral-950 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[120vw] h-[120vw] md:w-[90vw] md:h-[90vw] bg-indigo-900/20 rounded-full blur-[60px] md:blur-[80px] transform-gpu will-change-transform" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[100vw] h-[100vw] md:w-[80vw] md:h-[80vw] bg-cyan-900/10 rounded-full blur-[60px] md:blur-[80px] transform-gpu will-change-transform" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          </div>
          <BackgroundBeams className="opacity-40" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full w-full text-center px-8 md:px-20 max-w-5xl mx-auto pt-24 pb-safe md:pt-20 md:pb-12">
            <LuminousPill title="Planes" />
            <BlurReveal
              text="Diseña tu estrategia."
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.15] md:leading-[1.1]"
              highlightClassName="font-serif italic font-normal text-indigo-200/90"
              highlightWord="estrategia."
            />
            <div className="max-w-xl mx-auto mb-10 md:mb-16 px-4 mt-8">
              <BlurReveal
                text="Elige una base, añade extras y define tu zona. Construimos una propuesta clara, sin sorpresas."
                className="text-sm md:text-base text-neutral-400 leading-relaxed"
                delay={0.3}
                as="p"
              />
            </div>
          </div>
        </section>

        <section className="relative z-10 bg-neutral-950 min-h-screen border-t border-white/10 rounded-t-[3rem] md:rounded-t-[5rem] -mt-[10vh] pt-14 md:pt-20 pb-20 shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto px-4">
            <FadeIn delay={0.1}>
              <article className="relative rounded-3xl border border-white/10 bg-neutral-900/10 p-4 md:p-10 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 to-transparent" />
                <div className="relative">
          <PricingWizard plans={plans} addons={uniqueAddons} initialPlanId={planId} initialLocation={loc} />
                </div>
              </article>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer data={settings} />
    </>
  );
}
