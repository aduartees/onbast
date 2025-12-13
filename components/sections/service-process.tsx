"use client";
import React from "react";
import { StickyScroll } from "@/components/aceternity/sticky-scroll-reveal";
import Image from "next/image";

interface ProcessStep {
  title: string;
  description: string;
  imageUrl?: string;
}

export function ServiceProcess({ steps }: { steps: ProcessStep[] }) {
  const content = steps.map((step) => ({
    title: step.title,
    description: step.description,
    content: step.imageUrl ? (
      <div className="h-full w-full flex items-center justify-center text-white relative overflow-hidden">
        <Image
          src={step.imageUrl}
          width={800}
          height={600}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
          alt={step.title}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    ) : (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
         <span className="text-2xl font-bold opacity-50">ONBAST Process</span>
      </div>
    ),
  }));

  return (
    <div className="w-full">
      <StickyScroll content={content} />
    </div>
  );
}
