"use client";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => {
    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "rounded-2xl relative bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out",
          hovered !== null && hovered !== index && "blur-sm scale-[0.98] grayscale opacity-50",
          hovered === index && "scale-[1.02] ring-2 ring-indigo-500/50"
        )}
      >
        <Image
          src={card.imageUrl}
          alt={card.title}
          title={card.title}
          fill
          className="object-cover absolute inset-0"
        />
        <div
          className={cn(
            "absolute inset-0 bg-black/50 flex flex-col justify-end py-8 px-6 transition-opacity duration-300",
            hovered === index ? "opacity-100" : "opacity-60"
          )}
        >
          <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent absolute inset-0 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-xl md:text-3xl font-bold text-white mb-2">{card.title}</h3>
            <p className="text-neutral-300 text-sm md:text-base line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
               {card.description}
            </p>
            <Link 
               href={card.link}
               title="Ver Servicio"
               className={cn(
                 "inline-flex items-center gap-2 text-indigo-400 font-medium text-sm md:text-base transition-all duration-300",
                 hovered === index ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
               )}
            >
               Ver Servicio <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";

export function FocusCards({ cards }: { cards: any[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
