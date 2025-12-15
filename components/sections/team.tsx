"use client";
import React from "react";
import { ThreeDCarousel } from "@/components/aceternity/three-d-carousel";

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  imageAlt?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
}

export const TeamSection = ({ team }: { team: TeamMember[] }) => {
  return (
    <div className="w-full flex justify-center overflow-hidden">
      <ThreeDCarousel items={team} />
    </div>
  );
};
