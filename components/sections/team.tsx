"use client";
import React from "react";
import { ThreeDCarousel } from "@/components/aceternity/three-d-carousel";
import { motion } from "framer-motion";
import Image from "next/image";
import { Linkedin, Twitter } from "lucide-react";

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
    <div className="w-full relative">
      {/* Mobile: 3D Carousel */}
      <div className="lg:hidden w-full flex justify-center overflow-hidden">
        <ThreeDCarousel items={team} />
      </div>

      {/* Desktop: Premium Grid */}
      <div className="hidden lg:grid grid-cols-3 gap-8 max-w-7xl mx-auto px-8">
        {team.map((member, index) => (
          <TeamCard key={index} member={member} index={index} />
        ))}
      </div>
    </div>
  );
};

const TeamCard = ({ member, index }: { member: TeamMember; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative h-[400px] w-full overflow-hidden rounded-3xl bg-neutral-900"
    >
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Image
          src={member.imageUrl}
          alt={member.imageAlt || member.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 transition-transform duration-500 group-hover:translate-y-0 will-change-transform">
        <div className="mb-4 h-1 w-12 bg-indigo-500 transition-all duration-500 group-hover:w-20" />
        
        <h3 className="text-3xl font-bold text-white mb-1 font-sans tracking-tight">
          {member.name}
        </h3>
        <p className="text-indigo-300 font-mono text-sm uppercase tracking-widest mb-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 delay-100 will-change-[opacity,transform]">
          {member.role}
        </p>

        {/* Social Icons */}
        <div className="flex gap-4 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 delay-200 will-change-[opacity,transform]">
          {member.social?.linkedin && (
            <a 
              href={member.social.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 hover:text-white text-neutral-300 transition-colors backdrop-blur-md"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {member.social?.twitter && (
            <a 
              href={member.social.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 hover:text-white text-neutral-300 transition-colors backdrop-blur-md"
            >
              <Twitter className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
