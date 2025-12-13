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
            <div key={"grid-1" + idx}>
              <ProjectCard project={el} />
            </div>
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((el, idx) => (
            <div key={"grid-2" + idx}>
              <ProjectCard project={el} />
            </div>
          ))}
        </div>
        <div className="grid gap-10">
          {thirdPart.map((el, idx) => (
            <div key={"grid-3" + idx}>
              <ProjectCard project={el} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project }: { project: any }) => {
    return (
        <div className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                    src={project.imageUrl}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    height="400"
                    width="400"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={project.title}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                     <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                     {project.description && (
                        <p className="text-sm text-neutral-300 line-clamp-3">{project.description}</p>
                     )}
                </div>
            </div>
        </div>
    )
}
