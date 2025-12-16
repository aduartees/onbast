"use client";

import React from "react";
import { Mail, Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContactInfo {
  email?: string;
  phone?: string;
  schedule?: string;
  location?: string;
  socialProfiles?: string[];
}

export function InfoCards({ info }: { info?: ContactInfo }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {/* Email Card - Large */}
      <motion.a
        href={`mailto:${info?.email || "hola@onbast.com"}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="group relative col-span-1 md:col-span-2 p-8 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 transition-all duration-500 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <p className="text-indigo-300 font-medium mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                </p>
                <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight">{info?.email || "hola@onbast.com"}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-45 transition-transform duration-500">
                <ArrowUpRight className="w-6 h-6" />
            </div>
        </div>
      </motion.a>

      {/* Phone Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-8 rounded-[2rem] bg-neutral-900/30 border border-white/5 hover:border-white/10 transition-colors"
      >
        <p className="text-neutral-400 font-medium mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4" /> Teléfono
        </p>
        <p className="text-xl text-white font-medium">{info?.phone || "+34 900 000 000"}</p>
        <p className="text-sm text-neutral-500 mt-2">{info?.schedule || "Lunes a Viernes, 9h - 18h"}</p>
      </motion.div>

      {/* Location Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-8 rounded-[2rem] bg-neutral-900/30 border border-white/5 hover:border-white/10 transition-colors"
      >
        <p className="text-neutral-400 font-medium mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Ubicación
        </p>
        <p className="text-xl text-white font-medium">{info?.location || "Madrid, España"}</p>
        <div className="mt-4 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-500 font-medium">Oficinas Abiertas</span>
        </div>
      </motion.div>

      {/* Socials Card - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="col-span-1 md:col-span-2 p-8 rounded-[2rem] bg-gradient-to-br from-neutral-900/50 to-neutral-900/10 border border-white/5"
      >
         <p className="text-neutral-400 font-medium mb-6">Síguenos</p>
         <div className="flex flex-wrap gap-4">
            {info?.socialProfiles?.map((social, i) => (
                <a 
                    key={i} 
                    href={social} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white text-sm font-medium transition-all hover:-translate-y-1"
                >
                    {social.replace('https://', '').split('/')[0]}
                </a>
            )) || (
                <>
                    <span className="px-6 py-3 rounded-full bg-white/5 text-neutral-500 text-sm">LinkedIn</span>
                    <span className="px-6 py-3 rounded-full bg-white/5 text-neutral-500 text-sm">Twitter</span>
                    <span className="px-6 py-3 rounded-full bg-white/5 text-neutral-500 text-sm">Instagram</span>
                </>
            )}
         </div>
      </motion.div>
    </div>
  );
}
