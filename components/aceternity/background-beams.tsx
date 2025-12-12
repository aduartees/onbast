"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute h-full w-full inset-0 bg-neutral-950",
        className
      )}
    >
      <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_center,transparent_20%,#000)]" />
      <div className="h-full w-full opacity-20">
        <div
          className="absolute inset-0 bg-repeat bg-center opacity-10"
          style={{
            backgroundImage:
              "url(/grid.svg)",
          }}
        />
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute -inset-[100%] opacity-[0.5] blur-[120px]">
          <div
            className={cn(
              "absolute inset-0 h-full w-full bg-[radial-gradient(circle_800px_at_50%_200px,#3b82f6,transparent)]",
              "animate-first mix-blend-screen"
            )}
          />
          <div
            className={cn(
              "absolute inset-0 h-full w-full bg-[radial-gradient(circle_800px_at_0%_300px,#a855f7,transparent)]",
              "animate-second mix-blend-screen"
            )}
          />
          <div
            className={cn(
              "absolute inset-0 h-full w-full bg-[radial-gradient(circle_800px_at_100%_300px,#0ea5e9,transparent)]",
              "animate-third mix-blend-screen"
            )}
          />
          <div
            className={cn(
              "absolute inset-0 h-full w-full bg-[radial-gradient(circle_800px_at_100%_500px,#6366f1,transparent)]",
              "animate-fourth mix-blend-screen"
            )}
          />
          <div
            className={cn(
              "absolute inset-0 h-full w-full bg-[radial-gradient(circle_800px_at_0%_500px,#ec4899,transparent)]",
              "animate-fifth mix-blend-screen"
            )}
          />
        </div>
      </div>
    </div>
  );
};
