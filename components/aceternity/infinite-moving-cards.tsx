"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    role: string;
    imageUrl?: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = React.useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      // Duplicate content enough times to ensure smooth scrolling on large screens
      // If we have few items, duplicate more times
      const duplicationFactor = items.length < 5 ? 4 : 2;

      // Only duplicate if we haven't already (check if length is greater than original items)
      if (scrollerRef.current.children.length === items.length) {
          for (let i = 0; i < duplicationFactor; i++) {
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });
          }
      }

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap will-change-transform",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[350px] max-w-full relative rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm px-8 py-6 md:w-[450px] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            key={item.name + idx}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className="relative z-20 text-sm leading-[1.6] text-neutral-100 font-normal italic">
                "{item.quote}"
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                {item.imageUrl && (
                    <Image 
                        src={item.imageUrl}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded-full mr-4 object-cover ring-2 ring-indigo-500/20"
                    />
                )}
                <span className="flex flex-col gap-1">
                  <span className="text-sm leading-[1.6] text-white font-bold">
                    {item.name}
                  </span>
                  <span className="text-xs leading-[1.6] text-indigo-300 font-mono uppercase tracking-wider">
                    {item.role}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
