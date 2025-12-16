"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  url: string;
  submenu?: {
    label: string;
    url: string;
    description?: string;
  }[];
}

interface MobileNavProps {
  menuItems?: MenuItem[];
  cta?: {
    text: string;
    url: string;
  };
}

export function MobileNav({ menuItems = [], cta }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);

  // Fallback items if none provided
  const items = menuItems.length > 0 ? menuItems : [
    { label: "Servicios", url: "#services" },
    { label: "Proyectos", url: "#projects" },
    { label: "Agencia", url: "#about" },
  ];

  const ctaButton = cta || { text: "Contacto", url: "#contact" };

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const toggleSubmenu = (index: number) => {
    setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
    },
  };

  const listVariants = {
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
    open: {
      transition: { delayChildren: 0.3, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: 30 },
    open: { opacity: 1, y: 0 },
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
              variants={menuVariants}
              className="fixed inset-0 bg-neutral-950/20 backdrop-blur-xl z-[9999] flex flex-col pt-24 pb-8 px-6 overflow-y-auto"
            >
               {/* Close Button inside Portal */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Cerrar menú"
                className="absolute top-6 right-6 text-white hover:bg-white/10 z-50 rounded-full w-12 h-12"
              >
                <X className="w-6 h-6" />
              </Button>

               {/* Background Gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-neutral-950/20 to-neutral-950/20 pointer-events-none" />
              
              <motion.ul variants={listVariants} className="flex flex-col gap-6 w-full max-w-md mx-auto relative z-10">
                {items.map((item, index) => (
                  <motion.li key={index} variants={itemVariants} className="w-full">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={item.url}
                          onClick={() => !item.submenu && toggleMenu()}
                          className="text-3xl font-bold text-white hover:text-neutral-400 transition-colors tracking-tight text-center"
                        >
                          {item.label}
                        </Link>
                        {item.submenu && item.submenu.length > 0 && (
                          <button 
                            onClick={() => toggleSubmenu(index)}
                            className="p-2 text-white/50 hover:text-white transition-colors"
                          >
                            <ChevronDown className={cn("w-6 h-6 transition-transform duration-300", openSubmenuIndex === index ? "rotate-180" : "")} />
                          </button>
                        )}
                      </div>

                      {/* Mobile Submenu */}
                      <AnimatePresence>
                        {item.submenu && item.submenu.length > 0 && openSubmenuIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden w-full"
                          >
                            <div className="flex flex-col gap-4 pt-4 mt-2 items-center">
                              {item.submenu.map((subItem, subIdx) => (
                                <Link
                                  key={subIdx}
                                  href={subItem.url}
                                  onClick={toggleMenu}
                                  className="text-lg text-neutral-400 hover:text-white transition-colors flex flex-col items-center text-center"
                                >
                                  <span className="font-medium text-indigo-300">{subItem.label}</span>
                                  {subItem.description && (
                                    <span className="text-xs text-neutral-500 mt-0.5">{subItem.description}</span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.li>
                ))}
                
                <motion.li variants={itemVariants} className="mt-8 w-full">
                   <Link href={ctaButton.url} onClick={toggleMenu} className="block w-full">
                      <Button size="lg" className="w-full bg-white text-black hover:bg-neutral-200 text-lg py-6 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
                          {ctaButton.text} <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                   </Link>
                </motion.li>
              </motion.ul>

              <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.6 } }}
                  className="mt-auto pt-8 text-center text-neutral-400 text-sm font-medium z-20 relative"
              >
                  © 2024 ONBAST Agency.
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}