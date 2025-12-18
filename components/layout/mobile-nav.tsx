"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, ChevronDown, Instagram, Linkedin, Twitter, Github, MessageCircle } from "lucide-react";
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
}

export function MobileNav({ menuItems = [], cta, socialLinks, agencyEmail, agencyPhone }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);
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
      setOpenSubmenuIndex(null); // Reset submenu on close
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

  const toggleSubmenu = (index: number) => {
    setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
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

  // --- Animations ---
  const overlayVariants = {
      closed: { opacity: 0 },
      open: { opacity: 1, transition: { duration: 0.3 } }
  };

  const menuVariants = {
    closed: { 
        y: "100%",
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
    },
    open: { 
        y: "0%",
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
    }
  };

  const containerVariants = {
      closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
      open: { transition: { delayChildren: 0.3, staggerChildren: 0.1 } }
  };

  const itemVariants = {
      closed: { y: 100, opacity: 0, rotateX: -20 },
      open: { y: 0, opacity: 1, rotateX: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  
  const bottomVariants = {
      closed: { opacity: 0, y: 20 },
      open: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.5 } }
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        aria-label="Abrir menú"
        className="relative z-50 text-white hover:bg-white/10"
      >
        <Menu className="w-6 h-6" />
      </Button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed inset-0 z-[9999] flex flex-col justify-between bg-neutral-950 text-white overflow-hidden"
            >
                {/* Background Noise/Gradient */}
                <div className="absolute inset-0 pointer-events-none opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

                {/* Header */}
                <div className="relative z-20 flex items-center justify-between px-6 py-6 border-b border-white/5">
                    <span className="text-xl font-bold tracking-tighter">onbast.</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMenu}
                        aria-label="Cerrar menú"
                        className="rounded-full w-12 h-12 bg-white/5 hover:bg-white/10 text-white border border-white/5"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Main Navigation */}
                <div className="relative z-10 flex-1 flex flex-col justify-center px-6 overflow-y-auto">
                    <motion.ul variants={containerVariants} initial="closed" animate="open" exit="closed" className="flex flex-col gap-2">
                        {items.map((item, index) => (
                            <motion.li key={index} variants={itemVariants} className="overflow-hidden">
                                <div className="flex flex-col">
                                    <div className="flex items-center justify-between group">
                                        <Link 
                                            href={item.url} 
                                            onClick={() => !item.submenu && handleLinkClick(item.url)}
                                            className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 hover:to-indigo-400 transition-all duration-300 py-2 block w-full"
                                        >
                                            {item.label.toUpperCase()}
                                        </Link>
                                        
                                        {item.submenu && item.submenu.length > 0 && (
                                            <button 
                                                onClick={() => toggleSubmenu(index)}
                                                className="p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
                                            >
                                                <ChevronDown className={cn("w-6 h-6 transition-transform duration-300", openSubmenuIndex === index ? "rotate-180" : "")} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Submenu */}
                                    <AnimatePresence>
                                        {item.submenu && item.submenu.length > 0 && openSubmenuIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="flex flex-col gap-3 pl-2 pb-4 border-l-2 border-white/10 ml-2 mt-2">
                                                    {item.submenu.map((subItem, subIdx) => (
                                                        <Link
                                                            key={subIdx}
                                                            href={subItem.url}
                                                            onClick={() => handleLinkClick(subItem.url)}
                                                            className="text-lg font-medium text-neutral-400 hover:text-white transition-colors"
                                                        >
                                                            {subItem.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>

                {/* Footer Section */}
                <motion.div 
                    variants={bottomVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="relative z-20 p-6 bg-neutral-900/50 backdrop-blur-md border-t border-white/5 flex flex-col gap-6"
                >
                    {/* CTA & WhatsApp */}
                    <div className="grid grid-cols-2 gap-4">
                        <Link href={ctaButton.url} onClick={() => setIsOpen(false)} className="w-full">
                            <Button className="w-full bg-white text-black hover:bg-neutral-200 h-14 rounded-xl text-base font-bold shadow-lg shadow-white/5">
                                {ctaButton.text}
                            </Button>
                        </Link>
                        
                        <Link 
                            href="https://wa.me/34600000000" // TODO: Replace with real number or dynamic prop if available
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                        >
                            <Button variant="outline" className="w-full h-14 rounded-xl border-white/10 bg-white/5 hover:bg-green-500/20 hover:border-green-500/50 text-white hover:text-green-400 transition-all gap-2">
                                <MessageCircle className="w-5 h-5" />
                                <span>WhatsApp</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Socials & Copyright */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-3">
                            {socialLinks?.map((link, i) => (
                                <a 
                                    key={i} 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black transition-all duration-300"
                                >
                                    {getSocialIcon(link.platform)}
                                </a>
                            ))}
                            {!socialLinks && (
                                <>
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400">
                                        <Instagram className="w-5 h-5" />
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400">
                                        <Linkedin className="w-5 h-5" />
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div className="text-neutral-500 text-xs font-medium uppercase tracking-wider">
                            © {currentYear} ONBAST.
                        </div>
                    </div>
                </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
