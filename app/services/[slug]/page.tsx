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
  problem?: string;
  solution?: string;
  imageUrl?: string;
  imageAlt?: string;
  heroButtonText?: string;
  heroButtonLink?: string;
  icon?: string;
  features?: {
    title: string;
    description: string;
    icon?: string;
  }[];
  benefits?: string[];
  process?: {
    title: string;
    description: string;
    imageUrl?: string;
  }[];
  technologies?: string[];
  impactSection?: {
    title: string;
    cards: {
      title: string;
      description: string;
      colSpan: number;
      minHeight?: number;
      imageUrl?: string;
      imageAlt?: string;
      color: string;
    }[];
  };
  team?: {
    name: string;
    role: string;
    imageUrl: string;
    imageAlt?: string;
    social?: { linkedin?: string; twitter?: string };
  }[];
  testimonials?: {
    name: string;
    role: string;
    quote: string;
    imageUrl?: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  seoTitle?: string;
  seoDescription?: string;
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
      next: { revalidate: 60 } // ISR
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
    "provider": {
      "@type": "Organization",
      "name": "ONBAST",
      "url": "https://onbast.com" // Reemplazar con dominio real
    },
    "areaServed": "Global",
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
        description={service.longDescription || service.shortDescription} 
        buttonText={service.heroButtonText}
        buttonLink={service.heroButtonLink}
      />

      <ServiceContent 
        features={service.features}
        benefits={service.benefits}
        process={service.process}
        longDescription={service.longDescription}
        overviewText={service.overviewText}
        problem={service.problem}
        solution={service.solution}
        technologies={service.technologies}
        impactSection={service.impactSection}
        team={service.team}
        testimonials={service.testimonials}
        faqs={service.faqs}
      />

    </main>
  );
}
