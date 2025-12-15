"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactSection() {
  return (
    <section className="py-10 bg-neutral-950 w-full relative" id="contact">
      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            ¿Listo para escalar?
          </h2>
          <p className="mt-4 text-neutral-400 text-sm md:text-base max-w-lg mx-auto">
            No buscamos clientes, buscamos socios estratégicos. Cuéntanos tu visión.
          </p>
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
