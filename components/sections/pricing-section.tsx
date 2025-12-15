"use client";
import React from "react";
import { motion } from "framer-motion";
import { Plus, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";

interface PricingProps {
  pricing: {
    title?: string;
    subtitle?: string;
    badge?: string;
    price?: string;
    period?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    features?: string[];
    addon?: {
      title: string;
      price: string;
      active?: boolean;
    };
    trustedLogos?: string[];
  };
}

export function PricingSection({ pricing }: PricingProps) {
  const [addonActive, setAddonActive] = React.useState(pricing.addon?.active || false);

  if (!pricing) return null;

  // Helper to parse price string (e.g. "1.850€" -> 1850)
  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
  };

  const basePrice = parsePrice(pricing.price || "0");
  const addonPrice = pricing.addon ? parsePrice(pricing.addon.price) : 0;
  const totalPrice = addonActive ? basePrice + addonPrice : basePrice;

  // Format back to locale string (simple implementation for Euro)
  const formattedPrice = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0 }).format(totalPrice);

  return (
    <section className="py-0 relative">
      {/* Background Elements - Fixed clipping on mobile */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-[600px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 pt-10 md:pt-0">
        {/* Header */}
        <FadeIn className="text-center mb-10">
          <SectionHeading
            title={pricing.title || "Pricing that's so simple."}
            subtitle="Pricing"
            highlight="Simple"
          />
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light mt-[-20px]">
            {pricing.subtitle || "We like to keep things simple with one, limitless plan."}
          </p>
        </FadeIn>

        {/* Pricing Card */}
        <FadeIn delay={0.2} className="relative max-w-sm mx-auto">
           {/* Card Glow */}
           <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl transform scale-105 opacity-50" />
           
           <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
              {/* Top Gradient Line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

              {/* Badge */}
              {pricing.badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs font-medium text-white mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {pricing.badge}
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold text-white tracking-tight">
                    <motion.span
                        key={totalPrice}
                        initial={{ opacity: 0, y: 20 }} // Start from below
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {formattedPrice}€
                    </motion.span>
                </span>
                <span className="text-neutral-500 text-lg">{pricing.period}</span>
              </div>
              <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                {pricing.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3 mb-8">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium h-12 rounded-full shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] transition-all">
                  {pricing.buttonText || "Subscribe"}
                </Button>
                <Button variant="outline" className="w-full bg-transparent border-white/10 text-white hover:bg-white/5 font-medium h-12 rounded-full">
                  {pricing.secondaryButtonText || "Book a call"}
                </Button>
              </div>

              {/* Addon Switch */}
              {pricing.addon && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/50 border border-white/5 mb-8">
                   <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div 
                        onClick={() => setAddonActive(!addonActive)}
                        className={cn(
                            "w-10 h-6 rounded-full relative p-1 cursor-pointer transition-colors duration-300 shrink-0",
                            addonActive ? "bg-emerald-500" : "bg-neutral-800 hover:bg-neutral-700"
                        )}
                      >
                          <motion.div 
                            animate={{ x: addonActive ? 16 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className={cn("w-4 h-4 bg-white rounded-full")} 
                          />
                      </div>
                      <span className={cn("text-xs md:text-sm font-medium transition-colors leading-tight", addonActive ? "text-white" : "text-neutral-300")}>
                        {pricing.addon.title}
                      </span>
                   </div>
                   <span className="text-xs font-mono text-neutral-500 bg-neutral-900 px-2 py-1 rounded border border-white/5 whitespace-nowrap ml-2">
                      {pricing.addon.price}
                   </span>
                </div>
              )}

              {/* Features */}
              {pricing.features && (
                <ul className="space-y-3">
                  {pricing.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                      <Plus className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
           </div>
        </FadeIn>

        {/* Trusted By */}
        {pricing.trustedLogos && pricing.trustedLogos.length > 0 && (
          <FadeIn delay={0.4} className="mt-16 text-center">
            <p className="text-neutral-500 text-sm mb-6 font-light">
              Designs trusted by companies like:
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {pricing.trustedLogos.map((logo, i) => (
                <div key={i} className="relative h-8 w-24">
                  <Image 
                    src={logo} 
                    alt={`Trusted company ${i}`} 
                    fill 
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        )}

      </div>
    </section>
  );
}
