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
import { PortableText } from "next-sanity";
import { TracingBeam } from "@/components/aceternity/tracing-beam";
import { ParallaxScroll } from "@/components/aceternity/parallax-scroll";

// Lazy load heavy components
const ServiceFAQ = dynamic(() => import("./service-faq").then(mod => mod.ServiceFAQ), { ssr: false });
const ServiceProcess = dynamic(() => import("./service-process").then(mod => mod.ServiceProcess), { ssr: false });
const TestimonialsSection = dynamic(() => import("@/components/sections/testimonials").then(mod => mod.TestimonialsSection));
const TeamSection = dynamic(() => import("@/components/sections/team").then(mod => mod.TeamSection));
const PricingSection = dynamic(() => import("@/components/sections/pricing-section").then(mod => mod.PricingSection));
const ImpactStats = dynamic(() => import("@/components/sections/impact-stats").then(mod => mod.ImpactStats));
const ComparisonTable = dynamic(() => import("@/components/sections/comparison-table").then(mod => mod.ComparisonTable));
const NearbyLocations = dynamic(() => import("@/components/sections/nearby-locations").then(mod => mod.NearbyLocations));

interface ServiceContentProps {
  mainImage?: string;
  mainImageAlt?: string;
  mainImageName?: string;
  relatedProjectsTitle?: string;
  relatedProjectsHighlight?: string;
  relatedProjectsDescription?: string;
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
    trustedCompaniesTitle?: string;
    trustedLogos?: { logo: string | null; name: string }[];
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
  localContentBlock?: any;
  nearbyLocations?: {
    name: string;
    slug: string;
    type: string;
  }[];
  cityName?: string;
  citySlug?: string;
  serviceSlug?: string;
  serviceTitle?: string;
  serviceLocations?: {
    name: string;
    slug: string;
    type: string;
  }[];
}

const plainTextFromPortableChildren = (children: any) => {
  if (!Array.isArray(children)) return "";
  return children
    .map((c) => (typeof c?.text === "string" ? c.text : ""))
    .join("")
    .trim();
};

const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const normalizeTocLabel = (input: string) => {
  const raw = typeof input === "string" ? input : "";
  const withoutMarkdownHashes = raw.replace(/^#{1,6}\s*/g, "");
  const normalizedWhitespace = withoutMarkdownHashes.replace(/\s+/g, " ").trim();
  const withoutOnlyPunctuation = normalizedWhitespace.replace(/^[^\p{L}\p{N}]+$/gu, "");
  return withoutOnlyPunctuation;
};

const getSeoContentComponents = () => ({
  block: {
    normal: ({ children }: any) => <p className="mb-6 text-neutral-300 leading-relaxed">{children}</p>,
    h2: ({ children, value }: any) => (
      <h2 id={value?.__id} className="scroll-mt-28 text-2xl md:text-3xl font-bold text-white mt-12 mb-6 flex items-center gap-3">
        <span className="w-8 h-1 bg-indigo-500 rounded-full inline-block"></span>
        {children}
      </h2>
    ),
    h3: ({ children, value }: any) => (
      <h3 id={value?.__id} className="scroll-mt-28 text-xl font-semibold text-white mt-8 mb-4">
        <span className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-300 sm:w-6 sm:h-6 sm:rounded-lg">
            <CheckCircle2 className="w-5 h-5 sm:w-4 sm:h-4" />
          </span>
          <span>{children}</span>
        </span>
      </h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-indigo-500 pl-6 py-2 my-8 italic text-neutral-400 bg-white/5 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="space-y-3 my-6 pl-4">{children}</ul>,
    number: ({ children }: any) => <ol className="space-y-3 my-6 pl-4 list-decimal text-neutral-400">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="flex items-start gap-3 text-neutral-300">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
        <span>{children}</span>
      </li>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-white">{children}</strong>,
    link: ({ value, children }: any) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a href={value?.href} target={target} rel={target === '_blank' ? 'noindex nofollow' : undefined} className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors">
          {children}
        </a>
      )
    },
  },
});

