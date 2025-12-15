"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProcessStep {
  title: string;
  description: string;
  imageUrl?: string;
}

export function ServiceProcess({ steps }: { steps: ProcessStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={ref} className="w-full relative py-16 md:py-32">
      
      {/* Línea Central (Background - Gris oscura) */}
      <div className="absolute left-[32px] md:left-1/2 top-0 bottom-0 w-px bg-neutral-800 hidden md:block -translate-x-1/2" />
      <div className="absolute left-[32px] top-0 bottom-0 w-px bg-neutral-800 md:hidden -translate-x-1/2" />

      {/* Línea "Sticky" Animada (Beam - Gradiente Luminoso) */}
      <motion.div 
        style={{ scaleY, transformOrigin: "top" }}
        className="absolute left-[32px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500 hidden md:block shadow-[0_0_15px_rgba(99,102,241,0.8)] z-10 -translate-x-1/2"
      />
      <motion.div 
        style={{ scaleY, transformOrigin: "top" }}
        className="absolute left-[32px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500 md:hidden shadow-[0_0_15px_rgba(99,102,241,0.8)] z-10 -translate-x-1/2"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col gap-12 md:gap-40">
        {steps.map((step, index) => (
          <ProcessCard key={index} step={step} index={index} />
        ))}
      </div>
    </div>
  );
}

const ProcessCard = ({ step, index }: { step: ProcessStep; index: number }) => {
  const isEven = index % 2 === 0;
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["center end", "center center"]
  });

  // Animaciones basadas en scroll individual de cada tarjeta
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [isEven ? 20 : -20, 0]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ opacity, scale }}
      className={cn(
        "relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-0 will-change-[opacity,transform]",
        isEven ? "md:flex-row-reverse" : ""
      )}
    >
      
      {/* Lado del Contenido */}
      <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-16">
        <div
          className={cn(
             "relative p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 bg-neutral-900/80 backdrop-blur-xl hover:border-indigo-500/30 transition-colors group overflow-hidden",
             "shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
          )}
        >
          {/* Número de fondo (Watermark) */}
          <span className="absolute -top-4 -right-2 md:-top-6 md:-right-4 text-6xl md:text-9xl font-bold text-white/[0.03] font-mono select-none pointer-events-none group-hover:text-indigo-500/[0.05] transition-colors duration-500">
            {String(index + 1).padStart(2, "0")}
          </span>

          <h3 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4 relative z-10 flex items-center gap-3">
             <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs md:text-sm text-indigo-300 font-mono border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)] shrink-0">
                {index + 1}
             </span>
             {step.title}
          </h3>
          <div className="relative z-10">
             <p className="text-neutral-400 text-sm md:text-lg leading-relaxed">
               {step.description}
             </p>
          </div>

          {/* Efecto de brillo al pasar el mouse */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>
      </div>

      {/* Nodo Central (Desktop) - Se ilumina al llegar al centro */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-12 h-12">
        <motion.div 
           style={{ scale: scrollYProgress, opacity: scrollYProgress }}
           className="w-4 h-4 rounded-full bg-neutral-950 border-2 border-indigo-500 z-20 relative shadow-[0_0_20px_rgba(99,102,241,1)]"
        >
           <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-50" />
        </motion.div>
      </div>

      {/* Nodo Central (Mobile) - Ajustado pixel-perfect a left-[32px] */}
      <div className="absolute left-[32px] top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden flex items-center justify-center w-12 h-12">
        <motion.div 
            style={{ scale: scrollYProgress, opacity: scrollYProgress }}
            className="w-3 h-3 rounded-full bg-neutral-950 border-2 border-indigo-500 z-20 relative shadow-[0_0_20px_rgba(99,102,241,1)]"
        >
           <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-50" />
        </motion.div>
      </div>

      {/* Espacio vacío para balancear */}
      <div className="w-full md:w-1/2 hidden md:block" />
    </motion.div>
  );
};
