"use client";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const ParallaxScroll = ({
  items,
  className,
}: {
  items: {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
    link?: string;
  }[];
  className?: string;
}) => {
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, 0]);

  const third = Math.ceil(items.length / 3);

  const firstPart = items.slice(0, third);
  const secondPart = items.slice(third, 2 * third);
  const thirdPart = items.slice(2 * third);

  return (
    <div
      className={cn("h-auto items-start w-full", className)}
      ref={gridRef}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start  max-w-7xl mx-auto gap-10 px-4 md:px-8"
        ref={gridRef}
      >
        <div className="grid gap-10">
          {firstPart.map((el, idx) => (
            <div key={"grid-1" + idx} className="h-[400px] w-full">
              <ProjectCard project={el} index={idx} />
            </div>
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((el, idx) => (
            <div key={"grid-2" + idx} className="h-[400px] w-full">
              <ProjectCard project={el} index={idx} />
            </div>
          ))}
        </div>
        <div className="grid gap-10">
          {thirdPart.map((el, idx) => (
            <div key={"grid-3" + idx} className="h-[400px] w-full">
              <ProjectCard project={el} index={idx} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { ArrowUpRight } from "lucide-react";

const ProjectCard = ({ project, index = 0 }: { project: any, index?: number }) => {
    return (
        <motion.a 
            href={project.link || "#"} 
            className="group block w-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
        >
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10 transition-all duration-500 group-hover:ring-indigo-500/50 group-hover:shadow-2xl group-hover:shadow-indigo-500/20">
                <Image
                    src={project.imageUrl}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    height="600"
                    width="800"
                    alt={project.title}
                />
                <div className="absolute inset-0 bg-indigo-500/0 transition-colors duration-500 group-hover:bg-indigo-500/10" />
            </div>
            
            <div className="mt-6 flex justify-between items-start gap-4">
                <div>
                    <h3 className="text-xl font-medium text-white group-hover:text-indigo-400 transition-colors duration-300">
                        {project.title}
                    </h3>
                </div>
                <div className="rounded-full border border-white/10 p-2 text-neutral-400 transition-all duration-300 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 group-hover:text-indigo-400">
                    <ArrowUpRight className="h-5 w-5" />
                </div>
            </div>
            {project.description && (
                <p className="mt-3 text-sm text-neutral-400 leading-relaxed line-clamp-2">
                    {project.description}
                </p>
            )}
        </motion.a>
    );
};
