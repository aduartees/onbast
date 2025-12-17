"use client";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, BarChart3, Users, Zap, MessageSquare, Star } from "lucide-react";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlurReveal } from "@/components/ui/blur-reveal";
import Link from "next/link";

// Lazy load heavy components
const ServiceFAQ = dynamic(() => import("./service-faq").then(mod => mod.ServiceFAQ), { ssr: false });
const ServiceProcess = dynamic(() => import("./service-process").then(mod => mod.ServiceProcess), { ssr: false });
const TestimonialsSection = dynamic(() => import("@/components/sections/testimonials").then(mod => mod.TestimonialsSection));
const TeamSection = dynamic(() => import("@/components/sections/team").then(mod => mod.TeamSection));
const PricingSection = dynamic(() => import("@/components/sections/pricing-section").then(mod => mod.PricingSection));
const ImpactStats = dynamic(() => import("@/components/sections/impact-stats").then(mod => mod.ImpactStats));

// Removed imports that are now dynamic
import { TracingBeam } from "@/components/aceternity/tracing-beam";

import { ParallaxScroll } from "@/components/aceternity/parallax-scroll";

interface ServiceContentProps {
  mainImage?: string;
  relatedProjects?: {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
    link?: string;
  }[];
  features?: {
    title: string;
    description: string;
    icon?: string;
  }[];
  featuresTitle?: string;
  featuresHighlight?: string;
  featuresDescription?: string;
  benefits?: string[];
  process?: {
    title: string;
    description: string;
  }[];
  processTitle?: string;
  processHighlight?: string;
  processDescription?: string;
  longDescription?: string;
  overviewText?: string;
  technologies?: string[];
  techTitle?: string;
  techHighlight?: string;
  techDescription?: string;
  impactSection?: {
    title?: string;
    highlight?: string;
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
  teamHighlight?: string;
  teamDescription?: string;
  testimonials?: {
    name: string;
    role: string;
    quote: string;
    imageUrl?: string;
  }[];
  testimonialsTitle?: string;
  testimonialsHighlight?: string;
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
  faqHighlight?: string;
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

export function ServiceContent({ mainImage, relatedProjects, features, featuresTitle, featuresHighlight, featuresDescription, benefits, process, processTitle, processHighlight, processDescription, longDescription, overviewText, technologies, techTitle, techHighlight, techDescription, impactSection, team, teamTitle, teamHighlight, teamDescription, testimonials, testimonialsTitle, testimonialsHighlight, testimonialsDescription, pricing, faqs, faqTitle, faqHighlight, faqDescription, ctaSection }: ServiceContentProps) {
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
             relatedProjects={relatedProjects}
             features={features} featuresTitle={featuresTitle} featuresHighlight={featuresHighlight} featuresDescription={featuresDescription}
             benefits={benefits} process={process} processTitle={processTitle} processHighlight={processHighlight} processDescription={processDescription}
             longDescription={longDescription} overviewText={overviewText} 
             technologies={technologies} techTitle={techTitle} techHighlight={techHighlight} techDescription={techDescription}
             impactSection={impactSection} team={team} teamTitle={teamTitle} teamHighlight={teamHighlight} teamDescription={teamDescription}
             testimonials={testimonials} testimonialsTitle={testimonialsTitle} testimonialsHighlight={testimonialsHighlight} testimonialsDescription={testimonialsDescription}
             pricing={pricing}
             faqs={faqs} faqTitle={faqTitle} faqHighlight={faqHighlight} faqDescription={faqDescription}
             ctaSection={ctaSection}
           />
        </TracingBeam>
      </div>

      {/* Mobile/Tablet Content without TracingBeam */}
      <div className="lg:hidden">
         <ContentWrapper 
             mainImage={mainImage}
             relatedProjects={relatedProjects}
             features={features} featuresTitle={featuresTitle} featuresHighlight={featuresHighlight} featuresDescription={featuresDescription}
             benefits={benefits} process={process} processTitle={processTitle} processHighlight={processHighlight} processDescription={processDescription}
             longDescription={longDescription} overviewText={overviewText} 
             technologies={technologies} techTitle={techTitle} techHighlight={techHighlight} techDescription={techDescription}
             impactSection={impactSection} team={team} teamTitle={teamTitle} teamHighlight={teamHighlight} teamDescription={teamDescription}
             testimonials={testimonials} testimonialsTitle={testimonialsTitle} testimonialsHighlight={testimonialsHighlight} testimonialsDescription={testimonialsDescription}
             pricing={pricing}
             faqs={faqs} faqTitle={faqTitle} faqHighlight={faqHighlight} faqDescription={faqDescription}
             ctaSection={ctaSection}
           />
      </div>
    </div>
  );
}

// Extracted Content Component to reuse
const ContentWrapper = ({ mainImage, relatedProjects, features, featuresTitle, featuresHighlight, featuresDescription, benefits, process, processTitle, processHighlight, processDescription, longDescription, overviewText, technologies, techTitle, techHighlight, techDescription, impactSection, team, teamTitle, teamHighlight, teamDescription, testimonials, testimonialsTitle, testimonialsHighlight, testimonialsDescription, pricing, faqs, faqTitle, faqHighlight, faqDescription, ctaSection }: ServiceContentProps) => {
    return (
        <div className="max-w-6xl mx-auto pt-4 antialiased relative pb-16">
          
          {/* 1. Strategic Vision & Transformation */}
          <section className="mb-20 md:mb-32 relative max-w-6xl mx-auto px-4">
             {/* Large Editorial Intro */}
             <FadeIn>
                <div className="flex flex-col gap-12 lg:gap-16">
                   {/* Párrafo 1: Full Width */}
                   <div className="prose prose-invert max-w-none">
                      <div className="text-2xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-white/90 font-sans">
                         <BlurReveal text={longDescription || "Transforming your digital presence."} />
                      </div>
                   </div>

                   {/* Párrafo 2 + Imagen: Side by Side (50/50 Split) */}
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                       <div className="prose prose-invert max-w-none">
                          {overviewText && (
                             <BlurReveal 
                               text={overviewText} 
                               className="text-lg md:text-xl text-neutral-400 font-light leading-relaxed border-l-2 border-indigo-500/50 pl-6" 
                               delay={0.2}
                             />
                          )}
                       </div>
                       
                       {/* Main Image - Aligned with Paragraph 2 */}
                       {mainImage && (
                          <div className="relative mt-8 lg:mt-0">
                             <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                                <Image 
                                   src={mainImage}
                                   alt="Service Overview"
                                   fill
                                   className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent pointer-events-none" />
                             </div>
                             {/* Decorative Element */}
                             <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -z-10" />
                             <div className="absolute -top-6 -left-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -z-10" />
                          </div>
                       )}
                   </div>
                </div>
             </FadeIn>
          </section>
    
          {/* Tech Stack */}
          {technologies && technologies.length > 0 && (
              <FadeIn className="mb-20 md:mb-28 max-w-5xl mx-auto">
                  <div className="text-center mb-10">
                    <SectionHeading 
                        title={techTitle || "Stack Tecnológico"} 
                        subtitle="Herramientas" 
                        highlight={techHighlight || "Core"}
                        className="justify-center"
                    />
                    {techDescription && (
                        <p className="text-neutral-400 mt-6 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed text-center">
                            {techDescription}
                        </p>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 relative z-10 max-w-3xl mx-auto">
                      {technologies.map((tech, i) => (
                          <div key={i} className="px-4 py-2 rounded-full bg-neutral-900/50 border border-white/5 text-neutral-300 font-mono text-sm hover:text-white hover:border-neutral-600 transition-colors cursor-default">
                              {tech}
                          </div>
                      ))}
                  </div>
              </FadeIn>
          )}
    
          {/* Impact Section - Clean Stats */}
          {impactSection && impactSection.stats && impactSection.stats.length > 0 && (
             <ImpactStats impact={{
                ...impactSection,
                highlight: impactSection.highlight
             }} />
          )}
    
    
          {/* Features Grid - Small Cards */}
          {features && features.length > 0 && (
            <section className="mb-20 md:mb-28 max-w-5xl mx-auto">
               <FadeIn>
                  <SectionHeading 
                    title={featuresTitle || "Características"} 
                    subtitle="Detalles" 
                    highlight={featuresHighlight || "Premium"} 
                  />
                  {featuresDescription && (
                    <p className="text-neutral-400 mt-6 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed text-center">
                        {featuresDescription}
                    </p>
                  )}
               </FadeIn>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "0px" }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="p-6 rounded-2xl bg-neutral-900/10 border border-white/5 hover:bg-neutral-900/30 transition-all duration-300 group"
                    >
                       <div className="mb-4 w-10 h-10 rounded-lg bg-neutral-800/50 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/10 transition-colors">
                          <Zap className="w-5 h-5" />
                       </div>
                       <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">{feature.title}</h3>
                       <p className="text-neutral-400 text-sm leading-relaxed font-light">
                         {feature.description}
                       </p>
                    </motion.div>
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
                     highlight={teamHighlight || "Experto"} 
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
                     highlight={testimonialsHighlight || "Real"} 
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
                     highlight={processHighlight || "Ágil"} 
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

          {/* Related Projects Section */}
          {relatedProjects && relatedProjects.length > 0 && (
             <section className="mb-20 md:mb-28 w-full">
                <FadeIn className="max-w-4xl mx-auto px-4 mb-12">
                   <SectionHeading 
                     title="Proyectos Relacionados" 
                     subtitle="Casos de Éxito" 
                     highlight="Destacados" 
                   />
                   <p className="text-neutral-400 mt-6 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed text-center">
                      Descubre cómo hemos transformado ideas en productos digitales de alto impacto.
                   </p>
                </FadeIn>
                <ParallaxScroll items={relatedProjects} />
             </section>
          )}
    
          {/* FAQs */}
          {faqs && faqs.length > 0 && (
              <section className="max-w-2xl mx-auto mb-20 md:mb-28 px-4">
                  <FadeIn>
                    <SectionHeading 
                      title={faqTitle || "Preguntas Frecuentes"} 
                      subtitle="Dudas" 
                      highlight={faqHighlight || "Resueltas"} 
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
                  <Link href={ctaSection?.buttonLink || "/contacto"} title={ctaSection?.buttonText || "Agendar Llamada"}>
                      <Button size="lg" className="bg-white text-black hover:bg-neutral-200 text-sm font-medium h-12 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
                        {ctaSection?.buttonText || "Agendar Llamada"}
                      </Button>
                  </Link>
                  <Link href={ctaSection?.secondaryButtonLink || "/proyectos"} title={ctaSection?.secondaryButtonText || "Ver Portfolio"}>
                      <Button size="lg" variant="outline" className="text-neutral-300 hover:text-white hover:bg-white/5 border-neutral-800 text-sm h-12 px-8 rounded-full">
                        {ctaSection?.secondaryButtonText || "Ver Portfolio"} <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                  </Link>
                </div>
              </FadeIn>
          </section>

        </div>
    );
};