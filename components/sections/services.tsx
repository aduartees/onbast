import { client } from "@/sanity/lib/client";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import { HoverEffect } from "@/components/aceternity/card-hover-effect";
import { cn } from "@/lib/utils";

// Definimos la interfaz para los datos que vienen de Sanity
interface SanityService {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  colSpan?: number;
}

export const ServicesSection = async () => {
  // Fetch data directly from Sanity with ISR (Incremental Static Regeneration)
  // Revalidamos cada 60 segundos para mantener el rendimiento alto pero el contenido fresco
  const services: SanityService[] = await client.fetch(SERVICES_QUERY, {}, {
    next: { revalidate: 60 } 
  });

  return (
    <section className="py-10 bg-neutral-950 w-full relative overflow-hidden" id="services">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full bg-neutral-950 bg-grid-white/[0.05] z-0" />
      <div className="absolute h-full w-full bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Nuestros Servicios
          </h2>
          <p className="mt-4 text-neutral-300 text-sm md:text-base max-w-lg mx-auto">
            Soluciones digitales de alto impacto diseñadas para escalar tu negocio. 
            Gestionados y actualizados en tiempo real.
          </p>
        </div>

        {/* Pasamos los datos de Sanity al componente HoverEffect */}
        <HoverEffect items={services} />
      </div>
    </section>
  );
};
