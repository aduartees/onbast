"use client";
import React from "react";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ServiceHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

export function ServiceHeader({ title, description, buttonText, buttonLink }: ServiceHeaderProps) {
  return (
    <div className="min-h-[60vh] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased px-4 pt-20 pb-12 md:py-0 overflow-hidden">
      <div className="max-w-4xl mx-auto p-4 relative z-10 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-4xl sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-200 to-neutral-600 font-sans font-bold tracking-tighter leading-[1.1] md:leading-tight mb-6"
        >
          {title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 max-w-2xl mx-auto my-6 text-base sm:text-xl md:text-2xl relative z-10 font-sans leading-relaxed font-normal"
        >
          {description}
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-8 relative z-10 w-full sm:w-auto"
        >
          <Button 
            asChild
            size="lg" 
            className="bg-white text-black hover:bg-neutral-200 w-full sm:w-auto text-lg font-medium px-10 h-14 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
          >
            <a href={buttonLink || "/contacto"}>
                {buttonText || "Solicitar Consultoría"}
            </a>
          </Button>
        </motion.div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
