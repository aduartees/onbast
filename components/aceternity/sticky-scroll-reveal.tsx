"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Map scroll progress to card index
    // We want the change to happen a bit earlier than exactly evenly distributed
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "var(--neutral-950)",
    "var(--neutral-900)",
    "var(--neutral-950)",
  ];

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length] as any,
      }}
      className="flex justify-center relative lg:space-x-10 rounded-md p-4 md:p-8 transition-colors duration-1000"
      ref={ref}
    >
      <div className="div relative flex items-start px-4 w-full lg:w-2/3 mx-auto">
        <div className="max-w-3xl mx-auto">
          {content.map((item, index) => (
            <div 
              key={item.title + index} 
              className={cn(
                "min-h-[30vh] flex flex-col justify-center", // Reduced height, no longer sticky needs
                index === 0 
                  ? "mt-0 mb-12" 
                  : index === content.length - 1 
                  ? "mt-12 mb-0" 
                  : "my-12"
              )}
            >
              <motion.h2
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.7, // Higher base opacity
                  x: activeCard === index ? 0 : 0,
                }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight font-sans"
              >
                {item.title}
              </motion.h2>
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.7,
                }}
                transition={{ duration: 0.5 }}
                className="text-sm md:text-base text-neutral-400 max-w-xl leading-relaxed font-light mb-6"
              >
                {item.description}
              </motion.div>
              
              {/* Image is now visible on ALL screens (desktop included) */}
              <div className="block w-full rounded-xl overflow-hidden aspect-[16/9] border border-white/10 shadow-2xl relative">
                {item.content}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sticky Panel HIDDEN as per user preference for mobile-like layout */}
      <div
        className={cn(
            "hidden w-full lg:w-1/2 rounded-2xl sticky top-24 lg:top-32 overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-[3/2] self-start border border-white/5 mb-10 lg:mb-0 bg-neutral-950",
            contentClassName
        )}
      >
         <motion.div
             key={activeCard}
             initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
             animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
             transition={{ duration: 0.5, ease: "easeInOut" }}
             className="w-full h-full relative"
         >
            {content[activeCard].content ?? null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
         </motion.div>
      </div>
    </motion.div>
  );
};
