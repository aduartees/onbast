export function parseScheduleToSchema(schedule: string | undefined) {
  if (!schedule) return undefined;
  
  const s = schedule.toLowerCase();
  
  // Case: "24 horas", "24/7", "always"
  if (s.includes('24') || s.includes('siempre') || s.includes('always')) {
    return [
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "00:00",
            "closes": "23:59"
        }
    ];
  }

  // Simple parser for "Lunes a Viernes 9-18" or "Mon-Fri 9am-6pm"
  // This is a basic implementation and can be expanded
  if (s.includes('lunes') || s.includes('viernes') || s.includes('mon') || s.includes('fri')) {
     return [
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
        }
     ];
  }
  
  return undefined;
}

export function generateOrganizationSchema(data: any, type: "Organization" | "LocalBusiness" | "AboutPage" | "ContactPage" = "Organization") {
  if (!data || !data.siteSettings || !data.siteSettings.agency) return null;

  const { agency } = data.siteSettings;
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://onbast.com";
  
  // Attempt to find schedule in contactInfo or fallback
  const schedule = data.contactInfo?.schedule;
  const hoursAvailable = parseScheduleToSchema(schedule);

  // Base Properties
  const organizationProps = {
    "@type": "Organization",
    "name": agency.name || "ONBAST",
    "url": baseUrl,
    "logo": agency.logo,
    "description": data.seo?.description || "Agencia de Desarrollo Web y Posicionamiento SEO y GEO. Desarrollo de paginas web impresionantes y posicionamiento digital para empresas en toda España.",
    "email": agency.email,
    "sameAs": agency.socialProfiles || [],
    "areaServed": {
      "@type": "Country",
      "name": "España",
      "identifier": "ES"
    },
    // Dirección fiscal por confianza, pero eclipsada por areaServed
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ES",
      "addressLocality": agency.address?.city || "Santander",
      "postalCode": agency.address?.zip || "39012",
      "streetAddress": agency.address?.street || "C. la Tesilla, 6"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": agency.phone,
      "contactType": "sales",
      "areaServed": "ES",
      "availableLanguage": ["Spanish", "English"],
      ...(hoursAvailable ? { "hoursAvailable": hoursAvailable } : {})
    }
  };

  // 1. Home Page (Organization)
  if (type === "Organization") {
    return {
      "@context": "https://schema.org",
      ...organizationProps
    };
  }

  // 3. About Page (/agencia)
  if (type === "AboutPage") {
    return {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "mainEntity": {
        ...organizationProps,
        "foundingDate": "2025",
        "knowsAbout": ["Desarrollo Web", "Next.js", "Posicionamiento SEO", "Posicionamiento GEO", "Inteligencia Artificial"],
        "numberOfEmployees": {
          "@type": "QuantitativeValue",
          "minValue": 2,
          "maxValue": 10
        }
      }
    };
  }

  // 4. Contact Page (/contacto)
  if (type === "ContactPage") {
    return {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "mainEntity": {
        ...organizationProps,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": agency.phone,
          "contactType": "customer service",
          "areaServed": "ES",
          "availableLanguage": ["Spanish", "English"]
        }
      }
    };
  }

  // Fallback
  return {
      "@context": "https://schema.org",
      ...organizationProps
  };
}

