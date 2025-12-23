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

type OrganizationSchemaType = "Organization" | "LocalBusiness" | "AboutPage" | "ContactPage";

type KnowsAboutService = {
  title?: string;
  additionalType?: string | null;
};

type OrganizationSchemaInput = {
  siteSettings?: {
    agency?: {
      name?: string;
      email?: string;
      phone?: string;
      address?: {
        street?: string;
        city?: string;
        zip?: string;
      };
      socialProfiles?: string[];
      logo?: string;
    };
  };
  seo?: {
    description?: string;
  };
  contactInfo?: {
    schedule?: string;
  };
};

const toAbsoluteUrl = (baseUrl: string, path: string) => {
  if (!path.startsWith("/")) return `${baseUrl}/${path}`;
  return `${baseUrl}${path}`;
};

export function generateOrganizationSchema(
  data: OrganizationSchemaInput | null | undefined,
  type: OrganizationSchemaType = "Organization",
  knowsAboutServices: KnowsAboutService[] = []
) {
  const agency = data?.siteSettings?.agency;
  if (!agency) return null;

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://onbast.com";
  const organizationId = `${baseUrl}/#organization`;

  const schedule = data?.contactInfo?.schedule;
  const hoursAvailable = parseScheduleToSchema(schedule);

  const knowsAbout = Array.from(
    new Map(
      (knowsAboutServices || [])
        .filter((service) => typeof service?.additionalType === "string" && service.additionalType.length > 0)
        .map((service) => {
          const wikidataUrl = service.additionalType as string;
          return [
            wikidataUrl,
            {
              "@type": "Thing",
              "@id": wikidataUrl,
              ...(service?.title ? { name: service.title } : {}),
            },
          ] as const;
        })
    ).values()
  );

  const organizationNode = {
    "@type": "Organization",
    "@id": organizationId,
    name: agency.name || "ONBAST",
    url: baseUrl,
    ...(agency.logo ? { logo: agency.logo } : {}),
    description:
      data?.seo?.description ||
      "Agencia de Desarrollo Web y Posicionamiento SEO y GEO. Desarrollo de paginas web impresionantes y posicionamiento digital para empresas en toda España.",
    ...(agency.email ? { email: agency.email } : {}),
    ...(Array.isArray(agency.socialProfiles) ? { sameAs: agency.socialProfiles } : {}),
    areaServed: {
      "@type": "Country",
      name: "España",
      identifier: "ES",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "ES",
      addressLocality: agency.address?.city || "Santander",
      postalCode: agency.address?.zip || "39012",
      streetAddress: agency.address?.street || "C. la Tesilla, 6",
    },
    contactPoint: {
      "@type": "ContactPoint",
      ...(agency.phone ? { telephone: agency.phone } : {}),
      contactType: "sales",
      areaServed: "ES",
      availableLanguage: ["Spanish", "English"],
      ...(hoursAvailable ? { hoursAvailable } : {}),
    },
    ...(knowsAbout.length ? { knowsAbout } : {}),
  };

  if (type === "Organization" || type === "LocalBusiness") {
    return organizationNode;
  }

  if (type === "AboutPage") {
    return {
      "@type": "AboutPage",
      "@id": `${baseUrl}/agencia#aboutpage`,
      url: toAbsoluteUrl(baseUrl, "/agencia"),
      mainEntity: {
        "@id": organizationId,
      },
    };
  }

  if (type === "ContactPage") {
    return {
      "@type": "ContactPage",
      "@id": `${baseUrl}/contacto#contactpage`,
      url: toAbsoluteUrl(baseUrl, "/contacto"),
      mainEntity: {
        "@id": organizationId,
      },
    };
  }

  return organizationNode;
}

export function generateServiceSchema(service: any, agency?: any) {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://onbast.com";
    const organizationId = `${baseUrl}/#organization`;
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
        "@type": "Service",
        "serviceType": service.title,
        "name": service.title,
        "url": `${baseUrl}/servicios/${service.slug}`,
        ...(service.additionalType ? { "additionalType": service.additionalType } : {}),
        "description": service.seoDescription || service.shortDescription,
        ...(serviceImage ? { "image": serviceImage } : {}),
        "provider": {
            "@type": "Organization",
            "@id": organizationId,
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
  const coreServices = (services || []).filter((service) => service?.isCoreService);
  const fallbackServices = (services || []).filter(
    (service) => typeof service?.additionalType === "string" && service.additionalType.length > 0
  );
  const knowsAboutServices = coreServices.length ? coreServices : fallbackServices;

  const organizationNode = generateOrganizationSchema(data, "Organization", knowsAboutServices);
  if (!organizationNode) return null;

  const agency = data?.siteSettings?.agency;
  const serviceNodes = (services || []).map((service) => generateServiceSchema(service, agency));

  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode, ...serviceNodes],
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
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
