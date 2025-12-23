"use client";
import React from "react";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import Link from "next/link";

interface PricingPlan {
  title: string;
  price: string;
  currency: string;
  period?: string;
  badge?: string;
  description?: string;
  features?: string[];
  addon?: {
    title: string;
    price: string;
    active?: boolean;
  };
  buttonText?: string;
  buttonLinkID?: string;
}

interface PricingProps {
  pricing: {
    title?: string;
    subtitle?: string;
    plans?: PricingPlan[];
    trustedCompaniesTitle?: string;
    trustedLogos?: { logo: string | null; name: string }[];
    linkLocation?: string;
  };
}

export function PricingSection({ pricing }: PricingProps) {
  if (!pricing) return null;

  return (
    <section className="py-0 relative" id="precios">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[600px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10 pt-10 md:pt-0">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <SectionHeading
            title={pricing.title || "Precios claros y simples."}
            subtitle="Precios"
            highlight={pricing.title?.includes("simple") ? "simple" : undefined}
          />
          <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl mx-auto font-light mt-6">
            {pricing.subtitle || "Elige el plan que mejor se adapte a tus necesidades."}
          </p>
        </FadeIn>

        {/* Pricing Cards Grid */}
        <div className={cn(
          "grid gap-8 mx-auto",
          pricing.plans?.length === 1 ? "max-w-md grid-cols-1" :
          pricing.plans?.length === 2 ? "max-w-4xl grid-cols-1 md:grid-cols-2" :
          "max-w-7xl grid-cols-1 md:grid-cols-3"
        )}>
          {pricing.plans?.map((plan, index) => (
            <PricingCard 
              key={plan.buttonLinkID || plan.title} 
              plan={plan} 
              index={index} 
              linkLocation={pricing.linkLocation}
            />
          ))}
        </div>

        {/* Trusted By */}
        {pricing.trustedLogos && pricing.trustedLogos.length > 0 && (
          <FadeIn delay={0.4} className="mt-24 text-center">
            <p className="text-neutral-500 text-sm mb-8 font-light">
              {pricing.trustedCompaniesTitle || "Designs trusted by companies like:"}
            </p>
            <div className="flex flex-wrap justify-center gap-12 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {pricing.trustedLogos.map((logo, i) => (
                logo.logo ? (
                  <div key={i} className="relative h-8 w-24">
                    <Image 
                      src={logo.logo} 
                      alt={logo.name || `Trusted company ${i}`} 
                      title={logo.name || `Trusted company ${i}`}
                      fill  
                      className="object-contain"
                    />
                  </div>
                ) : null
              ))}
            </div>
          </FadeIn>
        )}

      </div>
    </section>
  );
}

function PricingCard({ plan, index, linkLocation }: { plan: PricingPlan, index: number, linkLocation?: string }) {
  const [addonActive, setAddonActive] = React.useState(plan.addon?.active || false);

  // Helper to parse price string
  const basePrice = React.useMemo(() => {
     return parseInt(plan.price?.replace(/[^0-9]/g, '') || "0") || 0;
  }, [plan.price]);

  const addonPrice = React.useMemo(() => {
     return plan.addon ? parseInt(plan.addon.price.replace(/[^0-9]/g, '') || "0") || 0 : 0;
  }, [plan.addon]);

  const totalPrice = addonActive ? basePrice + addonPrice : basePrice;

  const formattedPrice = React.useMemo(() => {
     return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0 }).format(totalPrice);
  }, [totalPrice]);

  const finalLink = React.useMemo(() => {
    const params = new URLSearchParams();

    if (plan.buttonLinkID) params.set("service", plan.buttonLinkID);
    if (linkLocation) params.set("location", linkLocation);

    const qs = params.toString();
    return qs ? `/planes?${qs}` : "/planes";
  }, [linkLocation, plan.buttonLinkID]);

  return (
    <FadeIn delay={0.2 + (index * 0.1)} className="relative w-full h-full">
       <div className={cn(
         "relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden h-full flex flex-col transition-transform duration-300 hover:-translate-y-2",
         plan.badge ? "border-indigo-500/30" : ""
       )}>
          {/* Highlight Gradient for Badged Plans */}
          {plan.badge && (
             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
          )}

          {/* Badge */}
          {plan.badge && (
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400">
                {plan.badge}
              </span>
            </div>
          )}

          <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
          
          {/* Price */}
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl md:text-5xl font-bold text-white">
                <motion.span
                    key={totalPrice}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    suppressHydrationWarning
                >
                    {formattedPrice}€
                </motion.span>
            </span>
            <span className="text-neutral-500 text-sm">{plan.period}</span>
          </div>

          <p className="text-neutral-400 text-sm mb-8 leading-relaxed min-h-[40px]">
            {plan.description}
          </p>

          {/* Addon Switch */}
          {plan.addon && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/50 border border-white/5 mb-8 cursor-pointer hover:bg-neutral-900 transition-colors" onClick={() => setAddonActive(!addonActive)}>
               <div className="flex items-center gap-3">
                  <div className={cn(
                        "w-10 h-6 rounded-full relative p-1 transition-colors duration-300 shrink-0",
                        addonActive ? "bg-emerald-500" : "bg-neutral-800"
                    )}
                  >
                      <motion.div 
                        animate={{ x: addonActive ? 16 : 0 }}
                        className="w-4 h-4 bg-white rounded-full" 
                      />
                  </div>
                  <span className="text-xs font-medium text-neutral-300">
                    {plan.addon.title}
                  </span>
               </div>
               <span className="text-xs font-mono text-neutral-500">
                  {plan.addon.price}
               </span>
            </div>
          )}

          {/* Features */}
          <ul className="space-y-3 mb-8 flex-grow">
            {plan.features?.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link href={finalLink} className="w-full mt-auto">
              <Button className={cn(
                "w-full font-medium h-12 rounded-full transition-all",
                plan.badge 
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]" 
                  : "bg-white text-black hover:bg-neutral-200"
              )}>
                {plan.buttonText || "Empezar ahora"}
              </Button>
          </Link>
       </div>
    </FadeIn>
  );
}
