"use client";
import React from "react";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ServiceHeaderProps {
  title: string;
  description: string;
}

export function ServiceHeader({ title, description }: ServiceHeaderProps) {
  return (
    <div className="min-h-[60vh] md:min-h-[70vh] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased px-4 py-12 md:py-0">
      <div className="max-w-4xl mx-auto p-4 relative z-10 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-4xl sm:text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-sans font-bold tracking-tighter leading-tight md:leading-tight"
        >
          {title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-neutral-500 max-w-2xl mx-auto my-6 text-base sm:text-lg md:text-xl relative z-10 font-sans leading-relaxed"
        >
          {description}
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-4 relative z-10 w-full sm:w-auto"
        >
          <Button size="lg" className="bg-white text-black hover:bg-neutral-200 w-full sm:w-auto text-base font-medium px-8 h-12 rounded-full">
            Solicitar Consultoría
          </Button>
        </motion.div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
