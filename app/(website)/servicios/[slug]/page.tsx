import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { SERVICE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { ServiceHeader } from "@/components/sections/service-header";
import { ServiceContent } from "@/components/sections/service-content";
import { ScrollReset } from "@/components/utils/scroll-reset";
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema, generatePricingOfferCatalogSchema } from "@/lib/seo";

// --- Types ---
interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

type SanityServiceOutput =
  | {
      schemaType?: string;
      name?: string;
      description?: string;
    }
  | string;

type SanityAudience =
  | {
      schemaType?: string;
      name?: string;
      audienceType?: string;
      description?: string;
    }
  | string;

interface SanityServiceDetail {
  _id: string;
  title: string;
  slug: string;
  additionalType?: string;
  additionalTypes?: string[];
  serviceOutput?: SanityServiceOutput;
  audience?: SanityAudience;
  shortDescription: string;
  longDescription?: string;
  overviewText?: string;
  imageUrl?: string;
  imageName?: string;
  imageAlt?: string;
  heroButtonText?: string;
  heroButtonLink?: string;
  heroSecondaryButtonText?: string;
  heroSecondaryButtonLink?: string;
  heroHeadline?: string;
  heroHighlight?: string;
  heroIntroduction?: string;
  heroTrustedLogos?: { name: string; logo: string; alt?: string }[];
  icon?: string;
  featuresTitle?: string;
  featuresHighlight?: string;
  featuresDescription?: string;
  features?: {
    title: string;
    description: string;
    icon?: string;
  }[];
  benefits?: string[];
  processTitle?: string;
  processHighlight?: string;
  processDescription?: string;
  process?: {
    title: string;
    description: string;
  }[];
  technologies?: string[];
  techTitle?: string;
  techHighlight?: string;
  techDescription?: string;
  impactSection?: {
    title?: string;
    highlight?: string;
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
  teamHighlight?: string;
  teamDescription?: string;
  team?: {
    name: string;
    role: string;
    imageUrl: string;
    imageAlt?: string;
    social?: { linkedin?: string; twitter?: string };
  }[];
  testimonialsTitle?: string;
  testimonialsHighlight?: string;
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
    schemaAdditionalProperty?: { name?: string; value?: string }[];
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
    trustedCompaniesTitle?: string;
    trustedLogos?: { logo: string | null; name: string }[];
  };
  relatedProjectsTitle?: string;
  relatedProjectsHighlight?: string;
  relatedProjectsDescription?: string;
  relatedProjects?: {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
    link?: string;
  }[];
  faqTitle?: string;
  faqHighlight?: string;
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
  serviceLocations?: {
    name: string;
    slug: string;
    type: string;
  }[];
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

  const baseUrlRaw = process.env.NEXT_PUBLIC_URL || "https://www.onbast.com";
  const baseUrl = typeof baseUrlRaw === "string" ? baseUrlRaw.replace(/\/+$/, "") : "https://www.onbast.com";

  return {
    title: service.seoTitle || `${service.title} | ONBAST`,
    description: service.seoDescription || service.shortDescription,
    alternates: {
      canonical: `${baseUrl}/servicios/${service.slug}`,
    },
    openGraph: {
      title: service.seoTitle || `${service.title} | ONBAST`,
      description: service.seoDescription || service.shortDescription,
      url: `${baseUrl}/servicios/${service.slug}`,
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

  if (!service) return notFound();

  const baseUrlRaw = process.env.NEXT_PUBLIC_URL || "https://www.onbast.com";
  const baseUrl = typeof baseUrlRaw === "string" ? baseUrlRaw.replace(/\/+$/, "") : "https://www.onbast.com";
  const organizationId = `${baseUrl}/#organization`;

  const serviceSchema = generateServiceSchema(service, service.agency);
  const faqSchema = generateFAQSchema(service.faqs || []);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", item: `${baseUrl}/` },
    { name: "Servicios", item: `${baseUrl}/servicios` },
    { name: service.title, item: `${baseUrl}/servicios/${service.slug}` }
  ]);

  const offerCatalogSchema = generatePricingOfferCatalogSchema(service.pricing, {
    baseUrl,
    organizationId,
  });

  const serviceSchemaWithCatalog = offerCatalogSchema
    ? { ...serviceSchema, hasOfferCatalog: offerCatalogSchema }
    : serviceSchema;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      serviceSchemaWithCatalog,
      breadcrumbSchema,
      ...(faqSchema ? [faqSchema] : [])
    ]
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white pt-0">
      <ScrollReset />

      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ServiceHeader 
        key={slug} // Force re-mount on slug change to trigger animations
        title={service.title} 
        description={service.heroHeadline || service.shortDescription}
        highlight={service.heroHighlight}
        introduction={service.heroIntroduction}
        trustedLogos={service.heroTrustedLogos}
        buttonText={service.heroButtonText}
        buttonLink={service.heroButtonLink}
        secondaryButtonText={service.heroSecondaryButtonText}
        secondaryButtonLink={service.heroSecondaryButtonLink}
      />
      <ServiceContent 
        key={`content-${slug}`} // Force re-mount for content animations too
        mainImage={service.imageUrl}
        mainImageAlt={service.imageAlt}
        mainImageName={service.imageName}
        serviceSlug={service.slug}
        serviceTitle={service.title}
        features={service.features} 
        featuresTitle={service.featuresTitle}
        featuresHighlight={service.featuresHighlight}
        featuresDescription={service.featuresDescription}
        benefits={service.benefits} 
        process={service.process} 
        processTitle={service.processTitle}
        processHighlight={service.processHighlight}
        processDescription={service.processDescription}
        longDescription={service.longDescription} 
        overviewText={service.overviewText} 
        technologies={service.technologies} 
        techTitle={service.techTitle}
        techHighlight={service.techHighlight}
        techDescription={service.techDescription}
        impactSection={service.impactSection} 
        team={service.team} 
        teamTitle={service.teamTitle}
        teamHighlight={service.teamHighlight}
        teamDescription={service.teamDescription}
        testimonials={service.testimonials} 
        testimonialsTitle={service.testimonialsTitle}
        testimonialsHighlight={service.testimonialsHighlight}
        testimonialsDescription={service.testimonialsDescription}
        pricing={service.pricing}
        relatedProjects={service.relatedProjects}
        relatedProjectsTitle={service.relatedProjectsTitle}
        relatedProjectsHighlight={service.relatedProjectsHighlight}
        relatedProjectsDescription={service.relatedProjectsDescription}
        faqs={service.faqs} 
        faqTitle={service.faqTitle}
        faqHighlight={service.faqHighlight}
        faqDescription={service.faqDescription}
        ctaSection={service.ctaSection}
        serviceLocations={service.serviceLocations}
      />

    </main>
  );
}
