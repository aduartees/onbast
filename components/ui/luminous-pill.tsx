"use client";
import React from "react";
import { motion } from "framer-motion";

interface LuminousPillProps {
  title: string;
}

export const LuminousPill = ({ title }: LuminousPillProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mb-8 md:mb-12 flex justify-center"
    >
       <h1 className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] backdrop-blur-md group hover:bg-indigo-500/20 transition-colors cursor-default">
          <span className="text-xs md:text-sm font-medium text-indigo-200 tracking-wide uppercase">
            {title}
          </span>
       </h1>
    </motion.div>
  );
};
