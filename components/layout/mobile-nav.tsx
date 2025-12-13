"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Servicios", href: "#services" },
  { title: "Proyectos", href: "#projects" },
  { title: "Agencia", href: "#about" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const listVariants = {
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        delayChildren: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      y: 50,
    },
    open: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="relative z-50 text-white hover:bg-white/10"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 bg-neutral-950 z-40 flex flex-col justify-center items-center p-8"
          >
             {/* Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-neutral-950 to-neutral-950 pointer-events-none" />
            
            <motion.ul variants={listVariants} className="flex flex-col gap-8 items-center relative z-10">
              {menuItems.map((item) => (
                <motion.li key={item.title} variants={itemVariants}>
                  <Link
                    href={item.href}
                    onClick={toggleMenu}
                    className="text-4xl font-bold text-white hover:text-neutral-400 transition-colors tracking-tighter"
                  >
                    {item.title}
                  </Link>
                </motion.li>
              ))}
              
              <motion.li variants={itemVariants} className="mt-8">
                 <Link href="#contact" onClick={toggleMenu}>
                    <Button size="lg" className="bg-white text-black hover:bg-neutral-200 text-lg px-8 py-6 rounded-full">
                        Contacto <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                 </Link>
              </motion.li>
            </motion.ul>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.8 } }}
                className="absolute bottom-10 left-0 right-0 text-center text-neutral-500 text-sm"
            >
                © 2024 ONBAST Agency.
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}