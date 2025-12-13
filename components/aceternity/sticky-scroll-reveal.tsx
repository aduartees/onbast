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
      className="flex justify-center relative lg:space-x-10 rounded-md p-4 md:p-10 transition-colors duration-1000"
      ref={ref}
    >
      <div className="div relative flex items-start px-4 w-full lg:w-1/2">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div 
              key={item.title + index} 
              className={cn(
                "min-h-[40vh] lg:min-h-[60vh] flex flex-col justify-center",
                index === 0 
                  ? "mt-0 mb-10 lg:mb-40" 
                  : index === content.length - 1 
                  ? "mt-10 mb-10 lg:mt-40 lg:mb-0" 
                  : "my-10 lg:my-40"
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
                className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tighter"
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
                className="text-lg md:text-xl text-neutral-400 max-w-lg leading-relaxed"
              >
                {item.description}
              </motion.div>
              <div className="block lg:hidden mt-6 w-full rounded-2xl overflow-hidden aspect-[3/2] border border-white/10 shadow-lg">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={cn(
            "hidden lg:block w-full lg:w-1/2 rounded-2xl sticky top-24 lg:top-32 overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-[3/2] self-start border border-white/5 mb-10 lg:mb-0 bg-neutral-950",
            contentClassName
        )}
      >
         <motion.div
             key={activeCard}
             initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
             animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
             transition={{ duration: 0.8, ease: "easeInOut" }}
             className="w-full h-full relative"
         >
            {content[activeCard].content ?? null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
         </motion.div>
      </div>
    </motion.div>
  );
};
