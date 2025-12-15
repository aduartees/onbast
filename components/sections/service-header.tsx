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
    <div className="min-h-[40vh] md:min-h-[50vh] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased px-4 pt-24 pb-12 overflow-hidden">
      <div className="max-w-4xl mx-auto p-4 relative z-10 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-3xl sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-200 to-neutral-500 font-sans font-bold tracking-tight leading-tight mb-4"
        >
          {title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-neutral-400 max-w-xl mx-auto my-4 text-sm sm:text-base md:text-lg relative z-10 font-sans leading-relaxed font-light"
        >
          {description}
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-6 relative z-10 w-full sm:w-auto"
        >
          <Button 
            asChild
            size="lg" 
            className="bg-white text-black hover:bg-neutral-200 w-full sm:w-auto text-sm font-medium px-8 h-12 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-105"
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
