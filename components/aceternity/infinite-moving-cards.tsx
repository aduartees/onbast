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

  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    containerRef.current.style.cursor = 'grabbing';
    containerRef.current.style.setProperty("animation-play-state", "paused");
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsDragging(false);
    containerRef.current.style.cursor = 'grab';
    containerRef.current.style.removeProperty("animation-play-state");
  };

  const handleMouseUp = () => {
    if (!containerRef.current) return;
    setIsDragging(false);
    containerRef.current.style.cursor = 'grab';
    containerRef.current.style.removeProperty("animation-play-state");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast
    
    // Manual infinite scroll logic
    const maxScrollLeft = containerRef.current.scrollWidth - containerRef.current.clientWidth;
    let newScrollLeft = scrollLeft - walk;

    if (newScrollLeft < 0) {
        newScrollLeft = maxScrollLeft + newScrollLeft; // Loop to end
    } else if (newScrollLeft > maxScrollLeft) {
        newScrollLeft = newScrollLeft - maxScrollLeft; // Loop to start
    }

    containerRef.current.scrollLeft = newScrollLeft;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    containerRef.current.style.setProperty("animation-play-state", "paused");
  };

  const handleTouchEnd = () => {
    if (!containerRef.current) return;
    setIsDragging(false);
    containerRef.current.style.removeProperty("animation-play-state");
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    // Don't prevent default here to allow vertical scrolling of the page
    // e.preventDefault(); 
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast
    
    // Manual infinite scroll logic
    const maxScrollLeft = containerRef.current.scrollWidth - containerRef.current.clientWidth;
    let newScrollLeft = scrollLeft - walk;

    if (newScrollLeft < 0) {
        newScrollLeft = maxScrollLeft + newScrollLeft; // Loop to end
    } else if (newScrollLeft > maxScrollLeft) {
        newScrollLeft = newScrollLeft - maxScrollLeft; // Loop to start
    }

    containerRef.current.scrollLeft = newScrollLeft;
  };

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
        "scroller relative z-20  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] cursor-grab",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          " flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && !isDragging && "animate-scroll ",
          pauseOnHover && !isDragging && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-8 py-6 md:w-[450px]"
            style={{
              background:
                "linear-gradient(180deg, var(--slate-800), var(--slate-900)",
            }}
            key={item.name}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className=" relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">
                "{item.quote}"
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                {item.imageUrl && (
                    <Image 
                        src={item.imageUrl}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded-full mr-4 object-cover"
                    />
                )}
                <span className="flex flex-col gap-1">
                  <span className=" text-sm leading-[1.6] text-gray-400 font-normal">
                    {item.name}
                  </span>
                  <span className=" text-sm leading-[1.6] text-gray-400 font-normal">
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
