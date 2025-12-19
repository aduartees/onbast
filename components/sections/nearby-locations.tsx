"use client";
import React from "react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { MapPin } from "lucide-react";

interface NearbyLocationsProps {
  currentServiceSlug: string;
  currentServiceTitle?: string;
  locations: {
    name: string;
    slug: string;
    type: string;
  }[];
}

export function NearbyLocations({ currentServiceSlug, currentServiceTitle, locations }: NearbyLocationsProps) {
  if (!locations || locations.length === 0) return null;

  const label = currentServiceTitle || currentServiceSlug;

  return (
    <section className="py-16 md:py-24 border-t border-white/5 bg-neutral-950">
      <FadeIn>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-2">
              También trabajamos en
            </h3>
            <p className="text-neutral-400">
              Servicios disponibles en otras ubicaciones.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
            {locations.map((loc) => (
              <Link 
                key={loc.slug} 
                href={`/${currentServiceSlug}/${loc.slug}`}
                title={`${label} en ${loc.name}`}
                aria-label={`${label} en ${loc.name}`}
                className="group flex items-center gap-3 p-4 rounded-xl bg-neutral-900/30 border border-white/5 hover:bg-neutral-800/50 hover:border-indigo-500/30 transition-all duration-300 w-full max-w-[260px]"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm text-neutral-300 group-hover:text-white font-medium">
                  {loc.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
