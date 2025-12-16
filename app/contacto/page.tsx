
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { CONTACT_PAGE_QUERY } from "@/sanity/lib/queries";
import { Navbar } from "@/components/layout/navbar";
import { LuminousPill } from "@/components/ui/luminous-pill";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { FadeIn } from "@/components/ui/fade-in";
import { ScrollReset } from "@/components/utils/scroll-reset";
import { ContactForm } from "@/components/contact/contact-form";
import { InfoCards } from "@/components/contact/info-cards";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceFAQ } from "@/components/sections/service-faq";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(CONTACT_PAGE_QUERY);
  if (!data?.seo) return { title: "Contacto | ONBAST" };

  return {
    title: data.seo.title || "Contacto | ONBAST",
    description: data.seo.description || "Hablemos sobre tu próximo proyecto.",
    openGraph: data.seo.image ? {
        images: [{ url: data.seo.image }]
    } : undefined
  };
}

export default async function ContactPage() {
  const data = await client.fetch(CONTACT_PAGE_QUERY);
  
  // Fallback data
  const hero = data?.hero || {
    title: "Contacto",
    headline: "Empecemos algo extraordinario.",
    description: "Estamos listos para llevar tu visión al siguiente nivel."
  };

  const contactInfo = {
      ...data?.contactInfo,
      ...data?.siteSettings?.agency
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white pt-0">
      <ScrollReset />
      <Navbar />

      {/* Hero Section - Sticky & Immersive */}
      <section className="h-[100dvh] w-full sticky top-0 z-0 flex flex-col items-center justify-center bg-neutral-950 overflow-hidden">
         {/* Background Elements */}
         <div className="absolute inset-0 w-full h-full bg-neutral-950 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[120vw] h-[120vw] md:w-[90vw] md:h-[90vw] bg-indigo-900/20 rounded-full blur-[60px] md:blur-[80px] transform-gpu will-change-transform" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[100vw] h-[100vw] md:w-[80vw] md:h-[80vw] bg-cyan-900/10 rounded-full blur-[60px] md:blur-[80px] transform-gpu will-change-transform" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
         </div>
         <BackgroundBeams className="opacity-40" />

         <div className="relative z-10 flex flex-col items-center justify-center h-full w-full text-center px-8 md:px-20 max-w-5xl mx-auto pt-24 pb-safe md:pt-20 md:pb-12">
            
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

      {/* Main Content - Form & Grid - Overlapping */}
      <section className="relative z-10 bg-neutral-950 min-h-screen border-t border-white/10 rounded-t-[3rem] md:rounded-t-[5rem] -mt-[10vh] pt-20 pb-32 shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
              <FadeIn className="mb-20">
                  <div className="text-center mb-12">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Envíanos un mensaje</h3>
                      <p className="text-neutral-400 max-w-2xl mx-auto">
                          Cuéntanos sobre tu proyecto y te responderemos en menos de 24 horas.
                      </p>
                  </div>
                  <ContactForm />
              </FadeIn>

              <FadeIn delay={0.2}>
                  <div className="mt-24">
                      <div className="text-center mb-12">
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">O contáctanos directamente</h3>
                      </div>
                      <InfoCards info={contactInfo} />
                  </div>
              </FadeIn>
          </div>

          {/* FAQ Section */}
          {data?.faq && (
            <div className="max-w-4xl mx-auto px-6 mt-32 border-t border-white/5 pt-20">
                <FadeIn>
                    <SectionHeading 
                        title={data.faq.title || "Preguntas Frecuentes"} 
                        subtitle="Dudas" 
                        highlight={data.faq.highlight}
                        className="justify-center text-center"
                    />
                    <div className="mt-12">
                        <ServiceFAQ faqs={data.faq.questions || []} />
                    </div>
                </FadeIn>
            </div>
          )}
      </section>

    </main>
  );
}
