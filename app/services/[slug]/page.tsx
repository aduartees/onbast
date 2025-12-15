import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { SERVICE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { ServiceHeader } from "@/components/sections/service-header";
import { ServiceContent } from "@/components/sections/service-content";
import { ScrollReset } from "@/components/utils/scroll-reset";

// --- Types ---
interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

interface SanityServiceDetail {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription?: string;
  overviewText?: string;
  imageUrl?: string;
  imageAlt?: string;
  heroButtonText?: string;
  heroButtonLink?: string;
  heroHeadline?: string;
  heroIntroduction?: string;
  heroTrustedLogos?: { name: string; logo: string; alt?: string }[];
  icon?: string;
  featuresTitle?: string;
  featuresDescription?: string;
  features?: {
    title: string;
    description: string;
    icon?: string;
  }[];
  benefits?: string[];
  processTitle?: string;
  processDescription?: string;
  process?: {
    title: string;
    description: string;
  }[];
  technologies?: string[];
  techTitle?: string;
  techDescription?: string;
  impactSection?: {
    title?: string;
    subtitle?: string;
    stats?: {
      value: number;
      prefix?: string;
      suffix?: string;
      label: string;
      description?: string;
    }[];
  };
  teamTitle?: string;
  teamDescription?: string;
  team?: {
    name: string;
    role: string;
    imageUrl: string;
    imageAlt?: string;
    social?: { linkedin?: string; twitter?: string };
  }[];
  testimonialsTitle?: string;
  testimonialsDescription?: string;
  testimonials?: {
    name: string;
    role: string;
    quote: string;
    imageUrl?: string;
  }[];
  pricing?: {
    title?: string;
    subtitle?: string;
    badge?: string;
    price?: string;
    period?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    features?: string[];
    addon?: {
      title: string;
      price: string;
      active?: boolean;
    };
    trustedLogos?: string[];
  };
  relatedProjects?: {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
    link?: string;
  }[];
  faqTitle?: string;
  faqDescription?: string;
  faqs?: {
    question: string;
    answer: string;
  }[];
  ctaSection?: {
    title?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  agency?: {
    name: string;
    url: string;
    description: string;
    logo: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      region: string;
      postalCode: string;
      country: string;
    };
    socialProfiles: string[];
  };
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"; // Fallback Tech/Business Image

// --- Dynamic Metadata ---
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service: SanityServiceDetail = await client.fetch(SERVICE_BY_SLUG_QUERY, { slug });

  if (!service) {
    return {
      title: "Servicio No Encontrado - ONBAST",
    };
  }

  const shareImage = service.seoImage || service.imageUrl || DEFAULT_IMAGE;

  return {
    title: service.seoTitle || `${service.title} | ONBAST Agencia`,
    description: service.seoDescription || service.shortDescription,
    openGraph: {
      title: service.seoTitle || service.title,
      description: service.seoDescription || service.shortDescription,
      url: `https://onbast.com/services/${service.slug}`,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
      locale: 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: service.seoTitle || service.title,
      description: service.seoDescription || service.shortDescription,
      images: [shareImage],
    },
  };
}

// --- Main Page Component ---
export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service: SanityServiceDetail = await client.fetch(SERVICE_BY_SLUG_QUERY, { slug }, {
      next: { revalidate: 0 } // No cache, always fresh
  });

  if (!service) {
    notFound();
  }

  // --- Price Logic for Schema ---
  const basePrice = service.pricing?.price ? parseFloat(service.pricing.price.replace(/[^0-9.]/g, '')) : 0;
  const addonPrice = service.pricing?.addon?.price ? parseFloat(service.pricing.addon.price.replace(/[^0-9.]/g, '')) : 0;
  const hasAddon = !!service.pricing?.addon;
  const maxPrice = basePrice + addonPrice;

  // --- JSON-LD (Schema.org) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.shortDescription,
    "image": service.imageUrl || DEFAULT_IMAGE,
    "provider": {
      "@type": "Organization",
      "name": service.agency?.name || "ONBAST",
      "url": service.agency?.url || "https://onbast.com",
      "logo": service.agency?.logo,
      "description": service.agency?.description,
      "email": service.agency?.email,
      "telephone": service.agency?.phone,
      "address": service.agency?.address ? {
        "@type": "PostalAddress",
        "streetAddress": service.agency.address.street,
        "addressLocality": service.agency.address.city,
        "addressRegion": service.agency.address.region,
        "postalCode": service.agency.address.postalCode,
        "addressCountry": service.agency.address.country
      } : undefined,
      "sameAs": service.agency?.socialProfiles
    },
    "areaServed": "Global",
    "offers": service.pricing ? {
        "@type": "Offer",
        "priceCurrency": "EUR",
        "description": service.pricing.description,
        "url": `${service.agency?.url || "https://onbast.com"}/services/${service.slug}`,
        // Logic: If addon exists, show price range (oscillation). If not, show fixed price.
        ...(hasAddon ? {
            "priceSpecification": {
                "@type": "PriceSpecification",
                "minPrice": basePrice,
                "maxPrice": maxPrice,
                "priceCurrency": "EUR"
            }
        } : {
            "price": basePrice
        })
    } : undefined,
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios Digitales",
      "itemListElement": service.features?.map((feature, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": feature.title,
          "description": feature.description
        },
        "position": index + 1
      }))
    },
    "mainEntity": service.faqs ? {
        "@type": "FAQPage",
        "mainEntity": service.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : undefined
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-neutral-700 selection:text-white">
      {/* 1. SEO Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Scroll Reset on Mount */}
      <ScrollReset />

      <Navbar />

      <ServiceHeader 
        title={service.title} 
        description={service.heroHeadline || service.shortDescription}
        introduction={service.heroIntroduction}
        trustedLogos={service.heroTrustedLogos}
        buttonText={service.heroButtonText}
        buttonLink={service.heroButtonLink}
      />
      <ServiceContent 
        mainImage={service.imageUrl}
        features={service.features} 
        featuresTitle={service.featuresTitle}
        featuresDescription={service.featuresDescription}
        benefits={service.benefits} 
        process={service.process} 
        processTitle={service.processTitle}
        processDescription={service.processDescription}
        longDescription={service.longDescription} 
        overviewText={service.overviewText} 
        technologies={service.technologies} 
        techTitle={service.techTitle}
        techDescription={service.techDescription}
        impactSection={service.impactSection} 
        team={service.team} 
        teamTitle={service.teamTitle}
        teamDescription={service.teamDescription}
        testimonials={service.testimonials} 
        testimonialsTitle={service.testimonialsTitle}
        testimonialsDescription={service.testimonialsDescription}
        pricing={service.pricing}
        relatedProjects={service.relatedProjects}
        faqs={service.faqs} 
        faqTitle={service.faqTitle}
        faqDescription={service.faqDescription}
        ctaSection={service.ctaSection}
      />

    </main>
  );
}
