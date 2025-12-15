"use client";
import React from "react";
import { CheckCircle2, ArrowRight, BarChart3, Users, Zap, MessageSquare } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ServiceFAQ } from "./service-faq";
import { ServiceProcess } from "./service-process";
import { WobbleCard } from "@/components/aceternity/wobble-card";
import { TracingBeam } from "@/components/aceternity/tracing-beam";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { TeamSection } from "@/components/sections/team";
import { FadeIn } from "@/components/ui/fade-in";

// Helper for mixed typography titles
const SectionHeading = ({ 
  title, 
  subtitle, 
  highlight, 
  align = "center" 
}: { 
  title: string; 
  subtitle?: string; 
  highlight?: string; 
  align?: "left" | "center" 
}) => {
  return (
    <div className={cn("mb-12 md:mb-20", align === "center" ? "text-center" : "text-left")}>
      {subtitle && (
        <span className="block text-indigo-400 font-mono text-xs md:text-sm tracking-[0.2em] uppercase mb-4">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
        <span className="font-serif italic font-light">{title.split(" ")[0]}</span>{" "}
        <span className="font-sans">{title.split(" ").slice(1).join(" ")}</span>
        {highlight && <span className="block text-indigo-400 font-serif italic mt-1">{highlight}</span>}
      </h2>
      <div className={cn("h-1 w-20 bg-indigo-500 mt-6 rounded-full", align === "center" ? "mx-auto" : "")} />
    </div>
  );
};

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
  team?: {
    name: string;
    role: string;
    imageUrl: string;
    imageAlt?: string;
    social?: { linkedin?: string; twitter?: string };
  }[];
  testimonials?: {
    name: string;
    role: string;
    quote: string;
    imageUrl?: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export function ServiceContent({ features, benefits, process, longDescription, overviewText, problem, solution, technologies, impactSection, team, testimonials, faqs }: ServiceContentProps) {
  return (
    <div className="bg-neutral-950 min-h-screen py-10 md:py-20 px-4 md:px-8 relative z-20 overflow-hidden">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Responsive Tracing Beam: Hidden on mobile, visible on lg+ */}
      <div className="hidden lg:block">
        <TracingBeam className="px-6">
           <ContentWrapper 
             features={features} benefits={benefits} process={process} 
             longDescription={longDescription} overviewText={overviewText} 
             problem={problem} solution={solution} technologies={technologies} 
             impactSection={impactSection} team={team} testimonials={testimonials} faqs={faqs} 
           />
        </TracingBeam>
      </div>

      {/* Mobile/Tablet Content without TracingBeam to fix "compact" feel */}
      <div className="lg:hidden">
         <ContentWrapper 
             features={features} benefits={benefits} process={process} 
             longDescription={longDescription} overviewText={overviewText} 
             problem={problem} solution={solution} technologies={technologies} 
             impactSection={impactSection} team={team} testimonials={testimonials} faqs={faqs} 
           />
      </div>
    </div>
  );
}

// Extracted Content Component to reuse
const ContentWrapper = ({ features, benefits, process, longDescription, overviewText, problem, solution, technologies, impactSection, team, testimonials, faqs }: ServiceContentProps) => {
    return (
        <div className="max-w-7xl mx-auto pt-10 antialiased relative pb-32">
          
          {/* 1. Overview Section & Problem/Solution */}
          <section className="mb-32 md:mb-48 relative">
            <FadeIn className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-24">
              <div>
                <SectionHeading 
                    title="Visión General" 
                    subtitle="El Contexto" 
                    align="left"
                    highlight="Transformación Digital"
                />
                <div className="prose prose-invert prose-lg text-neutral-400 leading-relaxed font-light">
                   {/* Fallback if no long description */}
                  <p className="text-lg md:text-xl leading-8">{longDescription || "Este servicio está diseñado para transformar tu presencia digital mediante estrategias avanzadas y tecnología de vanguardia."}</p>
                  
                  {/* Dynamic Overview Text */}
                  {overviewText && (
                    <p className="mt-8 border-l-4 border-indigo-500 pl-6 italic text-neutral-300 text-lg md:text-xl font-serif">
                      "{overviewText}"
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-neutral-900/30 p-8 md:p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-md relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                 <h3 className="text-2xl font-bold text-white mb-8 relative z-10 flex items-center gap-3 font-serif">
                    <span className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                    Beneficios Clave
                 </h3>
                 <ul className="space-y-6 relative z-10">
                    {benefits?.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-4 group">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
                            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                        </div>
                        <span className="text-neutral-300 font-light group-hover:text-white transition-colors text-base md:text-lg">{benefit}</span>
                      </li>
                    ))}
                    {!benefits && (
                      <li className="text-neutral-500 italic">No benefits listed available.</li>
                    )}
                 </ul>
              </div>
            </FadeIn>
    
            {/* Problem vs Solution - High Contrast Cards */}
            {(problem || solution) && (
                <FadeIn delay={0.2} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-10 md:p-14 rounded-[2.5rem] bg-neutral-900 border border-white/5 relative overflow-hidden group hover:border-red-500/30 transition-colors duration-500">
                        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <h3 className="text-red-400 font-bold mb-6 uppercase tracking-widest text-xs relative z-10 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> El Reto
                        </h3>
                        <p className="text-neutral-200 text-xl md:text-2xl font-serif leading-relaxed relative z-10">
                            {problem || "Muchas empresas luchan por destacar en un mercado saturado."}
                        </p>
                    </div>
                    <div className="p-10 md:p-14 rounded-[2.5rem] bg-neutral-900 border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-500">
                         <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <h3 className="text-emerald-400 font-bold mb-6 uppercase tracking-widest text-xs relative z-10 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> La Solución
                        </h3>
                        <p className="text-neutral-200 text-xl md:text-2xl font-serif leading-relaxed relative z-10">
                            {solution || "Implementamos estrategias data-driven para garantizar resultados."}
                        </p>
                    </div>
                </FadeIn>
            )}
          </section>
    
          {/* 2. Tech Stack - Minimalist */}
          {technologies && technologies.length > 0 && (
              <FadeIn className="mb-32 md:mb-48 py-12 relative">
                   <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent opacity-50" />
                  <div className="text-center mb-12 relative z-10">
                    <span className="px-6 py-2 bg-neutral-950 text-neutral-400 text-xs font-medium uppercase tracking-[0.2em] border border-neutral-800 rounded-full">
                        Tecnología
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 md:gap-8 relative z-10 max-w-5xl mx-auto">
                      {technologies.map((tech, i) => (
                          <span key={i} className="px-6 py-3 rounded-full bg-neutral-900/80 border border-white/5 text-neutral-400 font-mono text-sm md:text-base hover:text-white hover:border-neutral-600 transition-all hover:-translate-y-1 cursor-default backdrop-blur-md shadow-lg">
                              {tech}
                          </span>
                      ))}
                  </div>
              </FadeIn>
          )}
    
          {/* NEW: Impact / Wobble Card Section (Dynamic) */}
          {impactSection && impactSection.cards && impactSection.cards.length > 0 && (
            <section className="mb-32 md:mb-48">
               {impactSection.title && (
                 <FadeIn>
                    <SectionHeading title={impactSection.title} subtitle="Resultados" highlight="Medibles" />
                 </FadeIn>
               )}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                {impactSection.cards.map((card, i) => (
                  <WobbleCard
                    key={i}
                    containerClassName={cn(
                      "min-h-[300px] lg:min-h-[400px] bg-neutral-900/40 border border-white/5 backdrop-blur-sm",
                      card.colSpan === 2 ? "lg:col-span-2" : "lg:col-span-1",
                      card.color === "blue" && "bg-blue-900/10", // Tint styles
                      card.color === "pink" && "bg-pink-900/10",
                      card.color === "indigo" && "bg-indigo-900/10"
                    )}
                  >
                    <div className="max-w-md relative z-10">
                      <h2 className="text-left text-balance text-3xl md:text-4xl font-bold tracking-tight text-white font-serif">
                        {card.title}
                      </h2>
                      <p className="mt-4 text-left text-base md:text-lg text-neutral-300 font-light leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                    {card.imageUrl && (
                       <Image
                        src={card.imageUrl}
                        width={500}
                        height={500}
                        alt={card.imageAlt || "Imagen de impacto"}
                        className="absolute -right-4 lg:-right-[20%] -bottom-10 object-contain rounded-2xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-500"
                      />
                    )}
                     {!card.imageUrl && (
                       <div className="absolute -right-4 lg:-right-[40%] -bottom-10 w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
                    )}
                  </WobbleCard>
                ))}
              </div>
            </section>
          )}
    
    
          {/* 2. Features Grid (Bento Style) */}
          {features && features.length > 0 && (
            <section className="mb-32 md:mb-48">
               <FadeIn>
                  <SectionHeading title="Características" subtitle="Detalles" highlight="Premium" />
               </FadeIn>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {features.map((feature, i) => (
                    <FadeIn delay={i * 0.1} key={i} className={cn(
                      "p-10 md:p-12 rounded-[2.5rem] bg-neutral-900/20 border border-white/5 hover:bg-neutral-900/40 transition-all duration-500 group hover:border-white/10 flex flex-col justify-between",
                      i === 0 || i === 3 ? "md:col-span-2" : "md:col-span-1"
                    )}>
                       <div>
                           <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-neutral-800/50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:bg-indigo-500/20 border border-white/5 group-hover:border-indigo-500/30">
                              {/* Placeholder icon - ideally dynamic */}
                              <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-sm group-hover:bg-indigo-400 transition-colors" /> 
                           </div>
                           <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors font-serif">{feature.title}</h3>
                           <p className="text-neutral-400 leading-relaxed font-light group-hover:text-neutral-200 transition-colors text-base md:text-lg">
                             {feature.description}
                           </p>
                       </div>
                    </FadeIn>
                  ))}
               </div>
            </section>
          )}

          {/* NEW: Team Section */}
          {team && team.length > 0 && (
            <section className="mb-32 md:mb-48">
                <FadeIn>
                   <SectionHeading title="Nuestro Equipo" subtitle="Expertos" highlight="Dedicados" />
                </FadeIn>
                <TeamSection team={team} />
            </section>
          )}

          {/* NEW: Testimonials Section */}
          {testimonials && testimonials.length > 0 && (
            <section className="mb-32 md:mb-48">
                <FadeIn>
                   <SectionHeading title="Testimonios" subtitle="Confianza" highlight="Real" />
                </FadeIn>
                <TestimonialsSection testimonials={testimonials} />
            </section>
          )}
    
          {/* 3. Process Section (Sticky Scroll) */}
           {process && process.length > 0 && (
             <section className="mb-32 md:mb-48">
                <FadeIn>
                   <SectionHeading title="Nuestro Proceso" subtitle="Metodología" highlight="Ágil" />
                </FadeIn>
                <ServiceProcess steps={process} />
             </section>
           )}
    
          {/* 5. FAQs (Animated) */}
          {faqs && faqs.length > 0 && (
              <section className="max-w-3xl mx-auto mb-32 md:mb-48">
                  <FadeIn>
                    <SectionHeading title="Preguntas Frecuentes" subtitle="Dudas" highlight="Resueltas" />
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <ServiceFAQ faqs={faqs} />
                  </FadeIn>
              </section>
          )}

          {/* 6. CTA Section - Glassmorphism */}
          <section className="text-center py-16 md:py-24 relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-neutral-900/20 border border-white/10 backdrop-blur-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />
              <FadeIn className="relative z-10 max-w-4xl mx-auto px-6">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter mb-6 md:mb-8 font-serif">
                  ¿Listo para escalar?
                </h2>
                <p className="text-neutral-300 text-lg md:text-2xl font-light mb-10 md:mb-12 max-w-2xl mx-auto">
                  Agenda una llamada estratégica con nuestro equipo y descubre cómo podemos transformar tu negocio.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                  <Button size="lg" className="bg-white text-black hover:bg-neutral-200 text-lg h-14 md:h-16 px-8 md:px-10 rounded-full transition-transform hover:scale-105 font-medium shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                     Agendar Llamada
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/5 text-lg h-14 md:h-16 px-8 md:px-10 rounded-full transition-transform hover:scale-105 backdrop-blur-md">
                     Ver Portfolio <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </FadeIn>
          </section>

        </div>
    );
};