export function generateServiceSchema(service: any, agency?: any) {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://onbast.com";
    const serviceImage = service.seoImage || service.imageUrl;

    const parseNumericPrice = (value: unknown) => {
        if (typeof value === "number" && Number.isFinite(value)) return String(Math.trunc(value));
        if (typeof value !== "string") return undefined;
        const numeric = value.replace(/[^0-9]/g, "");
        return numeric.length ? numeric : undefined;
    };

    const buildUnitPriceSpecification = (period: unknown, price: string, currency: string) => {
        if (typeof period !== "string") return undefined;
        const p = period.toLowerCase();
        if (p.includes("mes") || p.includes("mensual") || p.includes("month") || p.includes("/mo")) {
            return {
                "@type": "UnitPriceSpecification",
                price,
                priceCurrency: currency,
                referenceQuantity: {
                    "@type": "QuantitativeValue",
                    value: "1",
                    unitCode: "MON",
                },
            };
        }

        if (p.includes("año") || p.includes("anual") || p.includes("year") || p.includes("/yr")) {
            return {
                "@type": "UnitPriceSpecification",
                price,
                priceCurrency: currency,
                referenceQuantity: {
                    "@type": "QuantitativeValue",
                    value: "1",
                    unitCode: "ANN",
                },
            };
        }

        return undefined;
    };

    const buildOffer = (input: any) => {
        const currency = typeof input?.currency === "string" && input.currency.length ? input.currency : "EUR";
        const numericPrice = parseNumericPrice(input?.price);
        if (!numericPrice) return null;

        const url = typeof input?.buttonLinkID === "string" && input.buttonLinkID.length
            ? `${baseUrl}/planes?service=${encodeURIComponent(input.buttonLinkID)}`
            : `${baseUrl}/servicios/${service.slug}`;

        const priceSpecification = buildUnitPriceSpecification(input?.period, numericPrice, currency);

        return {
            "@type": "Offer",
            ...(input?.title ? { name: input.title } : {}),
            price: numericPrice,
            priceCurrency: currency,
            availability: "https://schema.org/InStock",
            url,
            ...(input?.description || service?.shortDescription
                ? { description: input?.description || service.shortDescription }
                : {}),
            priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
            ...(priceSpecification ? { priceSpecification } : {}),
        };
    };
    
    // Parse price if available
    let offers: any = undefined;
    const pricingPlans = Array.isArray(service?.pricing?.plans) ? service.pricing.plans : [];
    if (pricingPlans.length) {
        const planOffers = pricingPlans
            .map((plan: any) => buildOffer(plan))
            .filter(Boolean);

        if (planOffers.length === 1) {
            offers = planOffers[0];
        } else if (planOffers.length > 1) {
            const numericPrices = planOffers
                .map((o: any) => Number.parseInt(String(o.price), 10))
                .filter((n: number) => Number.isFinite(n));

            const currency = typeof pricingPlans[0]?.currency === "string" && pricingPlans[0].currency.length
                ? pricingPlans[0].currency
                : "EUR";

            offers = {
                "@type": "AggregateOffer",
                lowPrice: numericPrices.length ? String(Math.min(...numericPrices)) : undefined,
                highPrice: numericPrices.length ? String(Math.max(...numericPrices)) : undefined,
                priceCurrency: currency,
                offerCount: planOffers.length,
                offers: planOffers,
            };
        }
    } else if (service?.pricing?.price) {
        offers = buildOffer({
            title: service?.pricing?.title || service?.title,
            price: service.pricing.price,
            currency: "EUR",
            period: service.pricing.period,
            description: service.pricing.description,
        });
    }

    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": service.title,
        "name": service.title,
        "url": `${baseUrl}/servicios/${service.slug}`,
        ...(service.additionalType ? { "additionalType": service.additionalType } : {}),
        "description": service.seoDescription || service.shortDescription,
        ...(serviceImage ? { "image": serviceImage } : {}),
        "provider": {
            "@type": "Organization",
            "name": agency?.name || "ONBAST",
            "url": baseUrl,
            ...(agency?.logo ? { "logo": agency.logo } : {}),
            ...(agency?.socialProfiles ? { "sameAs": agency.socialProfiles } : {})
        },
        "areaServed": {
            "@type": "Country",
            "name": "España"
        },
        // Main Offer (Price) - CRITICAL for Rich Snippets
        ...(offers ? { "offers": offers } : {}),
        
        // Removed incorrect hasOfferCatalog mapping for features as per user request.
        // Features are properties of the service, not separate commercial offers in a catalog.
        
        "availableChannel": {
            "@type": "ServiceChannel",
            "serviceUrl": `${baseUrl}/contacto`,
            "serviceLocation": {
                "@type": "Place",
                "name": "Online / Remoto"
            }
        }
    };
}

export function generateHomeOrganizationServicesSchema(data: any, services: any[]) {
  const organizationSchema = generateOrganizationSchema(data, "Organization");
  if (!organizationSchema) return null;

  const { ["@context"]: _organizationContext, ...organizationNode } = organizationSchema as any;
  const agency = data?.siteSettings?.agency;

  const serviceNodes = (services || []).map((service) => {
    const serviceSchema = generateServiceSchema(service, agency);
    const { ["@context"]: _serviceContext, ...serviceNode } = serviceSchema as any;
    return serviceNode;
  });

  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode, ...serviceNodes]
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
