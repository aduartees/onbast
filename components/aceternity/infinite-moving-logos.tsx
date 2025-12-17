"use client";
import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const InfiniteMovingLogos = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    name: string;
    logo: string;
    alt?: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      // Duplicate content enough times to ensure smooth scrolling
      // For logos, we might need more duplication if they are small
      const duplicationFactor = items.length < 5 ? 8 : 4;

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
        "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-12 py-4 w-max flex-nowrap items-center will-change-transform",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            key={item.name + idx}
          >
             {/* Render Image if URL exists. Ensure src is valid string. */}
             {item.logo ? (
                 <div className="relative h-8 w-24 md:h-10 md:w-32">
                    <Image 
                        src={item.logo} 
                        alt={item.alt || item.name} 
                        title={item.alt || item.name}
                        fill
                        sizes="(max-width: 768px) 100px, 150px"
                        className="object-contain brightness-0 invert" 
                        priority={idx < 6}
                        loading={idx < 6 ? "eager" : "lazy"}
                        onError={(e) => {
                            // Fallback if image fails to load?
                            // For now just hide or log
                            console.error("Error loading logo:", item.logo);
                        }}
                    />
                 </div>
             ) : (
                <span className="text-lg md:text-xl font-bold font-mono text-white tracking-tighter uppercase">
                    {item.name}
                </span>
             )}
          </li>
        ))}
      </ul>
    </div>
  );
};
