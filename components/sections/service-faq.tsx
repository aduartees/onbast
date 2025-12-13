"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
  return (
    <div className="border-b border-neutral-800 last:border-none">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none group"
      >
        <span className={cn(
            "text-lg font-medium transition-colors duration-300",
            isOpen ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"
        )}>
          {question}
        </span>
        <div className={cn(
            "relative flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 transition-all duration-300",
            isOpen ? "bg-white border-white rotate-90" : "bg-transparent group-hover:border-neutral-500"
        )}>
            <Plus className={cn("h-4 w-4 transition-all duration-300 absolute", isOpen ? "opacity-0 rotate-90 text-black" : "opacity-100 text-neutral-400")} />
            <Minus className={cn("h-4 w-4 transition-all duration-300 absolute", isOpen ? "opacity-100 rotate-0 text-black" : "opacity-0 -rotate-90")} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-neutral-400 leading-relaxed text-base md:text-lg">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function ServiceFAQ({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
