"use client";
import React from "react";
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
  const duplicatedItems = React.useMemo(() => {
    const duplicationFactor = items.length < 5 ? 8 : 4;
    return Array.from({ length: duplicationFactor + 1 }).flatMap(() => items);
  }, [items]);

  const duration = speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
  const dir = direction === "left" ? "forwards" : "reverse";

  return (
    <div
      style={
        {
          "--animation-direction": dir,
          "--animation-duration": duration,
        } as React.CSSProperties
      }
      className={cn(
        "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        className={cn(
          "flex min-w-full shrink-0 gap-12 py-4 w-max flex-nowrap items-center will-change-transform",
          "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {duplicatedItems.map((item, idx) => (
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
