
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { PROJECTS_PAGE_QUERY } from "@/sanity/lib/queries";
import { Navbar } from "@/components/layout/navbar";
import { LuminousPill } from "@/components/ui/luminous-pill";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { ParallaxScroll } from "@/components/aceternity/parallax-scroll";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { ScrollReset } from "@/components/utils/scroll-reset";
import { generateOrganizationSchema, generateFAQSchema } from "@/lib/seo";
import { ImpactStats } from "@/components/sections/impact-stats";
import { ServiceProcess } from "@/components/sections/service-process";
// import { ServiceProcess } from "@/components/sections/service-process"; // Replacing with custom component for Projects
import { ProjectsProcess } from "@/components/sections/projects-process";
import { ServiceFAQ } from "@/components/sections/service-faq";
import { InfiniteMovingLogos } from "@/components/aceternity/infinite-moving-logos";
import { SectionHeading } from "@/components/ui/section-heading";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await client.fetch(PROJECTS_PAGE_QUERY);
  
  const heroTitle = page?.hero?.title || "Proyectos";
  const title = page?.seo?.title || `${heroTitle} | ONBAST`;
  const description = page?.seo?.description || "Explora nuestro portafolio de proyectos.";

  return {
    title,
    description,
    openGraph: page?.seo?.image ? {
        images: [{ url: page.seo.image }]
    } : undefined
  };
}

