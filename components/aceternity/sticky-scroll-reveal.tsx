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
      <div className="div relative flex items-start px-4 w-full lg:w-1/2">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div 
              key={item.title + index} 
              className={cn(
                "min-h-[40vh] lg:min-h-[60vh] flex flex-col justify-center", // Tall enough to trigger scroll events properly
                index === 0 
                  ? "mt-0 mb-8 lg:mb-16" 
                  : index === content.length - 1 
                  ? "mt-8 mb-8 lg:mt-16 lg:mb-16" 
                  : "my-8 lg:my-16"
              )}
            >
              <motion.h2
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  x: activeCard === index ? 0 : -20,
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
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                transition={{ duration: 0.5 }}
                className="text-sm md:text-base text-neutral-400 max-w-lg leading-relaxed font-light mb-6"
              >
                {item.description}
              </motion.div>
              
              {/* Image visible ONLY on mobile */}
              <div className="block lg:hidden w-full rounded-xl overflow-hidden aspect-[16/9] border border-white/10 shadow-2xl relative">
                {item.content}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
          {/* Extra spacer at the end to allow scrolling past the last item to trigger it fully if needed */}
          <div className="h-[20vh]" />
        </div>
      </div>
      
      {/* Sticky Panel VISIBLE on Desktop - Centered Viewport */}
      <div className="hidden lg:flex w-full lg:w-1/2 sticky top-0 h-screen items-center justify-center">
        <div
          className={cn(
            "w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-[16/10] border border-white/5 bg-neutral-950",
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
      </div>
    </motion.div>
  );
};
