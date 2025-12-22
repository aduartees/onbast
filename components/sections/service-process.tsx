"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProcessStep {
  title: string;
  description: string;
}

export function ServiceProcess({ steps }: { steps: ProcessStep[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const height = useTransform(scrollYProgress, [0, 1], ["46px", "100%"]);

  return (
    <div ref={containerRef} className="w-full relative py-20 md:py-40 overflow-hidden">
      
      {/* Línea Central de Luz (The Beam) */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-neutral-800 transform md:-translate-x-1/2">
        <motion.div
          style={{ height }}
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500 shadow-[0_0_20px_2px_rgba(99,102,241,0.5)]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {steps.map((step, index) => (
          <TimelineItem 
            key={index} 
            step={step} 
            index={index} 
            isLast={index === steps.length - 1} 
          />
        ))}
      </div>
    </div>
  );
}

const TimelineItem = ({ step, index, isLast }: { step: ProcessStep, index: number, isLast: boolean }) => {
  const isEven = index % 2 === 0;
  
  return (
    <div className={cn(
        "flex flex-col md:flex-row items-start md:items-center justify-between w-full mb-24 last:mb-0 relative",
        isEven ? "md:flex-row" : "md:flex-row-reverse"
    )}>
        
        {/* Espaciador para centrar en Desktop */}
        <div className="hidden md:block w-5/12" />

        {/* Punto Central (Nodo) */}
        <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-neutral-950 border-2 border-indigo-500 z-20 transform md:-translate-x-1/2 mt-1.5 md:mt-0 shadow-[0_0_10px_rgba(99,102,241,0.5)] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
        </div>

        {/* Tarjeta de Contenido */}
        <motion.div 
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn(
                "w-full md:w-5/12 pl-12 md:pl-0 relative",
                isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
            )}
        >
            <div className="bg-neutral-900/40 backdrop-blur-sm border border-white/5 p-6 md:p-8 rounded-2xl hover:bg-neutral-900/60 hover:border-indigo-500/30 transition-all duration-500 group relative overflow-hidden">
                <span
                  className={cn(
                    "absolute top-4 right-4 text-6xl md:text-7xl font-bold text-white/10 font-serif italic select-none pointer-events-none group-hover:text-indigo-500/20 transition-colors",
                    isEven ? "md:right-auto md:left-6" : "md:left-auto md:right-6"
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className={cn(
                  "text-xl md:text-2xl font-bold text-white mb-3 pr-10",
                  isEven ? "md:pl-14 md:pr-0" : "md:pr-14 md:pl-0"
                )}>
                    {step.title}
                </h3>
                <p className={cn(
                  "text-neutral-400 leading-relaxed text-sm md:text-base",
                  isEven ? "md:pl-14" : "md:pr-14"
                )}>
                    {step.description}
                </p>
            </div>
        </motion.div>

    </div>
  );
}
