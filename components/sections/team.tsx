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
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  return (
    <div className="w-full relative">
      {/* Mobile: 3D Carousel - Only rendered if NOT desktop */}
      {!isDesktop && (
        <div className="lg:hidden w-full flex justify-center overflow-hidden">
          <ThreeDCarousel items={team} />
        </div>
      )}

      {/* Desktop: Premium Grid - Only rendered if desktop */}
      {isDesktop && (
        <div className="hidden lg:grid grid-cols-3 gap-8 max-w-7xl mx-auto px-8 place-items-center">
          {team.map((member, index) => (
            <TeamCard key={index} member={member} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

const TeamCard = ({ member, index }: { member: TeamMember; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative h-[450px] w-full overflow-hidden rounded-[2rem] bg-neutral-900 border border-white/5 hover:border-white/10 transition-colors"
    >
      {/* Background Image - Clean & Sharp */}
      <div className="absolute inset-0 h-full w-full">
        <Image
          src={member.imageUrl}
          alt={member.imageAlt || member.name}
          title={member.imageAlt || member.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
        />
        {/* Subtle Gradient for text readability - Fixed for Mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      </div>

      {/* Floating Glass Info Card - Always visible logic adjusted for mobile */}
      <div className="absolute bottom-4 left-4 right-4 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] translate-y-0 transition-transform duration-500 group-hover:translate-y-0 will-change-transform">
         <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
              {member.name}
            </h3>
            <h4 className="text-indigo-300 font-mono text-xs uppercase tracking-wider font-medium">
              {member.role}
            </h4>
         </div>

         {/* Divider & Socials (Always visible on mobile to prevent tap issues) */}
         <div className="grid grid-rows-[1fr] lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
            <div className="overflow-hidden">
               <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-3">
                  {member.social?.linkedin && (
                    <a 
                      href={member.social.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-white transition-colors"
                      aria-label={`Perfil de LinkedIn de ${member.name}`}
                      title={`Perfil de LinkedIn de ${member.name}`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.social?.twitter && (
                    <a 
                      href={member.social.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title={`Perfil de X (Twitter) de ${member.name}`}
                      className="text-neutral-400 hover:text-white transition-colors"
                      aria-label={`Perfil de X (Twitter) de ${member.name}`}
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
};
