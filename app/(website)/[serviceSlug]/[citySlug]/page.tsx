import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { SERVICE_LOCATION_PAGE_QUERY, ALL_SERVICES_AND_LOCATIONS_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { ServiceHeader } from "@/components/sections/service-header";
import { ServiceContent } from "@/components/sections/service-content";
import { ScrollReset } from "@/components/utils/scroll-reset";
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo";

// --- Types ---
interface PageProps {
  params: Promise<{ serviceSlug: string; citySlug: string }>;
}

interface SanityAgencyInfo {
  name?: string;
  url?: string;
  description?: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: any;
  socialProfiles?: string[];
}

interface SanityServiceDetail {
  _id: string;
  title: string;
  slug: string;
  additionalType?: string;
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
  agency?: SanityAgencyInfo;
}

interface SanityLocation {
  _id: string;
  name: string;
  slug: string;
  type: 'city' | 'town';
  population?: number;
  gentilicio?: string;
  geoContext?: string;
  coordinates?: { lat: number; lng: number; alt?: number };
  wikipediaUrl?: string;
  parentRef?: string;
  parent?: {
    name: string;
    slug: string;
  };
}

interface SanityServiceLocationOverride {
  seoTitle?: string;
  seoDescription?: string;
  heroHeadline?: string;
  heroText?: string;
  localContentBlock?: any; // Portable Text
  ctaSection?: {
    title?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
  };
  customTestimonials?: {
    name: string;
    role: string;
    quote: string;
    imageUrl?: string;
  }[];
  customProjects?: {
    title: string;
    description?: string;
    slug: string;
    imageUrl: string;
    tags?: string[];
  }[];
  // Added fields for type safety
  customFeatures?: any[];
  customProcess?: any[];
  customFaqs?: any[];
}

interface QueryResult {
  service: SanityServiceDetail;
  location: SanityLocation;
  override: SanityServiceLocationOverride;
  nearbyLocations: {
    name: string;
    slug: string;
    type: string;
  }[];
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop";

// --- Static Params for ISR ---
export async function generateStaticParams() {
  const data = await client.fetch(ALL_SERVICES_AND_LOCATIONS_QUERY);
  const params: { serviceSlug: string; citySlug: string }[] = [];

  if (data?.services && data?.locations) {
    for (const service of data.services) {
      for (const location of data.locations) {
        params.push({ serviceSlug: service.slug, citySlug: location.slug });
      }
    }
  }

  return params;
}

// --- Dynamic Metadata ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serviceSlug, citySlug } = await params;
  const data: QueryResult = await client.fetch(SERVICE_LOCATION_PAGE_QUERY, { serviceSlug, citySlug });

  if (!data?.service || !data?.location) {
    return {
      title: "Página No Encontrada - ONBAST",
    };
  }

  const { service, location, override } = data;
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://onbast.com";

  // Logic: Override > Constructed > Default
  const metaTitle = override?.seoTitle || `${service.title} en ${location.name} | ONBAST`;
  const metaDescription = override?.seoDescription || `Servicios profesionales de ${service.title} en ${location.name}. Suscripciones adaptadas a la economía local. Auténticos profesionales de ${service.title} en ${location.name}. `;
  const shareImage = `${baseUrl}/api/og?title=${encodeURIComponent(`${service.title} en ${location.name}`)}&subtitle=${encodeURIComponent("ONBAST | WEB, SEO & GEO")}`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `https://onbast.com/${service.slug}/${location.slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `https://onbast.com/${service.slug}/${location.slug}`,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: `${service.title} en ${location.name}`,
        },
      ],
      locale: 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [shareImage],
    },
  };
}

