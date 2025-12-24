"use client";

import React, { useMemo, useState } from "react";
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
  allowedAddonIds?: string[];
  allowedAddons?: PricingAddon[];
  buttonText?: string;
  buttonLinkID: string;
}

interface PricingAddon {
  id: string;
  title: string;
  price: string;
  period?: string;
  description?: string;
}

interface PricingWizardProps {
  plans: PricingPlan[];
  initialPlanId?: string;
  initialLocation?: string;
}

type Step = 1 | 2 | 3 | 4 | 5;

export function PricingWizard({ plans, initialPlanId, initialLocation }: PricingWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId || "");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [location, setLocation] = useState<string>(initialLocation || "");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPlan = useMemo(() => plans.find((p) => p.buttonLinkID === selectedPlanId), [plans, selectedPlanId]);

  const visibleAddons = useMemo(() => {
    return Array.isArray(selectedPlan?.allowedAddons) ? selectedPlan.allowedAddons : [];
  }, [selectedPlan?.allowedAddons]);

  React.useEffect(() => {
    const allowedSet = new Set(visibleAddons.map((a) => a.id));
    setSelectedAddons((prev) => prev.filter((id) => allowedSet.has(id)));
  }, [visibleAddons]);

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

  const stepContent =
    step === 1 ? (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Selecciona tu Plan Base</h2>
          <p className="text-neutral-400 mt-3">Elige la estructura que mejor se adapte a tu proyecto.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.buttonLinkID;
            return (
              <button
                key={plan.buttonLinkID}
                type="button"
                onClick={() => setSelectedPlanId(plan.buttonLinkID)}
                className={cn(
                  "text-left relative rounded-3xl border p-6 md:p-7 transition-all duration-300 bg-neutral-900/10 hover:bg-neutral-900/20",
                  "hover:-translate-y-1 hover:shadow-[0_40px_80px_-50px_rgba(0,0,0,0.8)]",
                  isSelected ? "border-indigo-500/50 shadow-[0_0_30px_-10px_rgba(99,102,241,0.45)]" : "border-white/10"
                )}
              >
                <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-b from-white/5 to-transparent opacity-60" />

                {plan.badge && (
                  <span className="absolute -top-3 left-6 inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-indigo-400 text-black shadow">
                    {plan.badge}
                  </span>
                )}

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold text-white">{plan.title}</h3>
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-7 h-7 rounded-full border",
                        isSelected ? "bg-indigo-500 border-indigo-400 text-white" : "border-white/15 text-transparent"
                      )}
                    >
                      <Check className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                    {plan.period && <span className="text-sm text-neutral-500">{plan.period}</span>}
                  </div>

                  {plan.description && <p className="mt-4 text-sm text-neutral-400 leading-relaxed min-h-[40px]">{plan.description}</p>}

                  {plan.features && plan.features.length > 0 && (
                    <ul className="mt-6 space-y-2">
                      {plan.features.slice(0, 4).map((feature, i) => (
                        <li key={`${plan.buttonLinkID}-${i}`} className="flex items-start gap-2 text-sm text-neutral-300">
                          <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div
                    className={cn(
                      "mt-7 w-full py-2.5 rounded-xl text-center text-sm font-medium transition-colors",
                      isSelected ? "bg-indigo-500 text-white" : "bg-white/5 text-neutral-400"
                    )}
                  >
                    {isSelected ? "Seleccionado" : "Elegir"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    ) : step === 2 ? (
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Potencia tu Plan</h2>
          <p className="text-neutral-400 mt-3">Servicios adicionales para maximizar resultados.</p>
        </div>

        <div className="space-y-3">
          {visibleAddons.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-neutral-900/10 p-6 text-center text-sm text-neutral-400">
              No hay add-ons disponibles para este plan.
            </div>
          ) : (
            visibleAddons.map((addon) => {
            const active = selectedAddons.includes(addon.id);
            const priceLabel =
              addon.period && typeof addon.price === "string" && !addon.price.includes("/")
                ? `${addon.price} ${addon.period}`
                : addon.price;
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => toggleAddon(addon.id)}
                className={cn(
                  "w-full text-left rounded-2xl border p-5 md:p-6 transition-all duration-300",
                  active
                    ? "bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_25px_-15px_rgba(99,102,241,0.55)]"
                    : "bg-neutral-900/10 border-white/10 hover:bg-neutral-900/20"
                )}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "mt-1 w-6 h-6 rounded-md border flex items-center justify-center transition-colors",
                        active ? "bg-indigo-500 border-indigo-500" : "border-neutral-700 bg-neutral-950"
                      )}
                    >
                      {active && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{addon.title}</h3>
                      {addon.description && <p className="text-sm text-neutral-400 mt-1">{addon.description}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-sm font-semibold text-indigo-200 border border-white/10">
                      {priceLabel}
                    </span>
                  </div>
                </div>
              </button>
            );
            })
          )}
        </div>
      </div>
    ) : step === 3 ? (
      <div className="space-y-8 max-w-xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">¿Dónde quieres posicionarte?</h2>
          <p className="text-neutral-400 mt-3">Define tu área de actuación principal.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-neutral-900/10 p-6 md:p-8 shadow-2xl">
          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-300">Ciudad o Región Principal</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Madrid, Getafe, Toda España..."
                className="pl-12 h-12 md:h-14 rounded-2xl bg-neutral-950/60 border-white/10 text-white"
              />
            </div>
            <p className="text-xs text-neutral-500">Analizaremos la competencia en esta zona para preparar tu estrategia.</p>

            <div className="mt-6 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex gap-3">
              <Globe className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-200 leading-relaxed">
                Incluye análisis de palabras clave locales y configuración de Google Business Profile para {location || "tu zona"}.
              </p>
            </div>
          </div>
        </div>
      </div>
    ) : step === 4 ? (
      <div className="space-y-8 max-w-xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Finalizar Solicitud</h2>
          <p className="text-neutral-400 mt-3">Déjanos tus datos para enviarte la propuesta formal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-neutral-400">Nombre</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="h-12 rounded-2xl bg-neutral-950/60 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-400">Teléfono</label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="h-12 rounded-2xl bg-neutral-950/60 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Email Profesional</label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="h-12 rounded-2xl bg-neutral-950/60 border-white/10 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Detalles del Proyecto (Opcional)</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              className="min-h-[120px] rounded-2xl bg-neutral-950/60 border-white/10 text-white"
              placeholder="Cuéntanos un poco más sobre tu negocio..."
            />
          </div>

          <div className="pt-2">
            <div className="rounded-2xl p-5 text-sm text-neutral-400 border border-white/10 bg-neutral-900/10">
              <h4 className="font-semibold text-white mb-3">Resumen</h4>
              <ul className="space-y-2">
                <li className="flex justify-between gap-4">
                  <span className="text-neutral-500">Plan Base</span>
                  <span className="text-white text-right">{selectedPlan?.title || "—"}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-neutral-500">Ubicación</span>
                  <span className="text-white text-right">{location || "—"}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-neutral-500">Extras</span>
                  <span className="text-white text-right">{selectedAddons.length || 0}</span>
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 w-full h-12 rounded-2xl bg-white text-black hover:bg-neutral-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Procesando...
                </>
              ) : (
                "Solicitar Propuesta y Consultoría Gratis"
              )}
            </Button>
            {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
          </div>
        </form>
      </div>
    ) : (
      <div className="text-center py-14 max-w-lg mx-auto">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
          <Check className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">¡Solicitud Recibida!</h2>
        <p className="text-neutral-400 text-lg leading-relaxed">
          Hemos recibido los detalles de tu proyecto en <strong>{location}</strong>. Un especialista te contactará en menos de 24 horas.
        </p>
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
          className="mt-8 border-white/10 text-white hover:bg-white/5"
        >
          Volver al Inicio
        </Button>
      </div>
    );

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-1 md:px-4">
        <div className="grid grid-cols-4 gap-2 md:gap-3 mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 rounded-full border",
                step >= s ? "bg-indigo-500/80 border-indigo-400/40" : "bg-white/5 border-white/10"
              )}
            />
          ))}
        </div>
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
            {stepContent}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons (Outside Steps 1 & 5) */}
      {step < 4 && step > 0 && (
        <div className="mt-12 flex justify-between max-w-4xl mx-auto px-4 border-t border-white/10 pt-8">
          {step > 1 ? (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-neutral-300 hover:text-white hover:bg-white/5 rounded-2xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
            </Button>
          ) : (
            <div />
          )}

          <Button
            onClick={handleNext}
            disabled={(step === 1 && !selectedPlanId) || (step === 3 && !location)}
            className="bg-white text-black hover:bg-neutral-200 rounded-2xl"
          >
            Continuar <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
