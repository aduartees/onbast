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
    "sameAs": agency.socialProfiles?.map((profile: any) => profile.url) || [],
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

export function generateServiceSchema(service: any) {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://onbast.com";
    
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": service.title,
        "provider": {
            "@type": "Organization",
            "name": "ONBAST",
            "url": baseUrl
        },
        "areaServed": {
            "@type": "Country",
            "name": "España"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Servicios de Desarrollo Web y Posicionamiento SEO y GEO",
            "itemListElement": service.features?.map((feature: any) => ({
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": feature.title
                }
            })) || []
        },
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
