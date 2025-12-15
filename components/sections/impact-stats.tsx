"use client";
import React, { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";

interface ImpactStatsProps {
  impact: {
    title?: string;
    subtitle?: string;
    stats?: {
      value: number;
      prefix?: string;
      suffix?: string;
      label: string;
      description?: string;
    }[];
  };
}

const Counter = ({
  value,
  direction = "up",
}: {
  value: number;
  direction?: "up" | "down";
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 100,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(direction === "down" ? 0 : value);
    }
  }, [isInView, motionValue, direction, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(
          Number(latest.toFixed(0))
        );
      }
    });
  }, [springValue]);

  return <span ref={ref} />;
};

export function ImpactStats({ impact }: ImpactStatsProps) {
  if (!impact?.stats || impact.stats.length === 0) return null;

  return (
    <section className="relative w-full py-10 md:py-20">
      {/* Background Gradients - Adjusted to flow over sections */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {(impact.title || impact.subtitle) && (
            <FadeIn className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
                <SectionHeading 
                    title={impact.title || "Resultados Medibles"} 
                    subtitle="Estadísticas" 
                    highlight="Impacto"
                    className="justify-center"
                />
                {impact.subtitle && (
                    <p className="text-neutral-400 mt-6 text-lg md:text-xl font-light leading-relaxed">
                        {impact.subtitle}
                    </p>
                )}
            </FadeIn>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impact.stats.map((stat, index) => (
            <FadeIn key={index} delay={index * 0.1} className="relative group">
              <div className="relative p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:bg-neutral-900/60 hover:border-indigo-500/20 hover:-translate-y-1">
                
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="flex items-baseline gap-1 mb-2">
                    {stat.prefix && (
                        <span className="text-3xl md:text-4xl font-light text-indigo-400/80">
                            {stat.prefix}
                        </span>
                    )}
                    <span className="text-5xl md:text-6xl font-bold text-white tracking-tight tabular-nums">
                        <Counter value={stat.value} />
                    </span>
                    {stat.suffix && (
                        <span className="text-3xl md:text-4xl font-light text-indigo-400/80">
                            {stat.suffix}
                        </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-medium text-white mb-3 group-hover:text-indigo-200 transition-colors">
                    {stat.label}
                  </h3>
                  
                  {stat.description && (
                    <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-[200px] mx-auto">
                        {stat.description}
                    </p>
                  )}
                </div>

                {/* Decorative Bottom Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-30 group-hover:w-2/3 group-hover:opacity-100 transition-all duration-500" />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