// --- Main Page Component ---
export default async function ServiceLocationPage({ params }: PageProps) {
  const { serviceSlug, citySlug } = await params;
  const data: QueryResult = await client.fetch(SERVICE_LOCATION_PAGE_QUERY, { serviceSlug, citySlug }, {
      next: { revalidate: 3600 } // Revalidate every hour
  });

  if (!data?.service || !data?.location) return notFound();

  const { service, location, override } = data;

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://onbast.com";

  const localHeroImage = `/api/hero?title=${encodeURIComponent(`${service.title} en ${location.name}`)}&subtitle=${encodeURIComponent("Desarrollo Web y Posicionamiento SEO & GEO")}`;
  const localHeroAlt = `${service.title} en ${location.name} | ONBAST`;
  const localHeroImageAbsolute = `${baseUrl}${localHeroImage}`;

  // --- Data Merging Strategy ---
  // Prioritize Local Overrides, but fallback to Service Defaults for structure
  const heroTitle = override?.heroHeadline || `${service.title} en ${location.name}`;
  const heroDescription = override?.heroText || `Agencia experta en ${service.title} con servicio en ${location.name} y alrededores.`;
  
  // Testimonials: Local > Service
  const testimonials = override?.customTestimonials?.length ? override.customTestimonials : service.testimonials?.map(t => ({
    ...t,
    role: `${t.role} (${location.name})`
  }));

  // Projects: Local > Service
  const projects = override?.customProjects?.length ? override.customProjects : service.relatedProjects;

  // Features: Local > Service
  const features = override?.customFeatures?.length ? override.customFeatures : service.features;

  // Process: Local > Service
  const processSteps = override?.customProcess?.length ? override.customProcess : service.process;

  // FAQs: Local > Service
  const faqs = override?.customFaqs?.length ? override.customFaqs : service.faqs;

  const ctaSection = override?.ctaSection || {
    title: `¿Listo para activar ${service.title} en ${location.name}?`,
    description: `ONBAST diseña, desarrolla y optimiza para captar demanda real en ${location.name}. Sin humo. Con performance y conversión.`,
    buttonText: service.ctaSection?.buttonText || "Agendar Llamada",
    buttonLink: service.ctaSection?.buttonLink || "/contacto",
    secondaryButtonText: service.ctaSection?.secondaryButtonText || "Ver Portfolio",
    secondaryButtonLink: service.ctaSection?.secondaryButtonLink || "/proyectos",
  };

  const nearbyLocations = data.nearbyLocations?.length
    ? data.nearbyLocations
    : (location.parent ? [{ name: location.parent.name, slug: location.parent.slug, type: "city" }] : []);

  // --- Schema Generation ---
  // We need to generate Service schema but with AreaServed
  const serviceSchema = generateServiceSchema(service, service.agency);
  // We need to extend/modify it for Local SEO
  const schemaName = `${service.title} en ${location.name}`;
  const localServiceSchema = {
    ...serviceSchema,
    areaServed: {
      "@type": "City",
      name: location.name,
      sameAs: location.wikipediaUrl
    },
    name: schemaName,
    description: heroDescription,
    image: localHeroImageAbsolute
  };

  const faqSchema = generateFAQSchema(faqs || []);
  
  // Breadcrumbs
  const breadcrumbs = [
    { name: "Inicio", item: "https://onbast.com" },
    { name: "Servicios", item: "https://onbast.com/servicios" },
    { name: service.title, item: `https://onbast.com/servicios/${service.slug}` },
  ];

  if (location.parent) {
     // If it's a town, add parent city
     // Check if parent slug is available. In query we fetched parent->slug
     if (location.parent.slug) {
         breadcrumbs.push({ name: location.parent.name, item: `https://onbast.com/${service.slug}/${location.parent.slug}` });
     }
  }

  breadcrumbs.push({ name: location.name, item: `https://onbast.com/${service.slug}/${location.slug}` });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      localServiceSchema,
      breadcrumbSchema,
      ...(faqSchema ? [faqSchema] : [])
    ]
  };

  const breadcrumbsOverride = [
    { name: "Servicios", href: "/servicios" },
    { name: service.title, href: `/servicios/${service.slug}` },
    ...(location.parent?.slug ? [{ name: location.parent.name, href: `/${service.slug}/${location.parent.slug}` }] : []),
    { name: location.name, href: `/${service.slug}/${location.slug}` },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white pt-0">
      <ScrollReset />

      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ServiceHeader 
        key={`${serviceSlug}-${citySlug}`}
        title={`${service.title} en ${location.name}`} // H1 (Pill) - SEO Optimized
        description={heroTitle} // H2 (Big Text) - Visual Impact
        highlight={location.name} 
        introduction={heroDescription}
        trustedLogos={service.heroTrustedLogos}
        buttonText={service.heroButtonText}
        buttonLink={service.heroButtonLink}
        secondaryButtonText={service.heroSecondaryButtonText}
        secondaryButtonLink={service.heroSecondaryButtonLink}
        breadcrumbsOverride={breadcrumbsOverride}
      />
      
      <ServiceContent 
        key={`content-${serviceSlug}-${citySlug}`}
        mainImage={localHeroImage}
        mainImageAlt={localHeroAlt}
        mainImageName={service.imageName}
        serviceTitle={service.title}
        citySlug={location.slug}
        
        // Pass Local Content Block
        localContentBlock={override?.localContentBlock}

        features={features} 
        featuresTitle={service.featuresTitle}
        featuresHighlight={service.featuresHighlight}
        featuresDescription={service.featuresDescription}
        benefits={service.benefits} 
        process={processSteps} 
        processTitle={service.processTitle}
        processHighlight={service.processHighlight}
        processDescription={service.processDescription}
        
        // Fallbacks if local block not present
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
        
        // Overridden Lists
        testimonials={testimonials} 
        testimonialsTitle={service.testimonialsTitle}
        testimonialsHighlight={service.testimonialsHighlight}
        testimonialsDescription={service.testimonialsDescription}
        
        // Pricing should eventually link to /planes?service=...&location=...
        pricing={service.pricing} // TODO: Adapt pricing button link in Phase 5
        
        relatedProjects={projects as any} // Cast to match type if needed
        relatedProjectsTitle={service.relatedProjectsTitle}
        relatedProjectsHighlight={service.relatedProjectsHighlight}
        relatedProjectsDescription={service.relatedProjectsDescription}
        
        faqs={faqs} 
        faqTitle={service.faqTitle}
        faqHighlight={service.faqHighlight}
        faqDescription={service.faqDescription}
        ctaSection={ctaSection}
        nearbyLocations={nearbyLocations}
        cityName={location.name}
        serviceSlug={service.slug}
      />

    </main>
  );
}
