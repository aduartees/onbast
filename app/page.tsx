import { HeroSection } from "@/components/sections/hero";
import { PhilosophySection } from "@/components/sections/philosophy";
import { TechArsenalSection } from "@/components/sections/tech-arsenal";
import { ServicesSection } from "@/components/sections/services";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 antialiased selection:bg-cyan-500 selection:text-white">
      <HeroSection />
      <PhilosophySection />
      <TechArsenalSection />
      <ServicesSection />
    </main>
  );
}
