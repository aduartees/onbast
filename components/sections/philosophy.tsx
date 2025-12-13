"use client";
import React from "react";
import { StickyScroll } from "@/components/aceternity/sticky-scroll-reveal";
import Image from "next/image";

const content = [
  {
    title: "GEO: La Nueva Era de la Búsqueda",
    description:
      "El SEO tradicional ha muerto. Bienvenido al Generative Engine Optimization. Optimizamos tu marca para que sea la respuesta #1 en ChatGPT, Gemini, Perplexity y Claude. No buscamos clicks, buscamos ser la fuente de verdad para las IAs.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop"
          width={900}
          height={600}
          className="h-full w-full object-cover"
          alt="AI Brain"
        />
      </div>
    ),
  },
  {
    title: "Velocidad Supersónica",
    description:
      "Cada milisegundo cuenta. Desarrollamos con Next.js 15 y Turbopack, desplegando en el Edge. Tus usuarios experimentarán cargas instantáneas, animaciones a 60fps y una fluidez que retiene la atención y dispara las conversiones.",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
          width={900}
          height={600}
          className="h-full w-full object-cover"
          alt="Cyberpunk Speed"
        />
      </div>
    ),
  },
  {
    title: "Automatización Autónoma",
    description:
      "Deja que los robots trabajen por ti. Integramos agentes de IA que cualifican leads, responden dudas complejas y gestionan tu agenda 24/7. Transformamos tu web de un folleto estático a una máquina de ventas incansable.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2006&auto=format&fit=crop"
          width={900}
          height={600}
          className="h-full w-full object-cover"
          alt="Automation"
        />
      </div>
    ),
  },
];

export function PhilosophySection() {
  return (
    <section className="py-20 bg-neutral-950" id="about">
        <div className="max-w-4xl mx-auto px-4 mb-20 text-center">
            <h2 className="text-3xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 mb-6 tracking-tighter">
                Filosofía ONBAST
            </h2>
            <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto">
                No hacemos webs. Construimos ecosistemas digitales dominantes.
            </p>
        </div>
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
        <StickyScroll content={content} />
      </div>
    </section>
  );
}
