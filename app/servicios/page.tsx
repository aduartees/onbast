import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { SERVICES_QUERY, SERVICES_PAGE_QUERY } from "@/sanity/lib/queries";
import { Navbar } from "@/components/layout/navbar";
import { LuminousPill } from "@/components/ui/luminous-pill";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { FocusCards } from "@/components/aceternity/focus-cards";
import { StickyScroll } from "@/components/aceternity/sticky-scroll-reveal";
import { LampContainer } from "@/components/aceternity/lamp";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReset } from "@/components/utils/scroll-reset";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import Image from "next/image";
// import { motion } from "framer-motion"; // Removed unused import

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

  // Map services to FocusCards format
  const focusCards = services
    .filter((service: any) => service.imageUrl) // Filter out services without images
    .map((service: any) => ({
      title: service.title,
      description: service.description,
      link: `/servicios/${service.slug}`,
      imageUrl: service.imageUrl,
    }));

  // Content for Sticky Scroll (Tech Stack Narrative)
  const techContent = [
    {
      title: "Next.js 15 & Turbopack",
      description: "Velocidad nuclear. Utilizamos la última versión del framework más potente del mundo. Renderizado híbrido, Server Actions y compilación instantánea para una experiencia de usuario sin fricción.",
      content: (
        <div className="h-full w-full flex items-center justify-center text-white bg-black">
           <Image 
              src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png"
              width={300}
              height={300}
              className="object-contain p-10"
              alt="Next.js Logo"
           />
        </div>
      ),
    },
    {
      title: "Sanity Headless CMS",
      description: "Control total en tiempo real. Un gestor de contenidos que se adapta a ti, no al revés. Edición colaborativa, previsualización en vivo y distribución de contenido omnicanal estructurado.",
      content: (
        <div className="h-full w-full flex items-center justify-center text-white bg-[#F03E2F]">
           <span className="text-6xl font-bold tracking-tighter">Sanity</span>
        </div>
      ),
    },
    {
      title: "Vercel Edge Network",
      description: "Despliegue global instantáneo. Tu web vive en el borde (Edge), replicada en servidores de todo el mundo para que cargue en milisegundos, sin importar dónde esté tu usuario.",
      content: (
        <div className="h-full w-full flex items-center justify-center text-white bg-black">
            <svg viewBox="0 0 1155 1000" className="w-40 h-40 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M577.344 0L1154.69 1000H0L577.344 0Z" />
            </svg>
        </div>
      ),
    },
    {
        title: "AI Integration",
        description: "Inteligencia Artificial nativa. Integramos modelos de OpenAI y Anthropic directamente en tu flujo de trabajo para automatizar SEO, generar contenido y personalizar experiencias.",
        content: (
          <div className="h-full w-full flex items-center justify-center text-white bg-gradient-to-br from-indigo-500 to-purple-600">
             <Zap className="w-24 h-24 text-white" />
          </div>
        ),
      },
  ];

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
      <section className="relative z-10 bg-neutral-950 min-h-screen border-t border-white/10 rounded-t-[3rem] md:rounded-t-[5rem] -mt-[10vh] pt-20 pb-0 shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.5)]">
          
          {/* Services List - New Focus Cards */}
          <div className="max-w-7xl mx-auto px-6 mb-32">
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
                <FocusCards cards={focusCards} />
              </FadeIn>
          </div>

          {/* Tech Arsenal - New Sticky Scroll Reveal */}
          <div className="border-t border-white/5 bg-neutral-950">
             <div className="py-20 text-center max-w-4xl mx-auto px-6">
                <SectionHeading 
                    title={pageData?.tech?.title || "Tecnología de Vanguardia"}
                    subtitle={pageData?.tech?.pill || "Stack"}
                    highlight={pageData?.tech?.highlight || "Vanguardia"}
                    className="justify-center"
                />
                <p className="text-neutral-400 mt-6 text-lg">
                    {pageData?.tech?.description || "Utilizamos las herramientas más avanzadas del mercado para garantizar velocidad, seguridad y escalabilidad."}
                </p>
             </div>
             <StickyScroll content={techContent} />
          </div>

          {/* CTA Section - New Lamp Effect */}
          <LampContainer className="min-h-[60vh]">
             {/* Note: LampContainer children are rendered as client components, but simple HTML is fine */}
             <div className="flex flex-col items-center">
                <h1 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
                    {pageData?.cta?.title || "¿No encuentras lo que buscas?"}
                </h1>
                <p className="text-neutral-400 max-w-lg mx-auto mt-4 text-center text-lg">
                    {pageData?.cta?.description || "Ofrecemos soluciones personalizadas adaptadas a tus necesidades específicas. Hablemos de tu proyecto."}
                </p>
                <div className="mt-8">
                    <Button size="lg" className="bg-cyan-500 text-black hover:bg-cyan-400 text-base font-semibold h-12 px-8 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all" asChild>
                        <a href={pageData?.cta?.buttonLink || "/contacto"}>
                        {pageData?.cta?.buttonText || "Contáctanos"} 
                        <ArrowRight className="ml-2 w-5 h-5" />
                        </a>
                    </Button>
                </div>
             </div>
          </LampContainer>

      </section>
    </main>
  );
}
