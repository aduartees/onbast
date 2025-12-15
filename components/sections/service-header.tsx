"use client";
import React from "react";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface ServiceHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

export function ServiceHeader({ title, description, buttonText, buttonLink }: ServiceHeaderProps) {
  return (
    <AuroraBackground className="min-h-[85vh] bg-neutral-950">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <h1 className="text-4xl md:text-7xl font-bold dark:text-white text-center tracking-tight leading-tight">
          {title}
        </h1>
        <p className="font-light text-base md:text-2xl dark:text-neutral-200 py-4 max-w-3xl text-center leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-col items-center gap-8 mt-4">
            <Button 
              asChild
              size="lg" 
              className="bg-white dark:bg-white text-black hover:bg-neutral-200 font-medium px-8 h-12 rounded-full shadow-2xl transition-all hover:scale-105"
            >
              <a href={buttonLink || "/contacto"}>
                  {buttonText || "Solicitar Consultoría"}
              </a>
            </Button>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="text-neutral-400 mt-8"
            >
                <ArrowDown className="w-6 h-6" />
            </motion.div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
