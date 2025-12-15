"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  link,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  link?: string;
}) => {
  const Content = () => (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-neutral-900/50 dark:border-white/[0.1] bg-white border border-transparent justify-between flex flex-col space-y-4 relative overflow-hidden backdrop-blur-sm",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/0 to-neutral-900/80 z-0 pointer-events-none" />
      
      {/* Header/Image Area */}
      <div className="group-hover/bento:translate-x-2 transition duration-200 z-10">
        {header}
      </div>

      <div className="group-hover/bento:translate-x-2 transition duration-200 z-10">
        <div className="flex items-center justify-between mb-2">
           <div className="p-2 rounded-lg bg-neutral-800 text-neutral-200">{icon}</div>
           {link && <ArrowRight className="w-5 h-5 text-neutral-500 group-hover/bento:text-white transition-colors" />}
        </div>
        
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-400 line-clamp-3">
          {description}
        </div>
      </div>
    </div>
  );

  return link ? (
    <Link href={link} className="block h-full">
      <Content />
    </Link>
  ) : (
    <Content />
  );
};
