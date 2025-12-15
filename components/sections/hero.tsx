"use client";
import React from "react";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

export function HeroSection() {
  return (
    <div className="h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 relative z-10 flex flex-col items-center text-center">
        <h1 className="relative z-10 text-5xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-inter font-bold tracking-tighter">
          onbast.
        </h1>
        <p className="text-neutral-400 max-w-lg mx-auto my-4 text-sm md:text-xl relative z-10 font-mono">
          Agencia de desarrollo web y Posicionamiento
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8 relative z-10 w-full sm:w-auto">
          <Button size="lg" className="bg-white text-black hover:bg-neutral-200 w-full sm:w-auto">
            Comenzar Proyecto
          </Button>
          <Button size="lg" variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800 w-full sm:w-auto">
            Ver Casos de Éxito
          </Button>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
