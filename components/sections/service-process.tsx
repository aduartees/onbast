"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProcessStep {
  title: string;
  description: string;
}

export function ServiceProcess({ steps }: { steps: ProcessStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={ref} className="w-full relative py-20 md:py-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-8 md:gap-12">
        {steps.map((step, index) => (
          <StickyCard key={index} step={step} index={index} total={steps.length} range={[index * 0.25, 1]} targetScale={1 - (steps.length - index) * 0.05} />
        ))}
      </div>
    </div>
  );
}

const StickyCard = ({ step, index, total, range, targetScale }: { step: ProcessStep, index: number, total: number, range: number[], targetScale: number }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
  const scale = useTransform(scrollYProgress, range, [1, targetScale]);
  
  // Alternar colores de gradiente para cada tarjeta
  const gradients = [
    "from-indigo-500/20 to-purple-500/20",
    "from-cyan-500/20 to-blue-500/20",
    "from-rose-500/20 to-orange-500/20",
    "from-emerald-500/20 to-teal-500/20"
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <div ref={container} className="h-auto md:h-[80vh] min-h-[600px] flex items-center justify-center sticky top-[10vh] md:top-[10vh] py-8 md:py-0">
      <motion.div 
        style={{ scale, top: `calc(-5vh + ${index * 25}px)` }} 
        className="relative w-full max-w-5xl h-auto md:h-[600px] min-h-[500px] rounded-[2rem] md:rounded-[3rem] bg-neutral-900 border border-white/10 overflow-hidden shadow-2xl origin-top flex flex-col md:flex-row"
      >
          {/* Lado Izquierdo - Texto */}
          <div className="w-full md:w-1/2 p-6 md:p-16 flex flex-col justify-center relative z-10 order-2 md:order-1">
             <div className="absolute top-6 left-6 md:top-12 md:left-12">
                <span className="text-xs md:text-sm font-mono text-neutral-500 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md">
                    Paso {String(index + 1).padStart(2, '0')}
                </span>
             </div>
             
             <h3 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight mt-8 md:mt-0">
                {step.title}
             </h3>
             <p className="text-neutral-400 text-base md:text-xl leading-relaxed font-light">
                {step.description}
             </p>
          </div>

          {/* Lado Derecho - Visual Abstracto */}
          <div className="w-full md:w-1/2 h-[250px] md:h-full relative overflow-hidden bg-neutral-950 order-1 md:order-2">
             <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40", gradient)} />
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
             
             {/* Círculo decorativo animado */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-neutral-950/50 rounded-full border border-white/5" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-3xl animate-pulse duration-[4000ms]" />
             
             <motion.div style={{ scale: imageScale }} className="relative w-full h-full flex items-center justify-center">
                 <span className="text-[10rem] md:text-[15rem] font-bold text-white/5 font-serif italic select-none">
                    {index + 1}
                 </span>
             </motion.div>
          </div>
      </motion.div>
    </div>
  )
}
