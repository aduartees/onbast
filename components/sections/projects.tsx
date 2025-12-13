import { client } from "@/sanity/lib/client";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import { ParallaxScroll } from "@/components/aceternity/parallax-scroll";

interface SanityProject {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  imageUrl: string;
  tags?: string[];
  link?: string;
}

export const ProjectsSection = async () => {
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
    <section className="py-20 bg-neutral-950 w-full" id="projects">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10">
         <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 text-center">
            Proyectos Destacados
          </h2>
          <p className="mt-4 text-neutral-300 text-center max-w-lg mx-auto">
              Una selección de nuestros trabajos más recientes. Diseño de vanguardia y performance extrema.
          </p>
      </div>
      <ParallaxScroll items={projects} />
    </section>
  );
};
