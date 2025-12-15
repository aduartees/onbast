import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { SERVICE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { ServiceHeader } from "@/components/sections/service-header";
import { ServiceContent } from "@/components/sections/service-content";

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

// --- Dynamic Metadata ---
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service: SanityServiceDetail = await client.fetch(SERVICE_BY_SLUG_QUERY, { slug });

  if (!service) {
    return {
      title: "Servicio No Encontrado - ONBAST",
    };
  }

  return {
    title: service.seoTitle || `${service.title} | ONBAST Agencia`,
    description: service.seoDescription || service.shortDescription,
    openGraph: {
      title: service.seoTitle || service.title,
      description: service.seoDescription || service.shortDescription,
      images: service.imageUrl ? [service.imageUrl] : [],
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

  // --- JSON-LD (Schema.org) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.shortDescription,
    "image": service.imageUrl,
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
        "price": service.pricing.price ? parseFloat(service.pricing.price.replace(/[^0-9.]/g, '')) : undefined,
        "priceCurrency": "EUR", // Default to EUR, could be dynamic
        "description": service.pricing.description,
        "url": `${service.agency?.url || "https://onbast.com"}/services/${service.slug}`
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
