import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { SERVICES_QUERY, SERVICES_PAGE_QUERY } from "@/sanity/lib/queries";
import { Navbar } from "@/components/layout/navbar";
import { LuminousPill } from "@/components/ui/luminous-pill";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { HoverEffect } from "@/components/aceternity/card-hover-effect";
import { FadeIn } from "@/components/ui/fade-in";
import { TechArsenalSection } from "@/components/sections/tech-arsenal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReset } from "@/components/utils/scroll-reset";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await client.fetch(SERVICES_PAGE_QUERY);
  
  return {
    title: pageData?.seoTitle || "Servicios | ONBAST",
    description: pageData?.seoDescription || "Soluciones digitales de alto impacto. Desarrollo Web, SEO Avanzado y Estrategia Digital.",
  };
}

export default async function ServicesPage() {
  const [services, pageData] = await Promise.all([
    client.fetch(SERVICES_QUERY),
    client.fetch(SERVICES_PAGE_QUERY)
  ]);

  // Map services to HoverEffect format
  const serviceItems = services.map((service: any) => ({
    title: service.title,
    description: service.description,
    link: `/servicios/${service.slug}`,
    icon: service.icon,
    imageUrl: service.imageUrl,
    colSpan: service.colSpan || 1
  }));

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white pt-0">
      <ScrollReset />
      <Navbar />

      {/* Hero Section - Matched to Agency/Contact */}
      <section className="h-[100dvh] w-full sticky top-0 z-0 flex flex-col items-center justify-center bg-neutral-950 overflow-hidden">
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
      <section className="relative z-10 bg-neutral-950 min-h-screen border-t border-white/10 rounded-t-[3rem] md:rounded-t-[5rem] -mt-[10vh] pt-20 pb-32 shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.5)]">
          
          {/* Services List */}
          <div className="max-w-7xl mx-auto px-6">
              <FadeIn className="mb-16 text-center">
                  <SectionHeading 
                      title={pageData?.catalog?.title || "Nuestro Catálogo"}
                      subtitle={pageData?.catalog?.subtitle || "Expertise"}
                      highlight={pageData?.catalog?.highlight || "Catálogo"}
                      className="justify-center"
                  />
                  <p className="text-neutral-400 max-w-2xl mx-auto mt-4 text-lg">
                      {pageData?.catalog?.description || "Selecciona un servicio para ver cómo podemos ayudarte a escalar."}
                  </p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <HoverEffect items={serviceItems} />
              </FadeIn>
          </div>

          {/* Tech Arsenal Reuse */}
          <div className="mt-20 border-t border-white/5 pt-20">
             <TechArsenalSection header={{
                title: pageData?.tech?.title || "Tecnología de Vanguardia",
                pill: pageData?.tech?.pill || "Stack",
                highlight: pageData?.tech?.highlight || "Vanguardia",
                description: pageData?.tech?.description || "Utilizamos las herramientas más avanzadas del mercado para garantizar velocidad, seguridad y escalabilidad."
             }} />
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto px-6 mt-32">
             <FadeIn className="relative overflow-hidden rounded-3xl bg-neutral-900/10 border border-white/5 py-16 px-6 text-center">
                 <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                 <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter mb-4">
                      {pageData?.cta?.title || "¿No encuentras lo que buscas?"}
                    </h2>
                    <p className="text-neutral-400 text-base mb-8 max-w-lg mx-auto font-light">
                      {pageData?.cta?.description || "Ofrecemos soluciones personalizadas adaptadas a tus necesidades específicas. Hablemos de tu proyecto."}
                    </p>
                    <Button size="lg" className="bg-white text-black hover:bg-neutral-200 text-sm font-medium h-12 px-8 rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
                         <a href={pageData?.cta?.buttonLink || "/contacto"}>
                            {pageData?.cta?.buttonText || "Contáctanos"} 
                            <ArrowRight className="ml-2 w-4 h-4" />
                         </a>
                    </Button>
                 </div>
             </FadeIn>
          </div>

      </section>
    </main>
  );
}
