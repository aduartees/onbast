
import { client } from "@/sanity/lib/client";
import { AGENCY_PAGE_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { TeamSection } from "@/components/sections/team";
import { Button } from "@/components/ui/button";
import { LuminousPill } from "@/components/ui/luminous-pill";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { BlurReveal } from "@/components/ui/blur-reveal";
import Link from "next/link";

import { ParallaxScroll } from "@/components/aceternity/parallax-scroll";
import { TestimonialsSection } from "@/components/sections/testimonials";

import { generateOrganizationSchema } from "@/lib/seo";
import { ArrowUpRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(AGENCY_PAGE_QUERY);
  
  const heroTitle = data?.hero?.title || "Agencia";
  const title = data?.seo?.title || `${heroTitle} | ONBAST`;

  return {
    title,
    description: data?.seo?.description || "Conoce más sobre ONBAST.",
    openGraph: data?.seo?.image ? {
        images: [{ url: data.seo.image }]
    } : undefined
  };
}

export default async function AgencyPage() {
  const data = await client.fetch(AGENCY_PAGE_QUERY);

  if (!data) {
    // If no data exists, fallback to default content instead of 404
    // This allows the page to render even if Sanity data is missing
    return (
      <main className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white pt-24">
        <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden">
           <BackgroundBeams className="opacity-40" />
           <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
              <BlurReveal 
                  text="Somos ONBAST." 
                  className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400"
              />
              <FadeIn delay={0.2}>
                  <p className="text-lg md:text-2xl text-neutral-400 max-w-3xl mx-auto leading-relaxed font-light">
                      Agencia de desarrollo web y estrategias digitales.
                  </p>
              </FadeIn>
           </div>
        </section>
      </main>
    );
  }

  const { hero, methodology, teamSection, location, projects, testimonials, cta } = data;
  const knowsAboutServices = (Array.isArray(data.coreServices) && data.coreServices.length > 0)
    ? data.coreServices
    : (Array.isArray(data.fallbackServices) ? data.fallbackServices : []);

  const organizationNode = generateOrganizationSchema(data, "Organization", knowsAboutServices);
  const aboutPageNode = generateOrganizationSchema(data, "AboutPage");

  const graph = [organizationNode, aboutPageNode].filter(Boolean);
  const jsonLd = graph.length
    ? {
        "@context": "https://schema.org",
        "@graph": graph,
      }
    : null;

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white pt-0">
      
      {/* Inject JSON-LD Schema */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Hero Section - Matched to ServiceHeader */}
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
            <LuminousPill title={hero?.title || "Agencia"} />

            <BlurReveal 
                text={hero?.headline || "Somos ONBAST."} 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.15] md:leading-[1.1]"
                highlightClassName="font-serif italic font-normal text-indigo-200/90"
                highlightWord={hero?.highlight}
            />
            
            {/* Description Paragraph */}
            {hero?.description && (
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

      {/* History Section */}
      {data.history && (
          <section className="py-20 md:py-28 relative bg-neutral-950 z-10 rounded-t-[3rem] md:rounded-t-[5rem] border-t border-white/10 shadow-[0_-50px_100px_-20px_rgba(79,70,229,0.1)]">
              <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <FadeIn>
                      <SectionHeading 
                          title={data.history.title || "Nuestra Historia"} 
                          subtitle="Orígenes" 
                          highlight={data.history.highlight}
                          align="left"
                      />
                      <div className="prose prose-invert prose-neutral max-w-none">
                          <p className="text-neutral-400 text-lg leading-relaxed">
                              {data.history.description}
                          </p>
                      </div>
                  </FadeIn>
                  
                  {data.history.imageUrl && (
                      <FadeIn delay={0.2} className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                          <Image 
                              src={data.history.imageUrl} 
                              alt="Agency History" 
                              fill 
                              className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent pointer-events-none" />
                      </FadeIn>
                  )}
              </div>
          </section>
      )}

      {/* Methodology Section */}
      {methodology && (
          <section className="py-20 md:py-28 relative bg-neutral-950 z-10 border-t border-white/5">
              <div className="max-w-6xl mx-auto px-6">
                  <FadeIn>
                      <SectionHeading 
                          title={methodology.title || "Nuestra Metodología"} 
                          subtitle="Proceso" 
                          highlight={methodology.highlight}
                          className="justify-center mb-16"
                      />
                  </FadeIn>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {methodology.steps?.map((step: any, idx: number) => (
                          <FadeIn key={idx} delay={idx * 0.1} className="relative pl-8 border-l border-white/10">
                              <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-neutral-950 border border-indigo-500 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              </span>
                              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                              <p className="text-neutral-400 leading-relaxed">{step.description}</p>
                          </FadeIn>
                      ))}
                  </div>
              </div>
          </section>
      )}

      {/* Team Section */}
      {teamSection && (
          <section className="py-20 md:py-28 border-y border-white/5 relative z-10 bg-neutral-950">
              <div className="max-w-7xl mx-auto px-6">
                  <FadeIn className="text-center mb-16">
                      <SectionHeading 
                          title={teamSection.title || "El Equipo"} 
                          subtitle="Talento" 
                          highlight={teamSection.highlight}
                          className="justify-center"
                      />
                      {teamSection.description && (
                          <p className="text-neutral-400 mt-6 max-w-2xl mx-auto text-lg leading-relaxed font-light">{teamSection.description}</p>
                      )}
                  </FadeIn>
                  <TeamSection team={teamSection.members || []} />
              </div>
          </section>
      )}

      {/* Location Section - Full Width Premium */}
      {location && (
          <section className="w-full h-[80vh] min-h-[600px] relative overflow-hidden group z-10 bg-neutral-950">
              {location.imageUrl ? (
                  <div className="absolute inset-0 w-full h-full">
                      <Image 
                          src={location.imageUrl} 
                          alt="Office Location" 
                          title="Office Location" 
                          fill 
                          className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                      />
                      <div className="absolute inset-0 bg-neutral-950/60 group-hover:bg-neutral-950/40 transition-colors duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                  </div>
              ) : (
                  <div className="absolute inset-0 bg-neutral-900" />
              )}
              
              <div className="absolute inset-0 flex items-center justify-center md:justify-start max-w-7xl mx-auto px-6 pointer-events-none">
                  <FadeIn className="bg-neutral-950/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 max-w-md w-full shadow-2xl pointer-events-auto">
                      <SectionHeading 
                          title={location.title || "Dónde Estamos"} 
                          subtitle="Ubicación" 
                          highlight={location.highlight}
                      />
                      <p className="text-neutral-300 mt-6 text-lg leading-relaxed mb-8">
                          {location.description}
                      </p>
                      {location.address && (
                          <div className="flex items-start gap-4 mb-8">
                              <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                              </div>
                              <div>
                                  <h4 className="text-white font-medium mb-1">Dirección</h4>
                                  <p className="text-neutral-400 font-light">{location.address}</p>
                              </div>
                          </div>
                      )}
                      
                      {location.googleMapsUrl && (
                          <Button className="w-full bg-white text-black hover:bg-neutral-200" asChild>
                              <a href={location.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                                  Ver en Google Maps <ArrowUpRight className="ml-2 w-4 h-4" />
                              </a>
                          </Button>
                      )}
                  </FadeIn>
              </div>
          </section>
      )}

      {/* Projects Section */}
      {projects && projects.selectedProjects && projects.selectedProjects.length > 0 && (
          <section className="py-20 md:py-28 border-y border-white/5 relative z-10 bg-neutral-950">
              <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                  <FadeIn>
                      <SectionHeading 
                          title={projects.title || "Proyectos Recientes"} 
                          subtitle="Trabajo" 
                          highlight={projects.highlight}
                          className="justify-center"
                      />
                      {projects.description && (
                          <p className="text-neutral-400 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
                              {projects.description}
                          </p>
                      )}
                  </FadeIn>
              </div>
              <ParallaxScroll items={projects.selectedProjects} />
          </section>
      )}

      {/* Testimonials Section */}
      {testimonials && testimonials.selectedTestimonials && testimonials.selectedTestimonials.length > 0 && (
          <section className="py-20 md:py-28 relative z-10 bg-neutral-950">
              <div className="max-w-6xl mx-auto px-6 text-center mb-16">
                  <FadeIn>
                      <SectionHeading 
                          title={testimonials.title || "Lo que dicen de nosotros"} 
                          subtitle="Confianza" 
                          highlight={testimonials.highlight}
                          className="justify-center"
                      />
                      {testimonials.description && (
                          <p className="text-neutral-400 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
                              {testimonials.description}
                          </p>
                      )}
                  </FadeIn>
              </div>
              <TestimonialsSection testimonials={testimonials.selectedTestimonials} />
          </section>
      )}

      {/* CTA Section */}
      {cta && (
          <section className="py-20 md:py-32 relative z-10 px-6 bg-neutral-950">
              <div className="max-w-4xl mx-auto text-center relative overflow-hidden rounded-3xl bg-neutral-900/10 border border-white/5 py-16 px-6">
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                  <FadeIn className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter mb-4">
                      {cta.title}
                    </h2>
                    <p className="text-neutral-400 text-base mb-8 max-w-lg mx-auto font-light">
                      {cta.description}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Button size="lg" className="bg-white text-black hover:bg-neutral-200 text-sm font-medium h-12 px-8 rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
                         <a href={cta.buttonLink || "#contact"}>{cta.buttonText || "Agendar Llamada"}</a>
                      </Button>
                      <Button size="lg" variant="outline" className="text-neutral-300 hover:text-white hover:bg-white/5 border-neutral-800 text-sm h-12 px-8 rounded-full" asChild>
                          <Link href="/proyectos">Ver Portfolio</Link>
                      </Button>
                    </div>
                  </FadeIn>
              </div>
          </section>
      )}

    </main>
  );
}
