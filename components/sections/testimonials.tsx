"use client";
import React from "react";
import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  imageUrl?: string;
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="rounded-md flex flex-col antialiased bg-transparent items-center justify-start relative overflow-hidden mask-image-gradient">
      <div className="absolute inset-0 z-0 bg-neutral-950 opacity-0" /> {/* Clean background */}
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="normal"
      />
    </div>
  );
}
