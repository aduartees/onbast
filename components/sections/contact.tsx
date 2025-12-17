"use client";
import React from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { FadeIn } from "@/components/ui/fade-in";
import { ContactForm } from "@/components/contact/contact-form";

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
    <section className="py-20 bg-neutral-950 w-full relative" id="contact">
      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        <div className="mb-12">
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

        <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
            <ContactForm />
        </div>
      </div>
    </section>
  );
}
