import { client } from "@/sanity/lib/client";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import { ParallaxScroll } from "@/components/aceternity/parallax-scroll";
import { SectionHeading } from "@/components/ui/section-heading";
import { FadeIn } from "@/components/ui/fade-in";

interface SanityProject {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  imageUrl: string;
  tags?: string[];
  link?: string;
}

interface ProjectsSectionProps {
  header?: {
    pill?: string;
    title?: string;
    highlight?: string;
    description?: string;
  };
}

export const ProjectsSection = async ({ header }: ProjectsSectionProps) => {
  const projects: SanityProject[] = await client.fetch(PROJECTS_QUERY, {}, {
    next: { revalidate: 60 }
  });

  // If no projects, don't render section (or render placeholder)
  // For demo purposes, if empty, we might want to show some static data or just hide it.
  // We'll hide it if empty to follow "Data First" - if no data, no UI.
  if (!projects || projects.length === 0) {
      return null;
  }

  return (
    <section className="py-24 bg-neutral-950 w-full" id="projects">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
         <FadeIn>
           <SectionHeading 
             title={header?.title || "Proyectos Destacados"}
             subtitle={header?.pill}
             highlight={header?.highlight}
             align="center"
             titleClassName="text-3xl md:text-5xl"
           />
           <p className="mt-4 text-neutral-400 text-center max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
               {header?.description || "Una selección de nuestros trabajos más recientes. Diseño de vanguardia y performance extrema."}
           </p>
         </FadeIn>
      </div>
      <ParallaxScroll items={projects} />
    </section>
  );
};
