export function generateOrganizationSchema(data: any) {
  if (!data || !data.siteSettings || !data.siteSettings.agency) return null;

  const { agency } = data.siteSettings;
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://onbast.com"; // Fallback URL

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": agency.name || "ONBAST",
    "url": baseUrl,
    "logo": agency.logo,
    "description": data.seo?.description || "Agencia de desarrollo web y estrategias digitales.",
    "email": agency.email,
    "telephone": agency.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": agency.address?.street || "",
      "addressLocality": agency.address?.city || "",
      "addressRegion": agency.address?.state || "",
      "postalCode": agency.address?.zip || "",
      "addressCountry": agency.address?.country || ""
    },
    "sameAs": agency.socialProfiles?.map((profile: any) => profile.url) || [],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": agency.phone,
      "contactType": "customer service",
      "areaServed": "Global",
      "availableLanguage": ["Spanish", "English"]
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
