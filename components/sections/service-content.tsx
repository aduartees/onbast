"use client";
import React from "react";
import { CheckCircle2, ArrowRight, BarChart3, Users, Zap } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ServiceFAQ } from "./service-faq";
import { ServiceProcess } from "./service-process";
import { WobbleCard } from "@/components/aceternity/wobble-card";
import { TracingBeam } from "@/components/aceternity/tracing-beam";

interface ServiceContentProps {
  features?: {
    title: string;
    description: string;
    icon?: string;
  }[];
  benefits?: string[];
  process?: {
    title: string;
    description: string;
    imageUrl?: string;
  }[];
  longDescription?: string;
  overviewText?: string;
  problem?: string;
  solution?: string;
  technologies?: string[];
  impactSection?: {
    title: string;
    cards: {
      title: string;
      description: string;
      colSpan: number;
      minHeight?: number;
      imageUrl?: string;
      imageAlt?: string;
      color: string;
    }[];
  };
  faqs?: {
    question: string;
    answer: string;
  }[];
}

const FadeIn = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98], delay }} // Smooth ease
    className={className}
  >
    {children}
  </motion.div>
);

export function ServiceContent({ features, benefits, process, longDescription, overviewText, problem, solution, technologies, impactSection, faqs }: ServiceContentProps) {
  return (
    <div className="bg-neutral-950 min-h-screen py-20 px-4 md:px-8 relative z-20">
      
      <TracingBeam className="px-6">
        <div className="max-w-7xl mx-auto pt-10 antialiased relative">
          
          {/* 1. Overview Section & Problem/Solution */}
          <section className="mb-32 relative">
            <FadeIn className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-24">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-8">
                  Visión General
                </h2>
                <div className="prose prose-invert prose-lg text-neutral-400 leading-relaxed">
                   {/* Fallback if no long description */}
                  <p>{longDescription || "Este servicio está diseñado para transformar tu presencia digital mediante estrategias avanzadas y tecnología de vanguardia. Nos enfocamos en cada detalle para asegurar que tu inversión genere un retorno medible y sostenible en el tiempo."}</p>
                  
                  {/* Dynamic Overview Text (formerly hardcoded) */}
                  {overviewText && (
                    <p className="mt-4">
                      {overviewText}
                    </p>
                  )}
                  {!overviewText && (
                    <p className="mt-4 text-neutral-600 italic">
                      [Descripción adicional del servicio configurable desde CMS]
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-neutral-900/50 p-8 rounded-3xl border border-neutral-800 backdrop-blur-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                 <h3 className="text-xl font-semibold text-white mb-6 relative z-10">Beneficios Clave</h3>
                 <ul className="space-y-4 relative z-10">
                    {benefits?.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-indigo-400 shrink-0" />
                        <span className="text-neutral-300">{benefit}</span>
                      </li>
                    ))}
                    {!benefits && (
                      <li className="text-neutral-500 italic">No benefits listed available.</li>
                    )}
                 </ul>
              </div>
            </FadeIn>
    
            {/* Problem vs Solution */}
            {(problem || solution) && (
                <FadeIn delay={0.2} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-red-950/20 to-red-900/5 border border-red-900/20 relative overflow-hidden group hover:border-red-500/30 transition-colors">
                        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h3 className="text-red-400 font-bold mb-4 uppercase tracking-wider text-sm relative z-10 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> El Problema
                        </h3>
                        <p className="text-neutral-300 text-lg md:text-xl leading-relaxed relative z-10">{problem || "Muchas empresas luchan por destacar en un mercado saturado."}</p>
                    </div>
                    <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-emerald-950/20 to-emerald-900/5 border border-emerald-900/20 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                         <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h3 className="text-emerald-400 font-bold mb-4 uppercase tracking-wider text-sm relative z-10 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Nuestra Solución
                        </h3>
                        <p className="text-neutral-300 text-lg md:text-xl leading-relaxed relative z-10">{solution || "Implementamos estrategias data-driven para garantizar resultados."}</p>
                    </div>
                </FadeIn>
            )}
          </section>
    
          {/* 2. Tech Stack */}
          {technologies && technologies.length > 0 && (
              <FadeIn className="mb-32 py-12 relative">
                   <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
                  <div className="text-center mb-10 relative z-10">
                    <span className="px-4 py-1 bg-neutral-950 text-neutral-500 text-sm font-medium uppercase tracking-widest border border-neutral-800 rounded-full">
                        Powered By
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 md:gap-8 relative z-10">
                      {technologies.map((tech, i) => (
                          <span key={i} className="px-6 py-3 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-400 font-mono text-sm md:text-base hover:text-white hover:border-neutral-600 transition-all hover:-translate-y-1 cursor-default shadow-sm backdrop-blur-sm">
                              {tech}
                          </span>
                      ))}
                  </div>
              </FadeIn>
          )}
    
          {/* NEW: Impact / Wobble Card Section (Dynamic) */}
          {impactSection && impactSection.cards && impactSection.cards.length > 0 && (
            <section className="mb-40">
               {impactSection.title && (
                 <FadeIn className="text-center mb-16">
                   <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                     {impactSection.title}
                   </h2>
                 </FadeIn>
               )}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                {impactSection.cards.map((card, i) => (
                  <WobbleCard
                    key={i}
                    containerClassName={cn(
                      "h-full min-h-[300px]",
                      card.colSpan === 2 ? "lg:col-span-2" : card.colSpan === 3 ? "lg:col-span-3" : "lg:col-span-1",
                      card.color || "bg-neutral-900",
                      card.minHeight ? `lg:min-h-[${card.minHeight}px]` : ""
                    )}
                    className=""
                  >
                    <div className="max-w-xs relative z-10">
                      <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                        {card.title}
                      </h2>
                      <p className="mt-4 text-left text-base/6 text-neutral-200">
                        {card.description}
                      </p>
                    </div>
                    {card.imageUrl && (
                       <Image
                        src={card.imageUrl}
                        width={500}
                        height={500}
                        alt={card.imageAlt || card.title}
                        className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl opacity-80"
                      />
                    )}
                    {!card.imageUrl && (
                       <div className="absolute -right-4 lg:-right-[40%] -bottom-10 w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl" />
                    )}
                  </WobbleCard>
                ))}
              </div>
            </section>
          )}
    
    
          {/* 2. Features Grid (Bento Style) */}
          {features && features.length > 0 && (
            <section className="mb-40">
               <FadeIn className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                    Características
                  </h2>
                  <p className="text-neutral-500 text-lg">Todo lo que necesitas para escalar.</p>
               </FadeIn>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {features.map((feature, i) => (
                    <FadeIn delay={i * 0.1} key={i} className={cn(
                      "p-8 rounded-3xl bg-neutral-900/20 border border-neutral-800 hover:bg-neutral-900/40 transition-all duration-300 group hover:border-neutral-700",
                      i === 0 || i === 3 ? "md:col-span-2" : "md:col-span-1"
                    )}>
                       <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-neutral-700">
                          {/* Try to render dynamic icon if needed, for now placeholder */}
                          <div className="w-6 h-6 bg-white/10 rounded-sm group-hover:bg-white/20 transition-colors" /> 
                       </div>
                       <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
                       <p className="text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors">
                         {feature.description}
                       </p>
                    </FadeIn>
                  ))}
               </div>
            </section>
          )}
    
          {/* 3. Process Section (Sticky Scroll) */}
          {process && process.length > 0 && (
            <section className="mb-40">
               <div className="text-center mb-24">
                  <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                    Nuestro Proceso
                  </h2>
                  <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
                    Una metodología probada que elimina la incertidumbre y garantiza la excelencia en cada entrega.
                  </p>
               </div>
               <ServiceProcess steps={process} />
            </section>
          )}
    
          {/* 5. FAQs (Animated) */}
          {faqs && faqs.length > 0 && (
              <section className="max-w-3xl mx-auto mb-40">
                  <FadeIn className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                      Preguntas Frecuentes
                    </h2>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <ServiceFAQ faqs={faqs} />
                  </FadeIn>
              </section>
          )}
    
          {/* 6. CTA Section */}
          <section className="text-center py-20 relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900/50 to-neutral-950 border border-neutral-800">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50 blur-3xl" />
              <FadeIn className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">
                  ¿Listo para empezar?
                </h2>
                <p className="text-neutral-400 text-xl mb-10 max-w-2xl mx-auto">
                  Agenda una llamada estratégica con nuestro equipo y descubre cómo podemos ayudarte.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <Button size="lg" className="bg-white text-black hover:bg-neutral-200 text-base h-14 px-8 rounded-full transition-transform hover:scale-105">
                     Agendar Llamada
                  </Button>
                  <Button size="lg" variant="outline" className="border-neutral-800 text-white hover:bg-neutral-900 text-base h-14 px-8 rounded-full transition-transform hover:scale-105">
                     Ver Portfolio <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </FadeIn>
          </section>

        </div>
      </TracingBeam>
    </div>
  );
}
