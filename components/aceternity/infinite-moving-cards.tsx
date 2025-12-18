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
      // Reduced duplication factor to avoid excessive repetition as per user request
      const duplicationFactor = 0;

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
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_30%,white_70%,transparent)]",
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
            className="w-[350px] max-w-full relative rounded-[2rem] border border-white/5 bg-neutral-900/40 backdrop-blur-md p-8 md:w-[450px] transition-colors hover:bg-neutral-900/60"
            key={item.name + idx}
          >
            <blockquote className="flex flex-col h-full justify-between">
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              
              <div>
                {/* Quote Icon - Clean & Minimal */}
                <div className="mb-6">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-400" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 8.44772 5.01697 9V11C5.01697 11.5523 4.56925 12 4.01697 12H3.01697V5H13.017V15C13.017 18.3137 10.3307 21 7.01697 21H5.01697Z" />
                      </svg>
                  </div>
                </div>

                <span className="relative z-20 text-lg md:text-xl leading-relaxed text-white font-light tracking-tight block mb-6">
                  "{item.quote}"
                </span>
              </div>
              
              <div className="relative z-20 flex flex-row items-center gap-4 pt-6 border-t border-white/5">
                {item.imageUrl && (
                    <div className="relative w-10 h-10">
                        <Image 
                            src={item.imageUrl}
                            alt={item.name}
                            title={item.name}
                            fill
                            sizes="40px"
                            className="rounded-full object-cover grayscale opacity-80"
                        />
                    </div>
                )}
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-white">
                    {item.name}
                  </h3>
                  <h4 className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
                    {item.role}
                  </h4>
                </div>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
