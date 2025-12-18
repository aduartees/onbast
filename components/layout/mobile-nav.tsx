"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { ArrowUpRight, Instagram, Linkedin, Twitter, Github, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface MenuItem {
  label: string;
  url: string;
  submenu?: {
    label: string;
    url: string;
    description?: string;
  }[];
}

interface SocialLink {
    platform: string;
    url: string;
}

interface MobileNavProps {
  menuItems?: MenuItem[];
  cta?: {
    text: string;
    url: string;
  };
  socialLinks?: SocialLink[];
  agencyEmail?: string;
  agencyPhone?: string;
  agencyWhatsapp?: string;
}

export function MobileNav({ menuItems = [], cta, socialLinks, agencyEmail, agencyPhone, agencyWhatsapp }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Fallback items if none provided
  const items = menuItems.length > 0 ? menuItems : [
    { label: "Servicios", url: "/servicios" },
    { label: "Proyectos", url: "/proyectos" },
    { label: "Agencia", url: "/agencia" },
  ];

  const ctaButton = cta || { text: "Contacto", url: "/contacto" };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLinkClick = (url: string) => {
    if (url.startsWith("#")) {
        setIsOpen(false);
    }
  };

  const getSocialIcon = (platform: string) => {
      switch (platform.toLowerCase()) {
        case 'twitter': return <Twitter className="w-5 h-5" />;
        case 'linkedin': return <Linkedin className="w-5 h-5" />;
        case 'github': return <Github className="w-5 h-5" />;
        case 'instagram': return <Instagram className="w-5 h-5" />;
        default: return <ArrowUpRight className="w-5 h-5" />;
      }
  };

  if (!mounted) return null;

  return (
    <div className="md:hidden">
      {/* Animated Hamburger Button - Portalled to body to escape Navbar stacking context */}
      {createPortal(
        <div className="md:hidden">
            <MotionConfig transition={{ duration: 0.3, ease: "easeInOut" }}>
                <motion.button
                initial={false}
                animate={isOpen ? "open" : "closed"}
                onClick={toggleMenu}
                className="fixed right-6 top-5 z-[10000] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center gap-1.5 hover:bg-white/20 transition-colors will-change-transform"
                aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
                <motion.span 
                    style={{ left: "50%", top: "35%", x: "-50%", y: "-50%" }}
                    className="absolute w-6 h-0.5 bg-white will-change-transform"
                    variants={{
                        open: { rotate: 45, top: "50%" },
                        closed: { rotate: 0, top: "35%" }
                    }}
                />
                <motion.span 
                    style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
                    className="absolute w-6 h-0.5 bg-white will-change-opacity"
                    variants={{
                        open: { opacity: 0 },
                        closed: { opacity: 1 }
                    }}
                />
                <motion.span 
                    style={{ left: "50%", bottom: "35%", x: "-50%", y: "50%" }}
                    className="absolute w-6 h-0.5 bg-white will-change-transform"
                    variants={{
                        open: { rotate: -45, bottom: "50%" },
                        closed: { rotate: 0, bottom: "35%" }
                    }}
                />
            </motion.button>
        </MotionConfig>
        </div>,
        document.body
      )}

      {createPortal(
        <div className="md:hidden">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[9999] bg-neutral-950 text-white flex flex-col"
            >
                {/* Background Aesthetics - Static, no blur for performance */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-900/20 rounded-full blur-[80px] pointer-events-none transform-gpu" />

                {/* Content Container - Padded to match header height roughly */}
                <div className="flex-1 flex flex-col justify-center px-6 pt-24 pb-12 h-full relative z-10 overflow-y-auto">
                    
                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2 mt-auto mb-auto">
                        {items.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                            >
                                <Link 
                                    href={item.url}
                                    onClick={() => handleLinkClick(item.url)}
                                    className="group flex items-center justify-between py-3"
                                >
                                    <span className="text-4xl font-medium tracking-tighter text-white/90 active:text-white active:scale-95 transition-all duration-200">
                                        {item.label}
                                    </span>
                                </Link>
                                <div className="h-px w-full bg-white/5" />
                            </motion.div>
                        ))}
                    </nav>

                    {/* Footer / Socials */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="mt-auto flex flex-col gap-8"
                    >
                        <div className="flex items-center gap-4">
                            <Link href={ctaButton.url} onClick={() => setIsOpen(false)} className="flex-1">
                                <Button className="w-full h-14 bg-white text-black hover:bg-neutral-200 rounded-full text-lg font-medium">
                                    {ctaButton.text}
                                </Button>
                            </Link>
                            <a 
                                href={agencyWhatsapp ? (agencyWhatsapp.startsWith('http') ? agencyWhatsapp : `https://wa.me/${agencyWhatsapp.replace(/[^0-9]/g, '')}`) : "https://wa.me/34600000000"} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
                            >
                                <MessageCircle className="w-6 h-6" />
                            </a>
                        </div>

                        <div className="flex justify-between items-end border-t border-white/10 pt-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-neutral-500 text-xs uppercase tracking-wider">Social</span>
                                <div className="flex gap-4 mt-2">
                                    {socialLinks?.map((link, i) => (
                                        <a key={i} href={link.url} target="_blank" className="text-white hover:text-indigo-400 transition-colors">
                                            {getSocialIcon(link.platform)}
                                        </a>
                                    ))}
                                    {!socialLinks && (
                                        <>
                                            <Instagram className="w-5 h-5 text-neutral-400" />
                                            <Linkedin className="w-5 h-5 text-neutral-400" />
                                        </>
                                    )}
                                </div>
                            </div>
                            <span className="text-neutral-600 text-xs">© {currentYear} ONBAST</span>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>,
        document.body
      )}
    </div>
  );
}
