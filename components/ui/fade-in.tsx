"use client";
import { motion } from "framer-motion";
import React from "react";

export const FadeIn = ({ children, className, delay = 0, noVertical = false }: { children: React.ReactNode, className?: string, delay?: number, noVertical?: boolean }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={{
      hidden: { opacity: 0, y: noVertical ? 0 : 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: "easeOut" } }
    }}
    className={className}
  >
    {children}
  </motion.div>
);
