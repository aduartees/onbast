"use client";
import React from "react";
import { Check, X } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  agencyName?: string;
  cityName?: string;
}

export function ComparisonTable({ agencyName = "ONBAST", cityName }: ComparisonTableProps) {
  const localAgencyName = cityName ? `${agencyName} ${cityName}` : agencyName;

  const features = [
    { name: "Estrategia SEO Local", us: true, them: false },
    { name: "Diseño UX/UI Premium", us: true, them: "Básico" },
    { name: "Tecnología Next.js (Velocidad)", us: true, them: false },
    { name: "Soporte 24/7", us: true, them: false },
    { name: "Reportes de Rendimiento", us: true, them: "Mensual" },
    { name: "Hosting Edge Global", us: true, them: false },
  ];

  return (
    <section className="py-20 md:py-32 relative">
      <FadeIn>
        <div className="max-w-4xl mx-auto px-2 md:px-0">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-neutral-400 text-lg">
              La diferencia entre una web y un activo digital.
            </p>
          </div>

          <div className="md:hidden space-y-4">
            {features.map((feature, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-neutral-900/20 p-5">
                <div className="text-sm font-medium text-white mb-4">{feature.name}</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-indigo-500/[0.05] p-3">
                    <div className="text-[11px] uppercase tracking-wider text-neutral-400 mb-2">{localAgencyName}</div>
                    <div className="flex items-center gap-2 text-sm text-neutral-200">
                      {feature.us ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-500/20 text-green-400">
                          <Check className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="text-neutral-500">-</span>
                      )}
                      <span>Incluido</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-neutral-950/30 p-3">
                    <div className="text-[11px] uppercase tracking-wider text-neutral-400 mb-2">Agencia tradicional</div>
                    <div className="flex items-center gap-2 text-sm text-neutral-200">
                      {feature.them === false ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-500/10 text-red-400">
                          <X className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="text-neutral-300">{feature.them}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <div className="relative overflow-x-auto rounded-2xl border border-white/10 bg-neutral-900/20 backdrop-blur-sm">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-3 border-b border-white/10 bg-white/5">
                  <div className="p-6 text-sm font-medium text-neutral-400">Características</div>
                  <div className="p-6 text-center text-sm font-bold text-white bg-indigo-500/10 border-x border-white/5">
                    {localAgencyName}
                  </div>
                  <div className="p-6 text-center text-sm font-medium text-neutral-400">Agencia Tradicional</div>
                </div>

                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="p-4 md:p-6 text-sm md:text-base text-neutral-300 flex items-center">{feature.name}</div>
                    <div className="p-4 md:p-6 flex items-center justify-center border-x border-white/5 bg-indigo-500/[0.02]">
                      {feature.us ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400">
                          <Check className="w-5 h-5" />
                        </div>
                      ) : (
                        <span className="text-neutral-500">-</span>
                      )}
                    </div>
                    <div className="p-4 md:p-6 flex items-center justify-center text-neutral-500">
                      {feature.them === false ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-400">
                          <X className="w-5 h-5" />
                        </div>
                      ) : (
                        <span className="text-sm">{feature.them}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
