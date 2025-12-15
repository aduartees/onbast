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
    <div className="w-[280px] h-[400px] bg-neutral-900/80 border border-white/10 rounded-3xl overflow-hidden relative group backdrop-blur-sm select-none shadow-2xl backface-hidden">
      <Image
        src={member.imageUrl}
        alt={member.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-90" />
      
      <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-xl font-bold text-white font-serif mb-1">{member.name}</h3>
        <p className="text-indigo-400 font-medium text-xs tracking-widest uppercase mb-4">{member.role}</p>
        
        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {member.social?.linkedin && (
            <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors pointer-events-auto">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
           {member.social?.twitter && (
            <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors pointer-events-auto">
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
