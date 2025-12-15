import React from "react";
import { cn } from "@/lib/utils";

export const SectionHeading = ({ 
  title, 
  subtitle, 
  highlight, 
  align = "center",
  className
}: { 
  title: string; 
  subtitle?: string; 
  highlight?: string; 
  align?: "left" | "center";
  className?: string;
}) => {
  return (
    <div className={cn("mb-6 md:mb-10", align === "center" ? "text-center" : "text-left", className)}>
      {subtitle && (
        <div className="inline-block px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-4 uppercase tracking-wider">
            {subtitle}
        </div>
      )}
      <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">
        <span className="font-sans">{title}</span>
        {highlight && <span className="font-serif italic font-normal text-indigo-300 ml-2 text-xl md:text-2xl">{highlight}</span>}
      </h2>
      <div className={cn("h-px w-8 bg-indigo-500/30 mt-3", align === "center" ? "mx-auto" : "")} />
    </div>
  );
};
