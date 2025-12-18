"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, PanInfo } from "framer-motion";
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

export const ThreeDCarousel = ({ items }: { items: TeamMember[] }) => {
  const [rotation, setRotation] = useState(0);
  const rotationValue = useMotionValue(0);
  const springRotation = useSpring(rotationValue, {
    stiffness: 150,
    damping: 30,
    mass: 1,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const handlePan = (_: any, info: PanInfo) => {
    const dragFactor = 0.5; // Sensitivity
    const newRotation = rotation + info.delta.x * dragFactor;
    setRotation(newRotation);
    rotationValue.set(newRotation);
  };

  const handlePanEnd = (_: any, info: PanInfo) => {
    // Snap to nearest item logic
    const anglePerItem = 360 / items.length;
    const currentRotation = rotationValue.get();
    
    // Adjust rotation by velocity for inertia feel
    const adjustedRotation = currentRotation + info.velocity.x * 0.2;
    
    const snappedRotation = Math.round(adjustedRotation / anglePerItem) * anglePerItem;
    
    setRotation(snappedRotation);
    rotationValue.set(snappedRotation);
  };

  // Click to center logic
  const handleClick = (index: number) => {
      const anglePerItem = 360 / items.length;
      // We want this item to be at 0 degrees (front)
      // Current position is index * anglePerItem
      // Target rotation needs to counteract this
      
      // Find the nearest multiple of 360 to keep rotation smooth (don't spin wildy)
      const currentRot = rotationValue.get();
      const targetBase = -1 * (index * anglePerItem);
      
      // Calculate turns to minimize travel distance
      const currentTurns = Math.round(currentRot / 360);
      let targetRot = targetBase + (currentTurns * 360);
      
      // Adjust if taking the long way around
      const diff = targetRot - currentRot;
      if (Math.abs(diff) > 180) {
          targetRot -= Math.sign(diff) * 360;
      }
      
      setRotation(targetRot);
      rotationValue.set(targetRot);
  };

  // Calculate radius based on width and number of items
  // Radius = (Width of Item / 2) / tan(PI / numItems)
  const itemWidth = 300; // Approximate width of a card
  const radius = items.length > 2 
    ? (itemWidth / 2) / Math.tan(Math.PI / items.length) + 50 // Added buffer
    : 300; // Fallback for few items

  return (
    <div 
      className="relative w-full h-[500px] flex items-center justify-center overflow-hidden [perspective:1000px]"
      ref={containerRef}
    >
      <motion.div
        className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d] cursor-grab active:cursor-grabbing"
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        style={{
          rotateY: springRotation,
        }}
        whileTap={{ cursor: "grabbing" }}
      >
        {items.map((member, index) => {
          const angle = (360 / items.length) * index;
          
          return (
            <div
              key={index}
              className="absolute flex items-center justify-center"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                transformStyle: "preserve-3d",
              }}
              onClick={(e) => {
                 e.stopPropagation(); // Prevent drag start if clicking immediately
                 handleClick(index);
              }}
            >
              <TeamCard member={member} />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

const TeamCard = ({ member }: { member: TeamMember }) => {
  return (
    <div className="w-[280px] h-[400px] group relative overflow-hidden rounded-[2rem] bg-neutral-900 border border-white/5 hover:border-white/10 transition-colors select-none shadow-2xl backface-hidden">
      {/* Background Image - Clean & Sharp */}
      <div className="absolute inset-0 h-full w-full">
        <Image
          src={member.imageUrl}
          alt={member.imageAlt || member.name}
          title={member.imageAlt || member.name}
          fill
          className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105 pointer-events-none"
        />
        {/* Subtle Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
      </div>

      {/* Floating Glass Info Card */}
      <div className="absolute bottom-4 left-4 right-4 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] translate-y-2 transition-transform duration-500 group-hover:translate-y-0 will-change-transform">
         <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
              {member.name}
            </h3>
            <p className="text-indigo-300 font-mono text-xs uppercase tracking-wider font-medium">
              {member.role}
            </p>
         </div>

         {/* Divider & Socials (Reveal on Hover) */}
         <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
            <div className="overflow-hidden">
               <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-3">
                  {member.social?.linkedin && (
                    <a 
                      href={member.social.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title="LinkedIn Profile"
                      className="text-neutral-400 hover:text-white transition-colors pointer-events-auto"
                      onPointerDown={(e) => e.stopPropagation()}
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.social?.twitter && (
                    <a 
                      href={member.social.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-white transition-colors pointer-events-auto"
                      onPointerDown={(e) => e.stopPropagation()}
                      aria-label="X (Twitter) Profile"
                      title="X (Twitter) Profile"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