export function ServiceContent({ mainImage, mainImageAlt, mainImageName, relatedProjects, relatedProjectsTitle, relatedProjectsHighlight, relatedProjectsDescription, features, featuresTitle, featuresHighlight, featuresDescription, benefits, process, processTitle, processHighlight, processDescription, longDescription, overviewText, technologies, techTitle, techHighlight, techDescription, impactSection, team, teamTitle, teamHighlight, teamDescription, testimonials, testimonialsTitle, testimonialsHighlight, testimonialsDescription, pricing, faqs, faqTitle, faqHighlight, faqDescription, ctaSection, localContentBlock, nearbyLocations, cityName, citySlug, serviceSlug, serviceTitle, serviceLocations }: ServiceContentProps) {
  return (
    <div className="bg-neutral-950 min-h-screen py-12 md:py-24 px-4 md:px-6 relative z-10 rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-50px_100px_-20px_rgba(79,70,229,0.1)] border-t border-white/10 mt-0 transform-gpu backface-hidden">
      
      {/* Ambient Background Glow - Subtle - Wrapped in overflow hidden container to prevent scroll */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-[3rem] md:rounded-t-[5rem]">
          {/* Static Background Layer to prevent bleed-through */}
          <div className="absolute inset-0 bg-neutral-950 z-[-1]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-900/10 blur-[60px] rounded-full transform-gpu will-change-transform" />
      </div>

      {/* Single Content Wrapper with Internal Responsive Tracing Beam Logic */}
      <TracingBeam className="px-4 max-w-6xl mx-auto">
          <ContentWrapper 
           mainImage={mainImage}
           mainImageAlt={mainImageAlt}
           mainImageName={mainImageName}
           relatedProjects={relatedProjects} relatedProjectsTitle={relatedProjectsTitle} relatedProjectsHighlight={relatedProjectsHighlight} relatedProjectsDescription={relatedProjectsDescription}
           features={features} featuresTitle={featuresTitle} featuresHighlight={featuresHighlight} featuresDescription={featuresDescription}
           benefits={benefits} process={process} processTitle={processTitle} processHighlight={processHighlight} processDescription={processDescription}
           longDescription={longDescription} overviewText={overviewText} 
           technologies={technologies} techTitle={techTitle} techHighlight={techHighlight} techDescription={techDescription}
           impactSection={impactSection} team={team} teamTitle={teamTitle} teamHighlight={teamHighlight} teamDescription={teamDescription}
           testimonials={testimonials} testimonialsTitle={testimonialsTitle} testimonialsHighlight={testimonialsHighlight} testimonialsDescription={testimonialsDescription}
           pricing={pricing}
           faqs={faqs} faqTitle={faqTitle} faqHighlight={faqHighlight} faqDescription={faqDescription}
           ctaSection={ctaSection}
           localContentBlock={localContentBlock}
           nearbyLocations={nearbyLocations}
           cityName={cityName}
           citySlug={citySlug}
           serviceSlug={serviceSlug}
           serviceTitle={serviceTitle}
           serviceLocations={serviceLocations}
         />
      </TracingBeam>
    </div>
  );
}

// Extracted Content Component to reuse
const ContentWrapper = ({ mainImage, mainImageAlt, mainImageName, relatedProjects, relatedProjectsTitle, relatedProjectsHighlight, relatedProjectsDescription, features, featuresTitle, featuresHighlight, featuresDescription, benefits, process, processTitle, processHighlight, processDescription, longDescription, overviewText, technologies, techTitle, techHighlight, techDescription, impactSection, team, teamTitle, teamHighlight, teamDescription, testimonials, testimonialsTitle, testimonialsHighlight, testimonialsDescription, pricing, faqs, faqTitle, faqHighlight, faqDescription, ctaSection, localContentBlock, nearbyLocations, cityName, citySlug, serviceSlug, serviceTitle, serviceLocations }: ServiceContentProps) => {
    
    // Determine if this is a Local Landing Page
    const isLocalLanding = !!cityName;

    return (
        <div className="max-w-6xl mx-auto pt-4 antialiased relative pb-16">
          
          {/* --- STANDARD SECTION: Intro (Long Description) --- */}
          <section className="mb-20 md:mb-32 relative max-w-6xl mx-auto px-4">
             <FadeIn>
                <div className="prose prose-invert max-w-none">
                   <div className="text-2xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-white/90 font-sans">
                      <BlurReveal text={longDescription || "Transforming your digital presence."} />
                   </div>
                </div>
             </FadeIn>
          </section>

          {/* --- STANDARD SECTION: Overview + Image --- */}
          <section className="mb-20 md:mb-32 relative max-w-6xl mx-auto px-4">
             <FadeIn>
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
                                alt={mainImageAlt || mainImageName || "Service Overview"}
                                title={mainImageAlt || mainImageName || "Service Overview"}
                                unoptimized={mainImage.startsWith("/api/hero?")}
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
             </FadeIn>
          </section>

          {/* --- STANDARD SECTION: Tech Stack --- */}
          {technologies && technologies.length > 0 && (
              <FadeIn className="mb-20 md:mb-28 max-w-5xl mx-auto">
                  <div className="text-center mb-10">
                    <SectionHeading 
                        title={techTitle || "Stack Tecnológico"} 
                        subtitle="Herramientas" 
                        highlight={techHighlight || "Core"}
                        className="justify-center"
                    />
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 relative z-10 max-w-3xl mx-auto">
                      {technologies.map((tech, i) => (
                          <h3 key={i} className="px-4 py-2 rounded-full bg-neutral-900/50 border border-white/5 text-neutral-300 font-mono text-sm hover:text-white hover:border-neutral-600 transition-colors cursor-default">
                              {tech}
                          </h3>
                      ))}
                  </div>
              </FadeIn>
          )}

          {/* --- STANDARD SECTION: Impact Stats --- */}
          {impactSection && impactSection.stats && impactSection.stats.length > 0 && (
             <ImpactStats impact={{
                ...impactSection,
                highlight: impactSection.highlight
             }} />
          )}

          {/* --- STANDARD SECTION: Team --- */}
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

          {/* --- STANDARD SECTION: Features --- */}
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

          {/* --- STANDARD SECTION: Process --- */}
           {process && process.length > 0 && (
             <section className="mb-20 w-full">
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

          {/* --- STANDARD SECTION: Pricing --- */}
          {pricing && (
            <div className="mb-20 md:mb-28">
               <PricingSection pricing={{
                 ...pricing,
                 linkLocation: cityName || undefined
               }} />
            </div>
          )}

          {/* --- LOCAL ONLY SECTION: Comparison Table --- */}
          {isLocalLanding && cityName && (
             <ComparisonTable cityName={cityName} />
          )}

          {/* --- STANDARD SECTION: Testimonials --- */}
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

          {/* --- STANDARD SECTION: Related Projects --- */}
          {relatedProjects && relatedProjects.length > 0 && (
             <section className="mb-20 md:mb-32 w-full">
                <FadeIn className="max-w-4xl mx-auto px-4 mb-12">
                   <SectionHeading 
                     title={relatedProjectsTitle || "Proyectos Relacionados"} 
                     subtitle="Casos de Éxito" 
                     highlight={relatedProjectsHighlight || "Destacados"} 
                   />
                   {relatedProjectsDescription && (
                     <p className="text-neutral-400 mt-6 text-lg max-w-2xl mx-auto font-light leading-relaxed text-center">
                        {relatedProjectsDescription}
                     </p>
                   )}
                </FadeIn>
                <ParallaxScroll items={relatedProjects} />
             </section>
          )}

          {/* --- LOCAL ONLY SECTION: SEO Content Block --- */}
          {isLocalLanding && localContentBlock && (
             <section className="mb-20 md:mb-32 relative max-w-4xl mx-auto px-2 md:px-0">
                <FadeIn>
                  <div className="mb-12 text-center">
                      <SectionHeading 
                        title="Análisis del Ecosistema Digital en "
                        subtitle="Información Local" 
                        highlight={cityName || 'la Región'} 
                        className="justify-center"
                      />
                  </div>
                  {(() => {
                    const enhanced = Array.isArray(localContentBlock)
                      ? localContentBlock.map((block: any, idx: number) => {
                          if (!block || block._type !== "block") return block;
                          const style = block.style;
                          if (style !== "h2" && style !== "h3") return block;
                          const text = plainTextFromPortableChildren(block.children);
                          const id = `seo-${style}-${idx}-${slugify(text || "section")}`;
                          return { ...block, __id: id };
                        })
                      : localContentBlock;

                    const toc = Array.isArray(enhanced)
                      ? enhanced
                          .filter((b: any) => b?._type === "block" && (b.style === "h2" || b.style === "h3") && b.__id)
                          .map((b: any) => ({
                            id: b.__id,
                            level: b.style,
                            text: plainTextFromPortableChildren(b.children),
                          }))
                          .filter((i: any) => i.text)
                      : [];

                    const components = getSeoContentComponents();

                    return (
                      <div className="bg-neutral-900/20 border border-white/5 rounded-3xl p-5 sm:p-6 md:p-10">
                        <div className="grid gap-10 lg:grid-cols-12">
                          {toc.length > 0 && (
                            <aside className="lg:col-span-4">
                              <div className="lg:sticky lg:top-28">
                                <div className="text-xs uppercase tracking-wider text-neutral-500 mb-4">Índice</div>
                                <nav aria-label="Índice del contenido" className="space-y-2 rounded-2xl border border-white/5 bg-neutral-950/30 p-4">
                                  {toc.map((item: any, index: number) => {
                                    const cleaned = normalizeTocLabel(item.text);
                                    const label = cleaned || (item.level === "h3" ? `Subsección ${index + 1}` : `Sección ${index + 1}`);
                                    return (
                                      <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        title={label}
                                        aria-label={label}
                                        className={cn(
                                          "block text-sm text-neutral-300 hover:text-white transition-colors",
                                          item.level === "h3" && "pl-4 text-neutral-400"
                                        )}
                                      >
                                        {label}
                                      </a>
                                    );
                                  })}
                                </nav>
                              </div>
                            </aside>
                          )}

                          <article className={cn("min-w-0", toc.length > 0 ? "lg:col-span-8" : "lg:col-span-12")}>
                            <div className="text-base md:text-lg leading-relaxed">
                              <PortableText value={enhanced} components={components as any} />
                            </div>
                          </article>
                        </div>
                      </div>
                    );
                  })()}
                </FadeIn>
             </section>
          )}

          {/* --- STANDARD SECTION: FAQs --- */}
          {faqs && faqs.length > 0 && (
              <section className="max-w-4xl mx-auto mb-20 md:mb-28 px-2 md:px-0">
                  <FadeIn>
                    <SectionHeading 
                      title={faqTitle || "Preguntas Frecuentes"} 
                      subtitle="Dudas" 
                      highlight={faqHighlight || "Resueltas"} 
                    />
                    {faqDescription && (
                      <p className="text-neutral-400 mt-6 text-lg max-w-2xl mx-auto font-light leading-relaxed text-center px-4">
                          {faqDescription}
                      </p>
                    )}
                  </FadeIn>
                  <FadeIn delay={0.2} className="mt-12">
                    <ServiceFAQ faqs={faqs} />
                  </FadeIn>
              </section>
          )}

          {/* --- LOCAL ONLY SECTION: Nearby Locations (Interlinking) --- */}
          {isLocalLanding && cityName && serviceSlug && (
             <NearbyLocations 
                currentServiceSlug={serviceSlug}
                currentServiceTitle={serviceTitle}
                currentLocationName={cityName}
                currentLocationSlug={citySlug}
                locations={nearbyLocations || []} 
             />
          )}

          {/* --- STANDARD SECTION: CTA --- */}
          <section className="text-center py-16 relative overflow-hidden rounded-3xl bg-neutral-900/10 border border-white/5 max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
              <FadeIn className="relative z-10 max-w-2xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
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

          {/* --- SERVICE PAGE ONLY: Nearby Locations (Interlinking) --- */}
          {!isLocalLanding && serviceLocations && serviceLocations.length > 0 && serviceSlug && (
            <div className="mt-16">
              <NearbyLocations
                currentServiceSlug={serviceSlug}
                currentServiceTitle={serviceTitle}
                title="También ofrecemos servicio en:"
                locations={serviceLocations}
              />
            </div>
          )}

        </div>
    );
};
