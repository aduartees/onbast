import React from "react";
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { PRICING_PLANS_QUERY, PRICING_ADDONS_QUERY } from "@/sanity/lib/queries";
import { PricingWizard } from "@/components/sections/pricing-wizard";
import { FadeIn } from "@/components/ui/fade-in";
import { ScrollReset } from "@/components/utils/scroll-reset";

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
  const plans = await client.fetch(PRICING_PLANS_QUERY);
  const addons = await client.fetch(PRICING_ADDONS_QUERY);
  const { service: initialPlanId, location: initialLocation } = await searchParams;

  // Convert searchParams to strings if they are arrays (shouldn't happen for these)
  const planId = Array.isArray(initialPlanId) ? initialPlanId[0] : initialPlanId;
  const loc = Array.isArray(initialLocation) ? initialLocation[0] : initialLocation;

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white pt-32 pb-20">
      <ScrollReset />
      
      <div className="max-w-7xl mx-auto px-4">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Diseña tu Estrategia
            </h1>
            <p className="text-xl text-neutral-400 font-light">
              Configura un plan a medida. Sin costes ocultos, sin sorpresas.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <PricingWizard 
            plans={plans} 
            addons={addons}
            initialPlanId={planId} 
            initialLocation={loc}
          />
        </FadeIn>
      </div>
    </main>
  );
}
