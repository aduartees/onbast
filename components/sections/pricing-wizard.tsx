"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Loader2, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submitPlanRequest } from "@/app/actions/submit-plan";

interface PricingPlan {
  title: string;
  price: string;
  currency: string;
  period?: string;
  badge?: string;
  description?: string;
  features?: string[];
  addon?: {
    title: string;
    price: string;
    active?: boolean;
  };
  buttonText?: string;
  buttonLinkID: string;
}

interface PricingAddon {
  id: string;
  title: string;
  price: string;
  description?: string;
}

interface PricingWizardProps {
  plans: PricingPlan[];
  addons: PricingAddon[];
  initialPlanId?: string;
  initialLocation?: string;
}

type Step = 1 | 2 | 3 | 4 | 5;

export function PricingWizard({ plans, addons, initialPlanId, initialLocation }: PricingWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId || "");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [location, setLocation] = useState<string>(initialLocation || "");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPlan = plans.find(p => p.buttonLinkID === selectedPlanId);

  const handleNext = () => {
    if (step === 1 && !selectedPlanId) return;
    if (step === 3 && !location) return; // Require location
    setStep(prev => Math.min(prev + 1, 4) as Step);
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1) as Step);
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitPlanRequest({
        plan: selectedPlan!,
        addons: selectedAddons, // In a real app we'd map these to actual addon objects
        location,
        contact: formData
      });

      if (result.success) {
        setStep(5);
      } else {
        setError(result.error || "Hubo un error al enviar tu solicitud.");
      }
    } catch (err) {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- STEPS ---

  const Step1Plans = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Selecciona tu Plan Base</h2>
        <p className="text-neutral-400">Elige la estructura que mejor se adapte a tu proyecto.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div 
            key={plan.buttonLinkID}
            onClick={() => setSelectedPlanId(plan.buttonLinkID)}
            className={cn(
              "cursor-pointer relative p-6 rounded-2xl border transition-all duration-300",
              selectedPlanId === plan.buttonLinkID 
                ? "bg-indigo-900/20 border-indigo-500 shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]" 
                : "bg-neutral-900/10 border-white/10 hover:bg-neutral-900/30 hover:border-white/20"
            )}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-6 px-3 py-1 text-xs font-bold text-black bg-indigo-400 rounded-full">
                {plan.badge}
              </span>
            )}
            <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-white">{plan.price}</span>
              {plan.period && <span className="text-neutral-400 text-sm ml-1">{plan.period}</span>}
            </div>
            <p className="text-sm text-neutral-400 mb-6 min-h-[40px]">{plan.description}</p>
            <ul className="space-y-2 mb-6">
              {plan.features?.slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                  <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className={cn(
              "w-full py-2 rounded-lg text-center text-sm font-medium transition-colors",
              selectedPlanId === plan.buttonLinkID ? "bg-indigo-500 text-white" : "bg-white/5 text-neutral-400"
            )}>
              {selectedPlanId === plan.buttonLinkID ? "Seleccionado" : "Elegir"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Step2Addons = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Potencia tu Plan</h2>
        <p className="text-neutral-400">Servicios adicionales para maximizar resultados.</p>
      </div>
      
      {addons.map((addon) => (
        <div 
          key={addon.id}
          onClick={() => toggleAddon(addon.id)}
          className={cn(
            "cursor-pointer flex items-center justify-between p-4 md:p-6 rounded-xl border transition-all duration-300",
            selectedAddons.includes(addon.id)
              ? "bg-indigo-900/10 border-indigo-500/50" 
              : "bg-neutral-900/10 border-white/5 hover:bg-neutral-900/20"
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-6 h-6 rounded border flex items-center justify-center mt-1 transition-colors",
              selectedAddons.includes(addon.id) ? "bg-indigo-500 border-indigo-500" : "border-neutral-600"
            )}>
              {selectedAddons.includes(addon.id) && <Check className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h3 className="font-bold text-white">{addon.title}</h3>
              <p className="text-sm text-neutral-400">{addon.description}</p>
            </div>
          </div>
          <div className="text-right pl-4">
            <span className="block font-bold text-indigo-400">{addon.price}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const Step3Location = () => (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">¿Dónde quieres posicionarte?</h2>
        <p className="text-neutral-400">Define tu área de actuación principal.</p>
      </div>

      <div className="bg-neutral-900/30 border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Ciudad o Región Principal</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
              <Input 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Madrid, Getafe, Toda España..."
                className="pl-10 bg-neutral-950 border-white/10 text-white h-12"
              />
            </div>
            <p className="text-xs text-neutral-500">
              Analizaremos la competencia en esta zona para preparar tu estrategia.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex gap-3">
            <Globe className="w-5 h-5 text-indigo-400 shrink-0" />
            <p className="text-sm text-indigo-200">
              Incluye análisis de palabras clave locales y configuración de Google My Business para {location || "tu zona"}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const Step4Contact = () => (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Finalizar Solicitud</h2>
        <p className="text-neutral-400">Déjanos tus datos para enviarte la propuesta formal.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Nombre</label>
            <Input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-neutral-950 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Teléfono</label>
            <Input 
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="bg-neutral-950 border-white/10 text-white"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Email Profesional</label>
          <Input 
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="bg-neutral-950 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Detalles del Proyecto (Opcional)</label>
          <Textarea 
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="bg-neutral-950 border-white/10 text-white min-h-[100px]"
            placeholder="Cuéntanos un poco más sobre tu negocio..."
          />
        </div>

        <div className="pt-4">
          <div className="bg-neutral-900/50 rounded-lg p-4 mb-6 text-sm text-neutral-400 border border-white/5">
            <h4 className="font-bold text-white mb-2">Resumen:</h4>
            <ul className="space-y-1">
              <li className="flex justify-between">
                <span>Plan Base:</span>
                <span className="text-white">{selectedPlan?.title}</span>
              </li>
              <li className="flex justify-between">
                <span>Ubicación:</span>
                <span className="text-white">{location}</span>
              </li>
              {selectedAddons.length > 0 && (
                <li className="flex justify-between">
                  <span>Extras:</span>
                  <span className="text-white">{selectedAddons.length} seleccionados</span>
                </li>
              )}
            </ul>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-12 text-base bg-white text-black hover:bg-neutral-200"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Procesando...</>
            ) : (
              "Solicitar Propuesta y Consultoría Gratis"
            )}
          </Button>
          {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
        </div>
      </form>
    </div>
  );

  const Step5Success = () => (
    <div className="text-center py-12 max-w-lg mx-auto">
      <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">¡Solicitud Recibida!</h2>
      <p className="text-neutral-400 text-lg mb-8">
        Hemos recibido los detalles de tu proyecto en <strong>{location}</strong>. 
        Un especialista analizará tu caso y te contactará en menos de 24 horas.
      </p>
      <Button 
        onClick={() => window.location.href = "/"}
        variant="outline"
        className="border-white/10 text-white hover:bg-white/5"
      >
        Volver al Inicio
      </Button>
    </div>
  );

  // --- RENDER ---

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="flex justify-between mb-8 md:mb-12 px-4 max-w-3xl mx-auto relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-800 -z-10 -translate-y-1/2" />
        {[1, 2, 3, 4].map((s) => (
          <div 
            key={s}
            className={cn(
              "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500",
              step >= s ? "bg-indigo-600 text-white scale-110" : "bg-neutral-900 text-neutral-600 border border-neutral-800"
            )}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && <Step1Plans />}
            {step === 2 && <Step2Addons />}
            {step === 3 && <Step3Location />}
            {step === 4 && <Step4Contact />}
            {step === 5 && <Step5Success />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons (Outside Steps 1 & 5) */}
      {step < 4 && step > 0 && (
        <div className="mt-12 flex justify-between max-w-4xl mx-auto px-4 border-t border-white/5 pt-8">
           {step > 1 ? (
             <Button 
                variant="ghost" 
                onClick={handleBack}
                className="text-neutral-400 hover:text-white hover:bg-white/5"
             >
               <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
             </Button>
           ) : <div />}
           
           <Button 
             onClick={handleNext}
             disabled={step === 1 && !selectedPlanId || step === 3 && !location}
             className="bg-white text-black hover:bg-neutral-200"
           >
             Continuar <ArrowRight className="w-4 h-4 ml-2" />
           </Button>
        </div>
      )}
    </div>
  );
}
