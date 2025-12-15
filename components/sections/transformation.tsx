"use client";
import React from "react";
import Image from "next/image";
import { ArrowRight, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";

interface TransformationProps {
  problem: string;
  solution: string;
  imageUrl?: string;
}

export function TransformationSection({ problem, solution, imageUrl }: TransformationProps) {
  if (!problem && !solution) return null;

  return (
    <section className="py-12 md:py-24 mb-20 md:mb-28 relative w-full max-w-6xl mx-auto px-4">
      <FadeIn>
        <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl flex flex-col-reverse lg:grid lg:grid-cols-2">
           
           {/* Background Elements */}
           <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-500/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-purple-500/5 blur-[60px] md:blur-[100px] rounded-full pointer-events-none" />

           {/* Content Side */}
           <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-between gap-8 md:gap-12 bg-neutral-900/30 backdrop-blur-md relative z-10">
              
              {/* Header */}
              <div>
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 md:mb-8">
                     <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                     <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Contexto & Evolución</span>
                 </div>
                 
                 {/* The Problem */}
                 <div className="mb-8 md:mb-10 relative pl-6 border-l border-white/10">
                     <h3 className="text-base md:text-lg font-medium text-white mb-2 md:mb-3 flex items-center gap-2">
                        <span className="text-neutral-500">01.</span>
                        El Desafío
                     </h3>
                     <p className="text-base md:text-lg text-neutral-400 font-light leading-relaxed">
                        {problem}
                     </p>
                 </div>

                 {/* The Solution */}
                 <div className="relative pl-6 border-l-2 border-indigo-500">
                     <h3 className="text-base md:text-lg font-medium text-white mb-2 md:mb-3 flex items-center gap-2">
                        <span className="text-indigo-400">02.</span>
                        Nuestra Solución
                     </h3>
                     <p className="text-lg md:text-2xl text-white font-normal leading-relaxed tracking-tight">
                        {solution}
                     </p>
                 </div>
              </div>

              {/* Decorative Footer of Card */}
              <div className="flex items-center gap-4 pt-6 md:pt-8 border-t border-white/5">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                       <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-neutral-800 border border-neutral-950 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-emerald-500" />
                       </div>
                    ))}
                 </div>
                 <span className="text-[10px] md:text-xs text-neutral-500 font-mono uppercase tracking-wider">
                    Verificado por expertos
                 </span>
              </div>

           </div>

           {/* Visual Side - Image Integration */}
           <div className="relative h-[250px] md:h-[400px] lg:h-auto w-full overflow-hidden">
              {imageUrl ? (
                 <div className="absolute inset-0 h-full w-full group">
                    <Image 
                       src={imageUrl} 
                       alt="Transformation Visual" 
                       fill
                       sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
                       className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    {/* Overlay to blend image */}
                    <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/50 lg:bg-gradient-to-l lg:from-transparent lg:to-neutral-900/50" />
                    
                    {/* Interactive Element */}
                    <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20">
                       <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-500">
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                       </div>
                    </div>
                 </div>
              ) : (
                 <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                    <Zap className="w-12 h-12 text-neutral-800" />
                 </div>
              )}
           </div>

        </div>
      </FadeIn>
    </section>
  );
}
