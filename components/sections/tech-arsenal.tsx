"use client";
import React from "react";
import Image from "next/image";
import { WobbleCard } from "@/components/aceternity/wobble-card";

export function TechArsenalSection() {
  return (
    <section className="py-10 bg-neutral-950 w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter mb-4">
            Arsenal Tecnológico
          </h2>
          <p className="text-neutral-400 text-lg">
            Stack nuclear diseñado para la dominación global. Sin compromisos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
            className=""
          >
            <div className="max-w-xs">
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Next.js 15 & Turbopack
              </h2>
              <p className="mt-4 text-left  text-base/6 text-neutral-200">
                El framework más rápido del mundo. Renderizado híbrido, Server Actions y compilación instantánea. Tu competencia sigue cargando mientras tú ya has vendido.
              </p>
            </div>
            <Image
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
              width={500}
              height={500}
              alt="Fast Speed"
              className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
            />
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 min-h-[300px]">
            <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Sanity.io Headless CMS
            </h2>
            <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
              Gestión de contenido estructurado en tiempo real. Edita tu web como si fuera un documento de Google.
            </p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Vercel Edge Network & AI Integration
              </h2>
              <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                Despliegue global en segundos. Tus datos viven en el borde, cerca de tus usuarios. Integración nativa con OpenAI para generar contenido dinámico y optimizado para SEO automáticamente.
              </p>
            </div>
            <Image
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
              width={500}
              height={500}
              alt="Global Network"
              className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
            />
          </WobbleCard>
        </div>
      </div>
    </section>
  );
}
