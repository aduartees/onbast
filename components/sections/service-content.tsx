"use client";
import React from "react";
import { CheckCircle2, ArrowRight, BarChart3, Users, Zap, MessageSquare, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlurReveal } from "@/components/ui/blur-reveal";

// Lazy load heavy components
const ServiceFAQ = dynamic(() => import("./service-faq").then(mod => mod.ServiceFAQ), { ssr: false });
const ServiceProcess = dynamic(() => import("./service-process").then(mod => mod.ServiceProcess), { ssr: false });
const TestimonialsSection = dynamic(() => import("@/components/sections/testimonials").then(mod => mod.TestimonialsSection));
const TeamSection = dynamic(() => import("@/components/sections/team").then(mod => mod.TeamSection));
const PricingSection = dynamic(() => import("@/components/sections/pricing-section").then(mod => mod.PricingSection));
const ImpactStats = dynamic(() => import("@/components/sections/impact-stats").then(mod => mod.ImpactStats));

// Removed imports that are now dynamic
import { WobbleCard } from "@/components/aceternity/wobble-card";
import { TracingBeam } from "@/components/aceternity/tracing-beam";

interface ServiceContentProps {
  mainImage?: string;
  features?: {
    title: string;
    description: string;
    icon?: string;
  }[];
  featuresTitle?: string;
  featuresDescription?: string;
  benefits?: string[];
  process?: {
    title: string;
    description: string;
  }[];
  processTitle?: string;
  processDescription?: string;
  longDescription?: string;
  overviewText?: string;
  technologies?: string[];
  techTitle?: string;
  techDescription?: string;
  impactSection?: {
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
  team?: {
    name: string;
    role: string;
    imageUrl: string;
    imageAlt?: string;
    social?: { linkedin?: string; twitter?: string };
  }[];
  teamTitle?: string;
  teamDescription?: string;
  testimonials?: {
    name: string;
    role: string;
    quote: string;
    imageUrl?: string;
  }[];
  testimonialsTitle?: string;
  testimonialsDescription?: string;
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
  faqDescription?: string;
  ctaSection?: {
    title?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
  };
}

export function ServiceContent({ mainImage, features, featuresTitle, featuresDescription, benefits, process, processTitle, processDescription, longDescription, overviewText, technologies, techTitle, techDescription, impactSection, team, teamTitle, teamDescription, testimonials, testimonialsTitle, testimonialsDescription, pricing, faqs, faqTitle, faqDescription, ctaSection }: ServiceContentProps) {
  return (
    <div className="bg-neutral-950 min-h-screen py-12 md:py-24 px-4 md:px-6 relative z-10 rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-50px_100px_-20px_rgba(79,70,229,0.1)] border-t border-white/10 mt-0 transform-gpu backface-hidden">
      
      {/* Ambient Background Glow - Subtle - Wrapped in overflow hidden container to prevent scroll */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-[3rem] md:rounded-t-[5rem]">
          {/* Static Background Layer to prevent bleed-through */}
          <div className="absolute inset-0 bg-neutral-950 z-[-1]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-900/10 blur-[60px] rounded-full transform-gpu will-change-transform" />
      </div>

      {/* Responsive Tracing Beam: Hidden on mobile, visible on lg+ */}
      <div className="hidden lg:block">
        <TracingBeam className="px-4 max-w-6xl mx-auto">
           <ContentWrapper 
             mainImage={mainImage}
             features={features} featuresTitle={featuresTitle} featuresDescription={featuresDescription}
             benefits={benefits} process={process} processTitle={processTitle} processDescription={processDescription}
             longDescription={longDescription} overviewText={overviewText} 
             technologies={technologies} techTitle={techTitle} techDescription={techDescription}
             impactSection={impactSection} team={team} teamTitle={teamTitle} teamDescription={teamDescription}
             testimonials={testimonials} testimonialsTitle={testimonialsTitle} testimonialsDescription={testimonialsDescription}
             pricing={pricing}
             faqs={faqs} faqTitle={faqTitle} faqDescription={faqDescription}
             ctaSection={ctaSection}
           />
        </TracingBeam>
      </div>

      {/* Mobile/Tablet Content without TracingBeam */}
      <div className="lg:hidden">
         <ContentWrapper 
             mainImage={mainImage}
             features={features} featuresTitle={featuresTitle} featuresDescription={featuresDescription}
             benefits={benefits} process={process} processTitle={processTitle} processDescription={processDescription}
             longDescription={longDescription} overviewText={overviewText} 
             technologies={technologies} techTitle={techTitle} techDescription={techDescription}
             impactSection={impactSection} team={team} teamTitle={teamTitle} teamDescription={teamDescription}
             testimonials={testimonials} testimonialsTitle={testimonialsTitle} testimonialsDescription={testimonialsDescription}
             pricing={pricing}
             faqs={faqs} faqTitle={faqTitle} faqDescription={faqDescription}
             ctaSection={ctaSection}
           />
      </div>
    </div>
  );
}

// Extracted Content Component to reuse
const ContentWrapper = ({ mainImage, features, featuresTitle, featuresDescription, benefits, process, processTitle, processDescription, longDescription, overviewText, technologies, techTitle, techDescription, impactSection, team, teamTitle, teamDescription, testimonials, testimonialsTitle, testimonialsDescription, pricing, faqs, faqTitle, faqDescription, ctaSection }: ServiceContentProps) => {
    return (
        <div className="max-w-6xl mx-auto pt-4 antialiased relative pb-16">
          
          {/* 1. Strategic Vision & Transformation */}
          <section className="mb-20 md:mb-32 relative max-w-5xl mx-auto px-4">
             {/* Large Editorial Intro */}
             <FadeIn>
                <div className="prose prose-invert max-w-none mb-16 md:mb-24">
                   <h2 className="text-2xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-white/90 font-sans">
                      <BlurReveal text={longDescription || "Transforming your digital presence."} />
                   </h2>
                   {overviewText && (
                      <p className="text-lg md:text-2xl text-neutral-400 mt-8 font-light leading-relaxed border-l-2 border-indigo-500/50 pl-6">
                        {overviewText}
                      </p>
                   )}
                </div>
             </FadeIn>
          </section>
    
          {/* 2. Tech Stack - Ultra Minimalist */}
          {technologies && technologies.length > 0 && (
              <FadeIn className="mb-20 md:mb-28 py-8 relative max-w-4xl mx-auto">
                  <div className="text-center mb-8 relative z-10">
                    <div className="relative flex justify-center items-center mb-6">
                        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent opacity-50" />
                        <div className="relative z-10 bg-neutral-950 px-2">
                            <span className="inline-block px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-xs font-medium uppercase tracking-wider">
                                {techTitle || "Stack Tecnológico"}
                            </span>
                        </div>
                    </div>
                    {techDescription && (
                        <p className="text-neutral-400 text-sm max-w-lg mx-auto font-light leading-relaxed">
                            {techDescription}
                        </p>
                    )}
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
    
          {/* Impact Section - Clean Stats */}
          {impactSection && impactSection.stats && impactSection.stats.length > 0 && (
             <ImpactStats impact={impactSection} />
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
                  {featuresDescription && (
                    <p className="text-neutral-400 mt-6 text-lg max-w-2xl mx-auto font-light leading-relaxed text-center">
                        {featuresDescription}
                    </p>
                  )}
               </FadeIn>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
                  {features.map((feature, i) => (
                    <FadeIn delay={i * 0.1} key={i} noVertical className="p-6 rounded-2xl bg-neutral-900/10 border border-white/5 hover:bg-neutral-900/30 transition-all duration-300 group">
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
                   {teamDescription && (
                     <p className="text-neutral-400 mt-6 text-lg max-w-2xl mx-auto font-light leading-relaxed text-center">
                         {teamDescription}
                     </p>
                   )}
                </FadeIn>
                <div className="mt-12">
                   <TeamSection team={team} />
                </div>
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
                   {testimonialsDescription && (
                     <p className="text-neutral-400 mt-6 text-lg max-w-2xl mx-auto font-light leading-relaxed text-center">
                         {testimonialsDescription}
                     </p>
                   )}
                </FadeIn>
                <div className="mt-12">
                   <TestimonialsSection testimonials={testimonials} />
                </div>
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
                   {processDescription && (
                     <p className="text-neutral-400 mt-6 text-lg max-w-2xl mx-auto font-light leading-relaxed text-center mb-12">
                         {processDescription}
                     </p>
                   )}
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
                    {faqDescription && (
                      <p className="text-neutral-400 mt-6 text-lg max-w-2xl mx-auto font-light leading-relaxed text-center">
                          {faqDescription}
                      </p>
                    )}
                  </FadeIn>
                  <FadeIn delay={0.2} className="mt-12">
                    <ServiceFAQ faqs={faqs} />
                  </FadeIn>
              </section>
          )}

          {/* CTA Section - Clean */}
          <section className="text-center py-16 relative overflow-hidden rounded-3xl bg-neutral-900/10 border border-white/5 max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
              <FadeIn className="relative z-10 max-w-2xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter mb-4">
                  {ctaSection?.title || "¿Listo para comenzar?"}
                </h2>
                <p className="text-neutral-400 text-base mb-8 max-w-lg mx-auto font-light">
                  {ctaSection?.description || "Agenda una llamada estratégica con nuestro equipo y descubre cómo podemos transformar tu negocio."}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button size="lg" className="bg-white text-black hover:bg-neutral-200 text-sm font-medium h-12 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
                     {ctaSection?.buttonText || "Agendar Llamada"}
                  </Button>
                  <Button size="lg" variant="outline" className="text-neutral-300 hover:text-white hover:bg-white/5 border-neutral-800 text-sm h-12 px-8 rounded-full">
                     {ctaSection?.secondaryButtonText || "Ver Portfolio"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </FadeIn>
          </section>

        </div>
    );
};