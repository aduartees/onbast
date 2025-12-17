"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavbarProps {
  data?: {
    agency?: {
      logo?: string;
    };
    header?: {
      logoText?: string;
      menuItems?: {
        label: string;
        url: string;
        submenu?: {
          label: string;
          url: string;
          description?: string;
        }[];
      }[];
      ctaButton?: {
        text: string;
        url: string;
      };
    };
    footer?: {
      copyrightText?: string;
    };
  };
}

export function Navbar({ data }: NavbarProps) {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Don't show navbar in Sanity Studio
  if (pathname?.startsWith("/studio")) {
    return null;
  }

  const { header, agency, footer } = data || {};
  const menuItems = header?.menuItems || [
    { label: "Servicios", url: "/servicios" },
    { label: "Proyectos", url: "/proyectos" },
    { label: "Agencia", url: "/agencia" },
  ];

  const logoText = header?.logoText || "onbast.";
  const ctaText = header?.ctaButton?.text || "Contacto";
  const ctaUrl = header?.ctaButton?.url || "/contacto";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-neutral-950/80 border-b border-white/5 supports-[backdrop-filter]:bg-neutral-950/50">
      <div className="flex items-center gap-2 relative z-50">
        <Link href="/" title="Volver al inicio" className="text-2xl font-bold tracking-tighter text-white font-inter hover:opacity-80 transition-opacity flex items-center gap-2">
           {agency?.logo ? (
              <Image src={agency.logo} alt="Logo" title="Logo" width={32} height={32} className="w-8 h-8 object-contain" />
           ) : null}
           <span>{logoText}</span>
        </Link>
      </div>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 ml-auto" onMouseLeave={() => setHoveredIndex(null)}>
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
          >
            <Link 
              href={item.url} 
              title={item.label}
              className="flex items-center gap-1 text-sm font-medium text-neutral-300 hover:text-white transition-colors py-2"
            >
              {item.label}
              {item.submenu && item.submenu.length > 0 && (
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${hoveredIndex === index ? "rotate-180" : ""}`} />
              )}
            </Link>

            {/* Submenu Dropdown */}
            <AnimatePresence>
              {item.submenu && item.submenu.length > 0 && hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[300px]"
                >
                  <div className="bg-neutral-900 border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl overflow-hidden ring-1 ring-white/5">
                     <div className="flex flex-col gap-1">
                        {item.submenu.map((subItem, subIdx) => (
                           <Link 
                             key={subIdx}
                             href={subItem.url}
                             title={subItem.label}
                             className="group block p-3 rounded-xl hover:bg-white/5 transition-colors"
                           >
                              <span className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                                {subItem.label}
                              </span>
                              {subItem.description && (
                                <span className="text-xs text-neutral-500 mt-1 line-clamp-2">
                                  {subItem.description}
                                </span>
                              )}
                           </Link>
                        ))}
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        <Link href={ctaUrl} title={ctaText}>
          <Button variant="secondary" className="bg-white text-black hover:bg-neutral-200 rounded-full px-6 shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
            {ctaText}
          </Button>
        </Link>
      </div>

      {/* Mobile Menu */}
      <MobileNav menuItems={menuItems} cta={{ text: ctaText, url: ctaUrl }} />
    </nav>
  )
}
