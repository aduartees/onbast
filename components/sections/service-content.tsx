"use client";
import React from "react";
import { CheckCircle2, ArrowRight, BarChart3, Users, Zap, MessageSquare, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ServiceFAQ } from "./service-faq";
import { ServiceProcess } from "./service-process";
import { WobbleCard } from "@/components/aceternity/wobble-card";
import { TracingBeam } from "@/components/aceternity/tracing-beam";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { TeamSection } from "@/components/sections/team";
import { PricingSection } from "@/components/sections/pricing-section";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";

interface ServiceContentProps {
  mainImage?: string;
  features?: {
    title: string;
    description: string;
    icon?: string;
  }[];
  featuresTitle?: string;
  benefits?: string[];
  process?: {
    title: string;
    description: string;
    imageUrl?: string;
  }[];
  processTitle?: string;
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
  teamTitle?: string;
  testimonials?: {
    name: string;
    role: string;
    quote: string;
    imageUrl?: string;
  }[];
  testimonialsTitle?: string;
  pricing?: {
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
  faqs?: {
    question: string;
    answer: string;
  }[];
  faqTitle?: string;
}

export function ServiceContent({ mainImage, features, featuresTitle, benefits, process, processTitle, longDescription, overviewText, problem, solution, technologies, impactSection, team, teamTitle, testimonials, testimonialsTitle, pricing, faqs, faqTitle }: ServiceContentProps) {
  return (
    <div className="bg-neutral-950 min-h-screen py-8 md:py-12 px-4 md:px-6 relative z-20">
      
      {/* Ambient Background Glow - Subtle - Wrapped in overflow hidden container to prevent scroll */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-900/10 blur-[80px] rounded-full" />
      </div>

      {/* Responsive Tracing Beam: Hidden on mobile, visible on lg+ */}
      <div className="hidden lg:block">
        <TracingBeam className="px-4 max-w-6xl mx-auto">
           <ContentWrapper 
             mainImage={mainImage}
             features={features} featuresTitle={featuresTitle}
             benefits={benefits} process={process} processTitle={processTitle}
             longDescription={longDescription} overviewText={overviewText} 
             problem={problem} solution={solution} technologies={technologies} 
             impactSection={impactSection} team={team} teamTitle={teamTitle}
             testimonials={testimonials} testimonialsTitle={testimonialsTitle}
             pricing={pricing}
             faqs={faqs} faqTitle={faqTitle}
           />
        </TracingBeam>
      </div>

      {/* Mobile/Tablet Content without TracingBeam */}
      <div className="lg:hidden">
         <ContentWrapper 
             mainImage={mainImage}
             features={features} featuresTitle={featuresTitle}
             benefits={benefits} process={process} processTitle={processTitle}
             longDescription={longDescription} overviewText={overviewText} 
             problem={problem} solution={solution} technologies={technologies} 
             impactSection={impactSection} team={team} teamTitle={teamTitle}
             testimonials={testimonials} testimonialsTitle={testimonialsTitle}
             pricing={pricing}
             faqs={faqs} faqTitle={faqTitle}
           />
      </div>
    </div>
  );
}

// Extracted Content Component to reuse
const ContentWrapper = ({ mainImage, features, featuresTitle, benefits, process, processTitle, longDescription, overviewText, problem, solution, technologies, impactSection, team, teamTitle, testimonials, testimonialsTitle, pricing, faqs, faqTitle }: ServiceContentProps) => {
    return (
        <div className="max-w-6xl mx-auto pt-4 antialiased relative pb-16">
          
          {/* 1. Strategic Vision & Transformation */}
          <section className="mb-20 md:mb-32 relative max-w-5xl mx-auto px-4">
             {/* Large Editorial Intro */}
             <FadeIn>
                <div className="prose prose-invert max-w-none mb-16 md:mb-24">
                   <h2 className="text-2xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-white/90 font-sans">
                      {longDescription || "Transforming your digital presence."}
                   </h2>
                   {overviewText && (
                      <p className="text-lg md:text-2xl text-neutral-400 mt-8 font-light leading-relaxed border-l-2 border-indigo-500/50 pl-6">
                        {overviewText}
                      </p>
                   )}
                </div>
             </FadeIn>

             {/* Transformation Row (Problem -> Solution) */}
             {(problem || solution) && (
                <FadeIn delay={0.2} className="relative">
                   {/* Connection Line */}
                   <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent hidden md:block" />
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 relative z-10">
                      {/* Current State (Problem) */}
                      <div className="bg-neutral-900/30 backdrop-blur-sm border border-white/5 p-8 md:p-10 rounded-2xl relative group hover:border-red-500/20 transition-colors duration-500">
                         <div className="absolute -top-3 left-8 px-3 py-1 bg-neutral-950 border border-white/10 text-[10px] text-neutral-500 uppercase tracking-widest rounded-full">
                            El Desafío
                         </div>
                         <p className="text-neutral-400 text-lg leading-relaxed font-light">
                            {problem || "Identificamos los cuellos de botella."}
                         </p>
                      </div>

                      {/* Future State (Solution) */}
                      <div className="bg-neutral-900/30 backdrop-blur-sm border border-indigo-500/20 p-8 md:p-10 rounded-2xl relative group hover:border-indigo-500/40 transition-colors duration-500 shadow-lg shadow-indigo-900/5">
                         <div className="absolute -top-3 left-8 px-3 py-1 bg-indigo-950 border border-indigo-500/30 text-[10px] text-indigo-300 uppercase tracking-widest rounded-full shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                            La Solución
                         </div>
                         <p className="text-white/90 text-lg leading-relaxed font-light">
                            {solution || "Implementamos la estrategia ganadora."}
                         </p>
                         {/* Glowing orb effect */}
                         <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                      </div>
                   </div>
                   
                   {/* Center Arrow Icon (Desktop) */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-neutral-950 border border-white/10 text-neutral-500 z-20 shadow-xl">
                      <ArrowRight className="w-4 h-4" />
                   </div>
                </FadeIn>
             )}
          </section>
    
          {/* 2. Tech Stack - Ultra Minimalist */}
          {technologies && technologies.length > 0 && (
              <FadeIn className="mb-20 md:mb-28 py-8 relative max-w-4xl mx-auto">
                   <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent opacity-50" />
                  <div className="text-center mb-8 relative z-10">
                    <span className="px-3 py-1 bg-neutral-950 text-neutral-500 text-[10px] font-medium uppercase tracking-[0.2em] border border-neutral-800 rounded-full">
                        Stack Tecnológico
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 relative z-10 max-w-3xl mx-auto">
                      {technologies.map((tech, i) => (
                          <span key={i} className="px-4 py-1.5 rounded-full bg-neutral-900/50 border border-white/5 text-neutral-400 font-mono text-xs hover:text-white hover:border-neutral-700 transition-colors cursor-default">
                              {tech}
                          </span>
                      ))}
                  </div>
              </FadeIn>
          )}
    
          {/* Impact Section - Clean Grid */}
          {impactSection && impactSection.cards && impactSection.cards.length > 0 && (
            <section className="mb-20 md:mb-28 max-w-5xl mx-auto">
               {impactSection.title && (
                 <FadeIn>
                    <SectionHeading title={impactSection.title} subtitle="Impacto" highlight="Real" />
                 </FadeIn>
               )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                {impactSection.cards.map((card, i) => (
                  <div 
                    key={i} 
                    className={cn(
                        "relative overflow-hidden rounded-2xl bg-neutral-900/20 border border-white/5 p-6 group hover:border-white/10 transition-colors",
                        card.colSpan === 2 ? "md:col-span-2" : "md:col-span-1",
                        "min-h-[200px] flex flex-col justify-between"
                    )}
                  >
                     <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                        <p className="text-sm text-neutral-400 leading-relaxed">{card.description}</p>
                     </div>
                     
                     {/* Abstract Decorative Elements based on color */}
                     <div className={cn(
                         "absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity",
                         card.color === "blue" && "bg-blue-500",
                         card.color === "pink" && "bg-pink-500",
                         card.color === "indigo" && "bg-indigo-500",
                         !card.color && "bg-white"
                     )} />
                     
                     {card.imageUrl && (
                         <div className="absolute right-0 bottom-0 w-1/2 h-1/2 opacity-30 group-hover:opacity-50 transition-opacity">
                             <Image 
                                src={card.imageUrl}
                                alt={card.title}
                                width={200}
                                height={200}
                                className="object-contain object-bottom-right w-full h-full"
                             />
                         </div>
                     )}
                  </div>
                ))}
              </div>
            </section>
          )}
    
    
          {/* Features Grid - Small Cards */}
          {features && features.length > 0 && (
            <section className="mb-20 md:mb-28 max-w-5xl mx-auto">
               <FadeIn>
                  <SectionHeading 
                    title={featuresTitle || "Características"} 
                    subtitle="Detalles" 
                    highlight="Premium" 
                  />
               </FadeIn>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {features.map((feature, i) => (
                    <FadeIn delay={i * 0.1} key={i} className="p-6 rounded-2xl bg-neutral-900/10 border border-white/5 hover:bg-neutral-900/30 transition-all duration-300 group">
                       <div className="mb-4 w-10 h-10 rounded-lg bg-neutral-800/50 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/10 transition-colors">
                          <Zap className="w-5 h-5" />
                       </div>
                       <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">{feature.title}</h3>
                       <p className="text-neutral-400 text-sm leading-relaxed font-light">
                         {feature.description}
                       </p>
                    </FadeIn>
                  ))}
               </div>
            </section>
          )}

          {/* Team Section */}
          {team && team.length > 0 && (
            <section className="mb-20 md:mb-28 max-w-4xl mx-auto">
                <FadeIn>
                   <SectionHeading 
                     title={teamTitle || "Nuestro Equipo"} 
                     subtitle="Talento" 
                     highlight="Experto" 
                   />
                </FadeIn>
                <TeamSection team={team} />
            </section>
          )}

          {/* Testimonials Section */}
          {testimonials && testimonials.length > 0 && (
            <section className="mb-20 md:mb-28 max-w-4xl mx-auto">
                <FadeIn>
                   <SectionHeading 
                     title={testimonialsTitle || "Testimonios"} 
                     subtitle="Confianza" 
                     highlight="Real" 
                   />
                </FadeIn>
                <TestimonialsSection testimonials={testimonials} />
            </section>
          )}

          {/* Process Section (Sticky Scroll) */}
           {process && process.length > 0 && (
             <section className="mb-0 w-full">
                <FadeIn className="max-w-4xl mx-auto">
                   <SectionHeading 
                     title={processTitle || "Nuestro Proceso"} 
                     subtitle="Metodología" 
                     highlight="Ágil" 
                   />
                </FadeIn>
                <ServiceProcess steps={process} />
             </section>
           )}

          {/* Pricing Section */}
          {pricing && (
            <div className="mb-20 md:mb-28">
               <PricingSection pricing={pricing} />
            </div>
          )}
    
          {/* FAQs */}
          {faqs && faqs.length > 0 && (
              <section className="max-w-2xl mx-auto mb-20 md:mb-28">
                  <FadeIn>
                    <SectionHeading 
                      title={faqTitle || "Preguntas Frecuentes"} 
                      subtitle="Dudas" 
                      highlight="Resueltas" 
                    />
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <ServiceFAQ faqs={faqs} />
                  </FadeIn>
              </section>
          )}

          {/* CTA Section - Clean */}
          <section className="text-center py-16 relative overflow-hidden rounded-3xl bg-neutral-900/10 border border-white/5 max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
              <FadeIn className="relative z-10 max-w-2xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter mb-4">
                  ¿Listo para comenzar?
                </h2>
                <p className="text-neutral-400 text-base mb-8 max-w-lg mx-auto font-light">
                  Agenda una llamada estratégica con nuestro equipo y descubre cómo podemos transformar tu negocio.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" className="bg-white text-black hover:bg-neutral-200 text-sm font-medium h-12 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
                     Agendar Llamada
                  </Button>
                  <Button size="lg" variant="ghost" className="text-neutral-300 hover:text-white hover:bg-white/5 text-sm h-12 px-8 rounded-full">
                     Ver Portfolio <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </FadeIn>
          </section>

        </div>
    );
};