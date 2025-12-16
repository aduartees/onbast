"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Send, AlertCircle } from "lucide-react";

const topics = [
  "Nuevo Proyecto",
  "Consultoría",
  "Carreras",
  "Prensa",
  "Otro",
];

// Simple sanitization to prevent basic injection
const sanitizeInput = (input: string) => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

const InputField = ({ 
  label, 
  name, 
  type = "text", 
  required,
  textarea = false,
  value,
  onChange,
  disabled,
  ...props 
}: { 
  label: string, 
  name: string, 
  type?: string, 
  required?: boolean,
  textarea?: boolean,
  value: string,
  onChange: (e: any) => void,
  disabled?: boolean,
  [key: string]: any 
}) => {
  const [focused, setFocused] = useState(false);

  const Component = textarea ? "textarea" : "input";

  return (
    <div className="relative mb-6 group">
      <label 
        htmlFor={name} 
        className={cn(
          "absolute left-0 transition-all duration-300 pointer-events-none text-neutral-500 font-medium",
          (focused || value) ? "-top-6 text-xs text-indigo-400" : "top-3 text-base"
        )}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Component
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={onChange}
        className={cn(
          "w-full bg-transparent border-b border-neutral-700 py-3 text-white placeholder-transparent focus:outline-none focus:border-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
          textarea ? "min-h-[100px] resize-none" : "h-12"
        )}
        {...props}
      />
      {/* Animated Bottom Line */}
      <div className={cn(
        "absolute bottom-0 left-0 h-[2px] bg-indigo-500 transition-all duration-500 ease-out",
        focused ? "w-full" : "w-0"
      )} />
    </div>
  );
};

const SelectTopic = ({ 
  name, 
  value, 
  onChange, 
  disabled 
}: { 
  name: string, 
  value: string, 
  onChange: (val: string) => void, 
  disabled?: boolean 
}) => {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-neutral-500 mb-3">¿De qué quieres hablar?</label>
      <div className="flex flex-wrap gap-3">
        {topics.map((topic) => (
          <button
            key={topic}
            type="button"
            disabled={disabled}
            onClick={() => onChange(topic)}
            className={cn(
              "px-4 py-2 rounded-full text-sm border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
              value === topic 
                ? "bg-indigo-500 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                : "bg-neutral-900/50 border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
            )}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export function ContactForm() {
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
    // Honeypot field (should remain empty)
    confirmEmail: "" 
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (topic: string) => {
    setFormData(prev => ({ ...prev, topic }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Security Check: Honeypot
    if (formData.confirmEmail) {
      // If the hidden field is filled, it's a bot. Fake success.
      setSuccess(true);
      return;
    }

    // 2. Validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }

    setIsPending(true);

    try {
      // 3. Sanitization
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        topic: sanitizeInput(formData.topic || "General"),
        message: sanitizeInput(formData.message),
        _subject: "Nuevo Mensaje de Contacto - ONBAST",
        _template: "table",
        _captcha: "false" // Or "true" if you want to force captcha challenge, but "false" is smoother for AJAX if not strict
      };

      // 4. AJAX Submission to FormSubmit
      const response = await fetch("https://formsubmit.co/ajax/info@aduarte.es", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(sanitizedData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", topic: "", message: "", confirmEmail: "" });
      } else {
        throw new Error(result.message || "Hubo un error al enviar el formulario.");
      }
    } catch (err) {
      setError("Error al enviar. Por favor intenta de nuevo o escríbenos directamente a info@aduarte.es");
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-neutral-900/20 border border-white/5 backdrop-blur-sm p-12 rounded-[2rem] h-full flex flex-col items-center justify-center text-center min-h-[400px]"
      >
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-3xl font-bold text-white mb-4">¡Mensaje Recibido!</h3>
        <p className="text-neutral-400 max-w-md mx-auto mb-8">
          Gracias por contactarnos. Hemos recibido tu mensaje correctamente y te responderemos en breve a <strong>{formData.email}</strong>.
        </p>
        <Button 
          onClick={() => setSuccess(false)}
          variant="outline"
          className="rounded-full border-white/10 text-white hover:bg-white/5"
        >
          Enviar otro mensaje
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      <form 
          onSubmit={handleSubmit}
          action="https://formsubmit.co/info@aduarte.es"
          method="POST"
          className="bg-neutral-900/20 border border-white/5 backdrop-blur-sm p-8 md:p-12 rounded-[2rem] h-full pt-16 relative overflow-hidden"
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField 
              label="Tu Nombre" 
              name="name" 
              required 
              value={formData.name}
              onChange={handleChange}
              disabled={isPending}
            />
            <InputField 
              label="Email Corporativo" 
              name="email" 
              type="email" 
              required 
              value={formData.email}
              onChange={handleChange}
              disabled={isPending}
            />
          </div>

          {/* Honeypot Field - Hidden visually but present in DOM */}
          <div className="opacity-0 absolute -z-10 h-0 w-0 overflow-hidden">
            <input 
              type="text" 
              name="confirmEmail" 
              tabIndex={-1} 
              autoComplete="off"
              value={formData.confirmEmail}
              onChange={handleChange}
            />
          </div>
          
          <SelectTopic 
            name="topic" 
            value={formData.topic}
            onChange={handleTopicChange}
            disabled={isPending}
          />
          
          <InputField 
            label="Cuéntanos sobre el proyecto" 
            name="message" 
            textarea 
            required 
            value={formData.message}
            onChange={handleChange}
            disabled={isPending}
          />
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-200 text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        <div className="mt-10 flex justify-end">
          <Button 
            type="submit" 
            disabled={isPending}
            size="lg"
            className="bg-white text-black hover:bg-neutral-200 rounded-full px-8 h-12 font-medium shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 w-full md:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : (
              <>
                Enviar Mensaje <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
