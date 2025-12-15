"use client";
import React from "react";
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
    <div className="flex flex-wrap items-center justify-center gap-8 w-full">
      {team.map((member, idx) => (
        <div key={idx} className="group relative w-full max-w-sm bg-neutral-900/50 border border-white/10 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20">
             <div className="aspect-[3/4] relative overflow-hidden">
                <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-90" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white font-serif mb-2">{member.name}</h3>
                    <p className="text-indigo-400 font-medium text-sm tracking-widest uppercase mb-6 border-l-2 border-indigo-500 pl-3">{member.role}</p>
                    
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                        {member.social?.linkedin && (
                            <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/20 text-neutral-400 hover:text-white transition-colors backdrop-blur-md">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        )}
                        {member.social?.twitter && (
                            <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/20 text-neutral-400 hover:text-white transition-colors backdrop-blur-md">
                                <Twitter className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>
             </div>
        </div>
      ))}
    </div>
  );
};
