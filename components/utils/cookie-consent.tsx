"use client";

import { useEffect } from "react";
import CookieConsent from "vanilla-cookieconsent";

const updateGtagConsent = (cookie: CookieConsent.CookieValue | undefined) => {
  const categories = Array.isArray(cookie?.categories) ? cookie.categories : [];

  const granted = {
    analytics_storage: categories.includes("analytics") ? "granted" : "denied",
    ad_storage: categories.includes("marketing") ? "granted" : "denied",
    ad_user_data: categories.includes("marketing") ? "granted" : "denied",
    ad_personalization: categories.includes("marketing") ? "granted" : "denied",
  };

  const gtag = (window as unknown as { gtag?: (...args: any[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("consent", "update", granted);
  }
};

export const CookieConsentManager = () => {
  useEffect(() => {
    const w = window as unknown as { __onbastCookieConsentInited?: boolean };
    if (w.__onbastCookieConsentInited) return;
    w.__onbastCookieConsentInited = true;

    CookieConsent.run({
      cookie: {
        name: "onbast_cookie_consent",
        expiresAfterDays: 182,
        sameSite: "Lax",
      },
      guiOptions: {
        consentModal: {
          layout: "box",
          position: "bottom center",
          equalWeightButtons: true,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          position: "right",
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
          readOnly: false,
        },
        marketing: {
          enabled: false,
          readOnly: false,
        },
      },
      language: {
        default: "es",
        translations: {
          es: {
            consentModal: {
              title: "Cookies y privacidad",
              description:
                "Usamos cookies para mejorar la experiencia, medir rendimiento y, si lo aceptas, personalizar publicidad. Puedes aceptar, rechazar o configurar tus preferencias.",
              acceptAllBtn: "Aceptar todas",
              acceptNecessaryBtn: "Rechazar",
              showPreferencesBtn: "Configurar",
            },
            preferencesModal: {
              title: "Preferencias de cookies",
              acceptAllBtn: "Aceptar todas",
              acceptNecessaryBtn: "Rechazar",
              savePreferencesBtn: "Guardar preferencias",
              closeIconLabel: "Cerrar",
              serviceCounterLabel: "Servicio|Servicios",
              sections: [
                {
                  title: "Resumen",
                  description:
                    "Puedes activar o desactivar categorías. Las cookies necesarias siempre están activas para que la web funcione.",
                },
                {
                  title: "Necesarias",
                  description: "Imprescindibles para el funcionamiento del sitio.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Analítica",
                  description: "Nos ayudan a entender el uso del sitio (p. ej. Google Analytics).",
                  linkedCategory: "analytics",
                },
                {
                  title: "Marketing",
                  description: "Permiten medir y personalizar anuncios (p. ej. Google Ads).",
                  linkedCategory: "marketing",
                },
              ],
            },
          },
        },
      },
      onFirstConsent: ({ cookie }) => {
        updateGtagConsent(cookie);
      },
      onConsent: ({ cookie }) => {
        updateGtagConsent(cookie);
      },
      onChange: ({ cookie }) => {
        updateGtagConsent(cookie);
      },
    });
  }, []);

  return null;
};
