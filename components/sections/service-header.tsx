"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { InfiniteMovingLogos } from "@/components/aceternity/infinite-moving-logos";

interface ServiceHeaderProps {
  title: string;
  description: string;
  introduction?: string;
  buttonText?: string;
  buttonLink?: string;
  trustedLogos?: { name: string; logo: string; alt?: string }[];
}

const DEFAULT_LOGOS = [
  { name: "Vercel", logo: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png", alt: "Vercel" },
  { name: "Next.js", logo: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png", alt: "Next.js" },
  { name: "Sanity", logo: "https://avatars.githubusercontent.com/u/17177659?s=200&v=4", alt: "Sanity" },
  { name: "Tailwind", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg", alt: "Tailwind CSS" },
  { name: "React", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg", alt: "React" },
  { name: "Framer", logo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Framer_logo.svg", alt: "Framer Motion" },
  { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg", alt: "OpenAI" },
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", alt: "Google" },
];

export function ServiceHeader({ title, description, introduction, buttonText, buttonLink, trustedLogos }: ServiceHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Use trustedLogos if available and not empty; otherwise use DEFAULT_LOGOS
  const logos = (trustedLogos && trustedLogos.length > 0) ? trustedLogos : DEFAULT_LOGOS;

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
        {/* Soft Indigo Orb - Static/Simple Animation for Performance */}
        <div className="absolute top-[-20%] left-[-10%] w-[120vw] h-[120vw] md:w-[90vw] md:h-[90vw] bg-indigo-900/20 rounded-full blur-[60px] md:blur-[80px] transform-gpu will-change-transform" />
        
        {/* Soft Cyan Orb - Static/Simple Animation for Performance */}
        <div className="absolute bottom-[-20%] right-[-10%] w-[100vw] h-[100vw] md:w-[80vw] md:h-[80vw] bg-cyan-900/10 rounded-full blur-[60px] md:blur-[80px] transform-gpu will-change-transform" />
        
        {/* Noise - Static Layer */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Main Content */}
      <motion.div 
        style={{ y, opacity, scale }} 
        className="relative z-10 flex flex-col items-center justify-center h-full w-full text-center px-8 md:px-20 max-w-5xl mx-auto pt-24 pb-safe md:pt-20 md:pb-12 will-change-[transform,opacity]"
        initial="hidden"
        animate="visible"
      >
        
        {/* Luminous Service Pill */}
        <motion.div 
          variants={blurReveal}
          className="mb-8 md:mb-12 mt-auto md:mt-0"
        >
           <h1 className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] backdrop-blur-md group hover:bg-indigo-500/20 transition-colors cursor-default">
              <span className="text-xs md:text-sm font-medium text-indigo-200 tracking-wide uppercase">
                {title}
              </span>
           </h1>
        </motion.div>

        {/* Big Phrase with Cursive */}
        <div className="mb-8 md:mb-10 max-w-4xl shrink-0">
          <BlurReveal
            text={description}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.15] md:leading-[1.1]"
            highlightClassName="font-serif italic font-normal text-indigo-200/90"
            delay={0.1}
          />
        </div>

        {/* Introduction Paragraph */}
        {introduction && (
          <div className="max-w-xl mx-auto mb-10 md:mb-16 px-4">
             <BlurReveal
               text={introduction}
               className="text-sm md:text-base text-neutral-400 leading-relaxed"
               delay={0.3}
               as="p"
             />
          </div>
        )}

        {/* Buttons */}
        <motion.div 
          variants={blurReveal}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full justify-center mb-auto md:mb-20 shrink-0 px-6 sm:px-0"
        >
          <Button 
            size="default" 
            className="h-9 md:h-10 px-5 md:px-7 text-xs md:text-sm bg-white text-black hover:bg-neutral-200 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 w-full sm:w-auto font-medium"
            asChild
          >
            <a href={buttonLink || "#contact"}>
              {buttonText || "Comenzar Ahora"}
            </a>
          </Button>
          <Button 
            size="default" 
            variant="outline" 
            className="h-9 md:h-10 px-5 md:px-7 text-xs md:text-sm border-neutral-800 bg-black/20 text-neutral-300 hover:bg-white/5 hover:text-white rounded-full backdrop-blur-sm transition-all w-full sm:w-auto font-medium"
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
           <InfiniteMovingLogos 
              items={logos} 
              speed="slow" 
              direction="left"
              pauseOnHover={true}
           />
        </motion.div>
      </motion.div>
    </div>
  );
}