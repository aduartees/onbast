import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { SERVICES_QUERY, SERVICES_PAGE_QUERY } from "@/sanity/lib/queries";
import { LuminousPill } from "@/components/ui/luminous-pill";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { HoverEffect } from "@/components/aceternity/card-hover-effect";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReset } from "@/components/utils/scroll-reset";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Zap, Shield, Globe, Database, Smartphone } from "lucide-react";
import Image from "next/image";
import * as LucideIcons from "lucide-react";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await client.fetch(SERVICES_PAGE_QUERY);
  
  const heroTitle = pageData?.hero?.title || "Servicios";
  const title = pageData?.seoTitle || `${heroTitle} | ONBAST`;

  return {
    title,
    description: pageData?.seoDescription || "Soluciones digitales de alto impacto. Desarrollo Web, SEO Avanzado y Estrategia Digital.",
  };
}

export default async function ServicesPage() {
  const [services, pageData] = await Promise.all([
    client.fetch(SERVICES_QUERY),
    client.fetch(SERVICES_PAGE_QUERY)
  ]);

  // Map services to HoverEffect format
  const hoverItems = (services || []).map((service: any) => ({
    title: service.title,
    description: service.shortDescription || service.description,
    link: `/servicios/${service.slug}`,
    icon: service.icon // Assuming icon string name is passed, e.g., "Code2"
  }));

  // Dynamic Tech Stack from Sanity
  const techStack = pageData?.tech?.stackCards || [];
  
  const cta = pageData?.cta;

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white pt-0">
      <ScrollReset />

      {/* Hero Section */}
      <section className="h-[80vh] w-full sticky top-0 z-0 flex flex-col items-center justify-center bg-neutral-950 overflow-hidden">
         {/* Background Elements */}
         <div className="absolute inset-0 w-full h-full bg-neutral-950 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[120vw] h-[120vw] md:w-[90vw] md:h-[90vw] bg-indigo-900/20 rounded-full blur-[60px] md:blur-[80px] transform-gpu will-change-transform" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[100vw] h-[100vw] md:w-[80vw] md:h-[80vw] bg-cyan-900/10 rounded-full blur-[60px] md:blur-[80px] transform-gpu will-change-transform" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
         </div>
         <BackgroundBeams className="opacity-40" />

         <div className="relative z-10 flex flex-col items-center justify-center h-full w-full text-center px-8 md:px-20 max-w-5xl mx-auto pt-24 pb-safe md:pt-20 md:pb-12">
            
            <LuminousPill title={pageData?.hero?.pill || "Servicios"} />

            <BlurReveal 
                text={pageData?.hero?.title || "Soluciones Digitales 360º."}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.15] md:leading-[1.1]"
                highlightClassName="font-serif italic font-normal text-indigo-200/90"
                highlightWord={pageData?.hero?.highlight || "360º."}
            />
            
            <div className="max-w-xl mx-auto mb-10 md:mb-16 px-4 mt-8">
               <BlurReveal
                 text={pageData?.hero?.description || "Transformamos ideas complejas en experiencias digitales de alto rendimiento. Desde el código hasta el posicionamiento."}
                 className="text-sm md:text-base text-neutral-400 leading-relaxed"
                 delay={0.3}
                 as="p"
               />
            </div>
         </div>
      </section>

      {/* Main Content - Overlapping Hero */}
      <section className="relative z-10 bg-neutral-950 min-h-screen border-t border-white/10 rounded-t-[3rem] md:rounded-t-[5rem] -mt-[10vh] pt-20 pb-0 shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.5)]">
          
          {/* Services List - New Hover Effect Grid */}
          <div className="max-w-7xl mx-auto px-6 mb-0">
              <FadeIn className="mb-12 text-center">
                  <SectionHeading 
                      title={pageData?.catalog?.title || "Nuestro Catálogo"}
                      subtitle={pageData?.catalog?.subtitle || "Expertise"}
                      highlight={pageData?.catalog?.highlight || "Catálogo"}
                      className="justify-center"
                  />
                  <p className="text-neutral-400 max-w-2xl mx-auto mt-4 text-lg font-light">
                      {pageData?.catalog?.description || "Selecciona un servicio para ver cómo podemos ayudarte a escalar."}
                  </p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <HoverEffect items={hoverItems} />
              </FadeIn>
          </div>

          {/* Tech Arsenal - Clean Grid Layout */}
          <div className="border-t border-white/5 bg-neutral-900/20 py-24">
             <div className="max-w-7xl mx-auto px-6">
                 <div className="text-center max-w-3xl mx-auto mb-16">
                    <SectionHeading 
                        title={pageData?.tech?.title || "Tecnología de Vanguardia"}
                        subtitle={pageData?.tech?.pill || "Stack"}
                        highlight={pageData?.tech?.highlight || "Vanguardia"}
                        className="justify-center"
                    />
                    <p className="text-neutral-400 mt-6 text-lg font-light">
                        {pageData?.tech?.description || "Utilizamos las herramientas más avanzadas del mercado para garantizar velocidad, seguridad y escalabilidad."}
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {techStack.map((item: any, idx: number) => {
                       // Resolve Icon
                       const IconComponent = item.icon?.name ? (LucideIcons as any)[item.icon.name] : null;
                       
                       return (
                        <div key={idx} className="bg-neutral-950 border border-white/10 rounded-3xl p-8 hover:border-indigo-500/30 transition-colors group">
                            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {item.imageUrl ? (
                                    <Image src={item.imageUrl} width={24} height={24} alt={item.title} title={item.title} className="object-contain" />
                                ) : IconComponent ? (
                                    <IconComponent className="w-6 h-6 text-white" />
                                ) : (
                                    <div className="text-white font-bold text-xs">APP</div>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                       );
                    })}
                 </div>
             </div>
          </div>

          {/* CTA Section - Standardized */}
          <section className="py-20 md:py-32 relative z-10 px-6 bg-neutral-950 border-t border-white/5">
              <div className="max-w-4xl mx-auto text-center relative overflow-hidden rounded-3xl bg-neutral-900/20 border border-white/5 py-16 px-6">
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                  <FadeIn className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter mb-4">
                      {cta?.title || "¿No encuentras lo que buscas?"}
                    </h2>
                    <p className="text-neutral-400 text-base mb-8 max-w-lg mx-auto font-light">
                      {cta?.description || "Ofrecemos soluciones personalizadas adaptadas a tus necesidades específicas. Hablemos de tu proyecto."}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Button size="lg" className="bg-white text-black hover:bg-neutral-200 text-sm font-medium h-12 px-8 rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
                         <a href={cta?.buttonLink || "/contacto"} title={cta?.buttonText || "Contáctanos"}>{cta?.buttonText || "Contáctanos"}</a>
                      </Button>
                    </div>
                  </FadeIn>
              </div>
          </section>

      </section>
    </main>
  );
}