export default async function ProjectsPage() {
  const data = await client.fetch(PROJECTS_PAGE_QUERY);
  
  // Fallback if no data is present yet
  const hero = data?.page?.hero || {
    title: "Portafolio",
    headline: "Transformando ideas en realidad digital.",
    description: "Explora nuestra colección de proyectos donde la tecnología se encuentra con el diseño de vanguardia."
  };

  const projects = data?.projects || [];
  const cta = data?.page?.cta;
  const clients = data?.page?.clients;
  const impact = data?.page?.impact;
  const process = data?.page?.process;
  const faq = data?.page?.faq;
  const gallery = data?.page?.gallery;

  // --- Data Logic: Clients/Technologies ---
  // If no manually selected clients in Projects Page, try to derive "Tech Stack" from actual projects
  // or fallback to a default set if absolutely nothing exists.
  
  const projectTechStack = projects.flatMap((p: any) => p.tags || []).map((tag: string) => ({
      name: tag,
      // For now, we don't have logos for tags in the Project Schema, so we'd need a map or just display text/placeholder
      // But user requested "logos de que pongamos en el cms en proyectos".
      // Assuming user means: Use the 'clients' field from the ProjectsPage schema first.
  }));

  // If clients.logos is empty, hide the section entirely rather than showing mocks.
  // User explicitly asked: "no los logos globales ya qe no tiene nada que ver"
  const showClients = clients?.logos && clients.logos.length > 0;
  const showImpact = impact?.stats && impact.stats.length > 0;

  const organizationSchema = generateOrganizationSchema(data, "Organization");
  const faqSchema = generateFAQSchema(faq?.questions || []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      ...(faqSchema ? [faqSchema] : [])
    ]
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white pt-0">
      <ScrollReset />
      <Navbar />

      {/* Inject JSON-LD Schema */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Hero Section */}
      <section className="h-[100dvh] w-full sticky top-0 z-0 flex flex-col items-center justify-center bg-neutral-950 overflow-hidden">
         {/* Background Elements */}
         <div className="absolute inset-0 w-full h-full bg-neutral-950 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[120vw] h-[120vw] md:w-[90vw] md:h-[90vw] bg-indigo-900/20 rounded-full blur-[60px] md:blur-[80px] transform-gpu will-change-transform" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[100vw] h-[100vw] md:w-[80vw] md:h-[80vw] bg-cyan-900/10 rounded-full blur-[60px] md:blur-[80px] transform-gpu will-change-transform" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
         </div>
         <BackgroundBeams className="opacity-40" />

         <div className="relative z-10 flex flex-col items-center justify-center h-full w-full text-center px-8 md:px-20 max-w-5xl mx-auto pt-24 pb-safe md:pt-20 md:pb-12">
            
            {/* Luminous Service Pill */}
            <LuminousPill title={hero.title} />

            <BlurReveal 
                text={hero.headline} 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.15] md:leading-[1.1]"
                highlightClassName="font-serif italic font-normal text-indigo-200/90"
                highlightWord={hero.highlight}
            />
            
            {hero.description && (
                <div className="max-w-xl mx-auto mb-10 md:mb-16 px-4 mt-8">
                   <BlurReveal
                     text={hero.description}
                     className="text-sm md:text-base text-neutral-400 leading-relaxed"
                     delay={0.3}
                     as="p"
                   />
                </div>
            )}
         </div>
      </section>

      {/* Clients Trust Section (Below Fold) */}
      {showClients && (
        <section className="relative z-10 bg-neutral-950 py-12 border-y border-white/5 -mt-[3rem] pt-[6rem] rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.5)]">
            <div className="max-w-7xl mx-auto px-6 text-center mb-8">
                <p className="text-sm text-neutral-500 font-medium tracking-widest uppercase">
                    {clients?.title || "Empresas que confían en nosotros"}
                </p>
            </div>
            <InfiniteMovingLogos 
                items={clients.logos} 
                direction="right" 
                speed="slow" 
            />
        </section>
      )}

      {/* Impact Stats */}
      {showImpact && (
        <section className="relative z-10 bg-neutral-950 py-20">
            <ImpactStats 
                impact={{
                    title: impact?.title || "Impacto Real",
                    subtitle: impact?.description,
                    highlight: impact?.highlight,
                    stats: impact?.stats?.map((s: any) => ({
                        ...s,
                        value: Number(s.value) || 0
                    }))
                }}
            />
        </section>
      )}

      {/* Projects Grid Section */}
      <section className="py-10 md:py-20 relative z-10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
            <FadeIn>
                <SectionHeading 
                    title={gallery?.title || "Nuestros Trabajos"} 
                    subtitle={gallery?.subtitle || "Galería"} 
                    highlight={gallery?.highlight || "Destacados"}
                    className="justify-center"
                />
                <p className="text-neutral-400 mt-6 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                    {gallery?.description || "Una selección curada de nuestros proyectos más ambiciosos y creativos."}
                </p>
            </FadeIn>
        </div>
        <div className="max-w-8xl mx-auto px-4">
           {projects.length > 0 ? (
               <ParallaxScroll items={projects} className="w-full" />
           ) : (
               <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/5">
                   <p className="text-neutral-400 italic">Próximamente más proyectos...</p>
               </div>
           )}
        </div>
      </section>

      {/* Process Section */}
      {process && (
        <section className="relative z-10 bg-neutral-950 py-20 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <FadeIn>
                    <SectionHeading 
                        title={process.title || "Nuestro Proceso"} 
                        subtitle="Metodología" 
                        highlight={process.highlight || "Pasos"}
                        className="justify-center"
                    />
                    {process.description && (
                        <p className="text-neutral-400 mt-6 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                            {process.description}
                        </p>
                    )}
                </FadeIn>
            </div>
            <ProjectsProcess steps={process.steps || []} />
        </section>
      )}

      {/* FAQ Section */}
      {faq && (
        <section className="relative z-10 bg-neutral-950 py-20 border-t border-white/5">
             <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <FadeIn>
                    <SectionHeading 
                        title={faq.title || "Preguntas Frecuentes"} 
                        subtitle="Dudas" 
                        highlight={faq.highlight || "Respuestas"}
                        className="justify-center"
                    />
                    {faq.description && (
                        <p className="text-neutral-400 mt-6 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                            {faq.description}
                        </p>
                    )}
                </FadeIn>
            </div>
            <ServiceFAQ faqs={faq.questions || []} />
        </section>
      )}

      {/* CTA Section */}
      {cta && (
          <section className="py-20 md:py-32 relative z-10 px-6 bg-neutral-950 border-t border-white/5">
              <div className="max-w-4xl mx-auto text-center relative overflow-hidden rounded-3xl bg-neutral-900/20 border border-white/5 py-16 px-6">
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                  <FadeIn className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter mb-4">
                      {cta.title || "¿Listo para empezar tu proyecto?"}
                    </h2>
                    <p className="text-neutral-400 text-base mb-8 max-w-lg mx-auto font-light">
                      {cta.description || "Hablemos sobre cómo podemos llevar tu visión al siguiente nivel."}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Button size="lg" className="bg-white text-black hover:bg-neutral-200 text-sm font-medium h-12 px-8 rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
                         <a href={cta.buttonLink || "/contacto"} title={cta.buttonText || "Contactar Ahora"}>{cta.buttonText || "Contactar Ahora"}</a>
                      </Button>
                    </div>
                  </FadeIn>
              </div>
          </section>
      )}

    </main>
  );
}
