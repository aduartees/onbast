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

export function ContactForm({ email }: { email?: string }) {
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check for success param in URL (native form submission return)
  // Removed URL check since we are using AJAX
  /* if (typeof window !== "undefined" && window.location.search.includes("success=true") && !success) {
    setSuccess(true);
  } */

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

  // NOTE: Switched to AJAX Form Submission to prevent reload loops and ensure data serialization
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
        _captcha: "false",
        _honey: "" // Field for bot protection (should be empty)
      };

      // 4. AJAX Submission to FormSubmit
      const response = await fetch("https://formsubmit.co/ajax/c1188bf4882d9992df32e82aa16ecb3c", {
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
      setError(`Error al enviar. Por favor intenta de nuevo o escríbenos directamente a ${email || "info@onbast.com"}`);
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-neutral-900/50 border border-white/10 rounded-2xl backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje Enviado!</h3>
        <p className="text-neutral-400 max-w-sm">
          Hemos recibido tu solicitud correctamente. Nos pondremos en contacto contigo lo antes posible.
        </p>
        <Button 
          variant="outline" 
          className="mt-8 border-white/10 text-white hover:bg-white/5"
          onClick={() => {
            setSuccess(false);
            // Clear URL param without refresh
            window.history.replaceState({}, document.title, window.location.pathname);
          }}
        >
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form 
      action="https://formsubmit.co/c1188bf4882d9992df32e82aa16ecb3c" 
      method="POST"
      onSubmit={handleSubmit}
      className="relative"
    >
      {/* Hidden Configuration Fields for FormSubmit */}
      <input type="hidden" name="_subject" value="Nuevo Mensaje de Contacto - ONBAST" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_next" value="https://onbast.com/contacto?success=true" />
      {/* Honeypot for FormSubmit internal check */}
      <input type="text" name="_honey" style={{display: 'none'}} />

      {/* Custom Honeypot for React state check */}
      <input 
        type="text" 
        name="confirmEmail" 
        value={formData.confirmEmail}
        onChange={handleChange}
        style={{ display: 'none' }} 
        tabIndex={-1} 
        autoComplete="off"
      />
      
      {/* Hidden input to sync 'topic' state to form submission */}
      <input type="hidden" name="topic" value={formData.topic || "General"} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField 
          label="Nombre" 
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

      <SelectTopic 
        name="topic" 
        value={formData.topic} 
        onChange={handleTopicChange}
        disabled={isPending}
      />

      <InputField 
        label="Cuéntanos sobre tu proyecto" 
        name="message" 
        textarea 
        required 
        value={formData.message}
        onChange={handleChange}
        disabled={isPending}
      />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        type="submit" 
        disabled={isPending}
        className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-lg shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 group"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            Enviar Mensaje
            <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
      
      <p className="mt-4 text-center text-xs text-neutral-500">
        Al enviar este formulario aceptas nuestra política de privacidad.
      </p>
    </form>
  );
}
