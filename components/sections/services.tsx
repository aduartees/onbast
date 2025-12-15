import { client } from "@/sanity/lib/client";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";
import { cn } from "@/lib/utils";
import { 
  Code2, 
  Search, 
  Cpu, 
  Globe, 
  Megaphone, 
  BarChart3,
  Bot,
  Layers
} from "lucide-react";
import Image from "next/image";

// Definimos la interfaz para los datos que vienen de Sanity
interface SanityService {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  colSpan?: number;
}

// Icon mapper helper
const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    "Code": Code2,
    "Search": Search,
    "Cpu": Cpu,
    "Globe": Globe,
    "Marketing": Megaphone,
    "Analytics": BarChart3,
    "AI": Bot,
    "Stack": Layers
  };
  const IconComponent = icons[iconName] || Layers;
  return <IconComponent className="h-4 w-4 text-neutral-300" />;
};

export const ServicesSection = async () => {
  // Fetch data directly from Sanity with ISR (Incremental Static Regeneration)
  const services: SanityService[] = await client.fetch(SERVICES_QUERY, {}, {
    next: { revalidate: 0 } 
  });

  return (
    <section className="py-24 bg-neutral-950 w-full relative overflow-hidden" id="services">
      {/* Background Elements - Premium Dark Mode */}
      <div className="absolute inset-0 w-full h-full bg-neutral-950 z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-cyan-500 font-mono text-sm tracking-widest uppercase mb-4 block">
            Nuestra Expertise
          </span>
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 tracking-tight">
            Soluciones de Alto Calibre
          </h2>
          <p className="mt-6 text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Fusionamos diseño de élite con ingeniería robusta. 
            Servicios diseñados para marcas que no aceptan segundos lugares.
          </p>
        </div>

        <BentoGrid className="max-w-7xl mx-auto">
          {services.map((service, i) => (
            <BentoGridItem
              key={service._id}
              title={service.title}
              description={service.description}
              link={`/services/${service.slug}`}
              header={
                service.imageUrl ? (
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden relative">
                         <Image 
                            src={service.imageUrl}
                            alt={service.title}
                            width={400}
                            height={300}
                            className="object-cover w-full h-full absolute inset-0 opacity-60 group-hover/bento:opacity-100 group-hover/bento:scale-105 transition-all duration-500"
                         />
                         <div className="absolute inset-0 bg-neutral-950/20 group-hover/bento:bg-transparent transition-colors duration-500" />
                    </div>
                ) : (
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />
                )
              }
              icon={getIcon(service.icon || "Stack")}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};
