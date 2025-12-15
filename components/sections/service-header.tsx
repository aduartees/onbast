"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ServiceHeaderProps {
  title: string;
  description: string;
  introduction?: string;
  buttonText?: string;
  buttonLink?: string;
  trustedLogos?: { name: string; logo: string }[];
}

const DEFAULT_LOGOS = [
  { name: "Vercel", logo: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" },
  { name: "Next.js", logo: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png" },
  { name: "Sanity", logo: "https://avatars.githubusercontent.com/u/17177659?s=200&v=4" },
  { name: "Tailwind", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
  { name: "React", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
  { name: "Framer", logo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Framer_logo.svg" },
  { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
];

export function ServiceHeader({ title, description, introduction, buttonText, buttonLink, trustedLogos }: ServiceHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const logos = trustedLogos || DEFAULT_LOGOS;

  // Parallax Effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  // Blur Reveal Animation Variant
  const blurReveal = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
    visible: { 
      opacity: 1, 
      filter: "blur(0px)", 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  // Logic to inject cursive into the description
  // Use the description directly from props (now sourced from Sanity's heroHeadline or shortDescription)
  const words = description ? description.split(" ") : [];
  // Find a suitable word to highlight (e.g., a long word in the middle)
  const midIndex = Math.floor(words.length / 2);
  
  return (
    <div 
      ref={ref} 
      className="h-[100dvh] w-full sticky top-0 z-0 flex flex-col items-center justify-center bg-neutral-950 overflow-hidden"
    >
      {/* Delicate Animated Background - Optimized */}
      <div className="absolute inset-0 w-full h-full bg-neutral-950 overflow-hidden pointer-events-none">
        {/* Soft Indigo Orb - Hardware Accelerated */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform, opacity" }}
          className="absolute top-[-20%] left-[-10%] w-[120vw] h-[120vw] md:w-[90vw] md:h-[90vw] bg-indigo-900/20 rounded-full blur-[80px] md:blur-[100px] translate-z-0" 
        />
        {/* Soft Cyan Orb - Hardware Accelerated */}
        <motion.div 
           animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ willChange: "transform, opacity" }}
          className="absolute bottom-[-20%] right-[-10%] w-[100vw] h-[100vw] md:w-[80vw] md:h-[80vw] bg-cyan-900/10 rounded-full blur-[80px] md:blur-[100px] translate-z-0" 
        />
        {/* Noise - Static Layer */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Main Content */}
      <motion.div 
        style={{ y, opacity, scale }} 
        className="relative z-10 flex flex-col items-center justify-center h-full w-full text-center px-4 max-w-7xl mx-auto pt-24 pb-safe md:pt-20 md:pb-12"
        initial="hidden"
        animate="visible"
      >
        
        {/* Luminous Service Pill */}
        <motion.div 
          variants={blurReveal}
          className="mb-6 md:mb-10 mt-auto md:mt-0"
        >
           <span className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] backdrop-blur-md group hover:bg-indigo-500/20 transition-colors cursor-default">
              <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs md:text-sm font-medium text-indigo-200 tracking-wide uppercase">
                {title}
              </span>
           </span>
        </motion.div>

        {/* Big Phrase with Cursive */}
        <motion.h1 
          variants={blurReveal}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-6 md:mb-8 max-w-6xl shrink-0 leading-[1.15] md:leading-[1.1]"
        >
          {words.map((word, i) => (
             <span key={i} className={cn(
               "inline-block mr-1.5 md:mr-4",
               // Make the middle word cursive and slightly colored
               i === midIndex || (words.length > 3 && i === midIndex + 1) ? "font-serif italic font-normal text-indigo-200/90" : ""
             )}>
               {word}
             </span>
          ))}
        </motion.h1>

        {/* Introduction Paragraph */}
        {introduction && (
          <motion.p 
            variants={blurReveal}
            transition={{ delay: 0.15 }}
            className="text-sm md:text-lg text-neutral-400 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed px-4"
          >
            {introduction}
          </motion.p>
        )}

        {/* Buttons */}
        <motion.div 
          variants={blurReveal}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full justify-center mb-auto md:mb-20 shrink-0 px-6 sm:px-0"
        >
          <Button 
            size="default" 
            className="h-10 md:h-11 px-6 md:px-8 text-sm md:text-base bg-white text-black hover:bg-neutral-200 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 w-full sm:w-auto"
            asChild
          >
            <a href={buttonLink || "#contact"}>
              {buttonText || "Comenzar Ahora"}
            </a>
          </Button>
          <Button 
            size="default" 
            variant="outline" 
            className="h-10 md:h-11 px-6 md:px-8 text-sm md:text-base border-neutral-800 bg-black/20 text-neutral-300 hover:bg-white/5 hover:text-white rounded-full backdrop-blur-sm transition-all w-full sm:w-auto"
          >
             Ver Casos de Éxito
          </Button>
        </motion.div>

        {/* Infinite Logo Marquee (Fading) */}
        <motion.div 
           variants={blurReveal}
           transition={{ delay: 0.4 }}
           className="w-full max-w-5xl shrink-0 pb-8 md:pb-0"
        >
           <div className="relative w-full overflow-hidden">
              {/* Gradient Masks for Fade Effect */}
              <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />
              
              {/* Marquee Container */}
              <div className="flex gap-8 md:gap-12 items-center animate-scroll w-max hover:[animation-play-state:paused]">
                 {/* Triple the logos for seamless loop on large screens */}
                 {[...logos, ...logos, ...logos].map((logo, i) => (
                    <div key={i} className="flex items-center justify-center opacity-30 hover:opacity-80 transition-opacity duration-300 group">
                        {logo.logo ? (
                           <Image 
                              src={logo.logo} 
                              alt={logo.name} 
                              width={100} 
                              height={40} 
                              className="h-6 md:h-8 w-auto object-contain brightness-0 invert" 
                           />
                        ) : (
                           <span className="text-lg md:text-2xl font-bold font-mono text-white tracking-tighter uppercase group-hover:text-indigo-300 transition-colors">
                               {logo.name}
                           </span>
                        )}
                    </div>
                 ))}
              </div>
           </div>
        </motion.div>
      </motion.div>
    </div>
  );
}