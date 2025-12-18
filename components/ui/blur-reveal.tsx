"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurRevealProps {
  text: string;
  className?: string;
  highlightClassName?: string;
  highlightWord?: string;
  delay?: number;
  as?: React.ElementType;
}

export const BlurReveal = ({ text, className, highlightClassName, highlightWord, delay = 0, as: Component = "div" }: BlurRevealProps) => {
  if (!text) return null;
  const words = text.split(" ");
  const midIndex = Math.floor(words.length / 2);

  const shouldHighlight = (word: string, index: number) => {
      if (!highlightClassName) return false;
      
      if (highlightWord) {
          // Normalize both for comparison (remove punctuation, lower case)
          const normalizedWord = word.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
          const normalizedHighlight = highlightWord.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
          return normalizedWord === normalizedHighlight;
      }

      // Default logic: middle word(s)
      return index === midIndex || (words.length > 3 && index === midIndex + 1);
  };

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
          <React.Fragment key={index}>
            <motion.span
              variants={child}
              className={cn(
                "inline-block will-change-[opacity,filter,transform]",
                shouldHighlight(word, index) ? highlightClassName : ""
              )}
            >
              {word}
            </motion.span>
            {index < words.length - 1 && " "}
          </React.Fragment>
        ))}
      </motion.span>
    </Component>
  );
};