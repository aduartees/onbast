"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/ui/section-heading";
import { FadeIn } from "@/components/ui/fade-in";

interface ContactSectionProps {
  header?: {
    pill?: string;
    title?: string;
    highlight?: string;
    description?: string;
  };
}

export function ContactSection({ header }: ContactSectionProps) {
  return (
    <section className="py-10 bg-neutral-950 w-full relative" id="contact">
      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        <div className="mb-10">
          <FadeIn>
            <SectionHeading 
               title={header?.title || "¿Listo para escalar?"}
               subtitle={header?.pill}
               highlight={header?.highlight}
               align="center"
               titleClassName="text-3xl md:text-5xl"
             />
            <p className="mt-4 text-neutral-400 text-sm md:text-base max-w-lg mx-auto text-center">
              {header?.description || "No buscamos clientes, buscamos socios estratégicos. Cuéntanos tu visión."}
            </p>
          </FadeIn>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl backdrop-blur-sm">
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-neutral-300">Nombre</label>
                        <Input id="name" placeholder="Tu nombre" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</label>
                        <Input id="email" type="email" placeholder="tu@empresa.com" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-neutral-300">Mensaje</label>
                    <Textarea id="message" placeholder="¿Qué quieres construir?" className="min-h-[120px]" />
                </div>
                <Button className="w-full bg-white text-black hover:bg-neutral-200" size="lg">
                    Enviar Solicitud
                </Button>
            </form>
        </div>
      </div>
    </section>
  );
}
