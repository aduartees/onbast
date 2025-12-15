"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurRevealProps {
  text: string;
  className?: string;
  highlightClassName?: string;
  delay?: number;
  as?: React.ElementType;
}

export const BlurReveal = ({ text, className, highlightClassName, delay = 0, as: Component = "div" }: BlurRevealProps) => {
  const words = text.split(" ");
  const midIndex = Math.floor(words.length / 2);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay * i },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: 20,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <Component className={className}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="inline-block"
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={child}
            className={cn(
              "inline-block mr-[0.25em] will-change-[opacity,filter,transform]",
              // Apply highlight logic (middle word + potential next word if long phrase)
              highlightClassName && (index === midIndex || (words.length > 3 && index === midIndex + 1))
                ? highlightClassName
                : ""
            )}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
};