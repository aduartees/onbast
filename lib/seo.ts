export function generateOrganizationSchema(data: any, type: "Organization" | "LocalBusiness" | "AboutPage" | "ContactPage" = "Organization") {
  if (!data || !data.siteSettings || !data.siteSettings.agency) return null;

  const { agency } = data.siteSettings;
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://onbast.com";

  // Base Properties
  const organizationProps = {
    "@type": "Organization",
    "name": agency.name || "ONBAST",
    "url": baseUrl,
    "logo": agency.logo,
    "description": data.seo?.description || "Agencia de ingeniería de software y SEO. Desarrollo de aplicaciones y estrategias digitales para empresas en toda España.",
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
      "postalCode": agency.address?.zip || "39001",
      "streetAddress": agency.address?.street || "Calle Castelar"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": agency.phone,
      "contactType": "sales",
      "areaServed": "ES",
      "availableLanguage": ["Spanish", "English"]
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
        "foundingDate": "2024",
        "knowsAbout": ["Ingeniería de Software", "Next.js", "SEO Programático", "Inteligencia Artificial"],
        "numberOfEmployees": {
          "@type": "QuantitativeValue",
          "minValue": 5,
          "maxValue": 20
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
          "availableLanguage": "Spanish"
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
            "name": "Servicios de Desarrollo",
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
