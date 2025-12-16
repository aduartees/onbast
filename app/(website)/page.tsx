import { HeroSection } from "@/components/sections/hero";
import { PhilosophySection } from "@/components/sections/philosophy";
import { TechArsenalSection } from "@/components/sections/tech-arsenal";
import { ServicesSection } from "@/components/sections/services";
import { ProjectsSection } from "@/components/sections/projects";
import { ContactSection } from "@/components/sections/contact";
import { client } from "@/sanity/lib/client";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const homeData = await client.fetch(HOME_PAGE_QUERY);

  return (
    <main className="min-h-screen bg-neutral-950 antialiased selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      <HeroSection />
      <PhilosophySection header={homeData?.philosophy} />
      <TechArsenalSection header={homeData?.techArsenal} />
      <ServicesSection header={homeData?.services} />
      <ProjectsSection header={homeData?.projects} />
      <ContactSection header={homeData?.contact} />
    </main>
  );
}
