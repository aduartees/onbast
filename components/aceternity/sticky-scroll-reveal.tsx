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
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const handleScroll = () => {
        const viewportCenter = window.innerHeight / 2;
        
        const container = ref.current;
        if (container) {
           const containerRect = container.getBoundingClientRect();
           // Ajusté la tolerancia para que detecte el final un poco antes
           const isAtBottom = containerRect.bottom <= window.innerHeight + 100; 
           if (isAtBottom) {
               setActiveCard(cardRefs.current.length - 1);
               return;
           }
        }

        let closestIndex = 0;
        let minDistance = Number.MAX_VALUE;

        cardRefs.current.forEach((card, index) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          // Calculamos el centro de la tarjeta
          const cardCenter = rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - cardCenter);

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        setActiveCard(closestIndex);
      };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      // CAMBIO 1: Ajuste del padding del contenedor principal (py-10 en vez de py-0)
      className="flex justify-center relative lg:space-x-10 rounded-md px-4 md:px-8 py-10 transition-colors duration-1000 w-full"
      ref={ref}
    >
      <div className="div relative flex items-start px-4 w-full lg:w-1/2">
        <div className="max-w-2xl w-full">
          {content.map((item, index) => (
            <div 
              key={item.title + index} 
              ref={(el) => { if (el) cardRefs.current[index] = el; }} // Ensure we don't store nulls
              className={cn(
                "flex flex-col",
                // First item starts higher to avoid huge gap with section title
                index === 0 ? "justify-start pt-10 lg:pt-32" : "justify-center",
                // Mobile: 60vh always
                // Desktop: Last item is drastically smaller (20vh) to kill whitespace immediately
                index === content.length - 1 ? "min-h-[40vh] lg:min-h-[40vh]" : "min-h-[60vh] lg:min-h-screen",
                "py-10 lg:py-0" 
              )}
            >
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
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
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                transition={{ duration: 0.5 }}
                className="text-neutral-500 max-w-sm mt-4 text-base md:text-lg"
              >
                {item.description}
              </motion.div>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        style={{ background: backgroundColors[activeCard % backgroundColors.length] as any }}
        className={cn(
          "hidden lg:block h-80 w-[30rem] rounded-md bg-white sticky top-10 overflow-hidden",
          contentClassName
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
};