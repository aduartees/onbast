import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { SERVICE_LOCATION_PAGE_QUERY, ALL_SERVICES_AND_LOCATIONS_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { ServiceHeader } from "@/components/sections/service-header";
import { ServiceContent } from "@/components/sections/service-content";
import { ScrollReset } from "@/components/utils/scroll-reset";
import { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema, generatePricingOfferCatalogSchema } from "@/lib/seo";

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
  agency?: SanityAgencyInfo;
}

interface SanityLocation {
  _id: string;
  name: string;
  slug: string;
  type: 'city' | 'town';
  province?: {
    name: string;
    slug: string;
    coordinates?: { lat: number; lng: number; alt?: number };
    wikipediaUrl?: string;
  };
  autonomousCommunity?: {
    name: string;
    slug: string;
    coordinates?: { lat: number; lng: number; alt?: number };
    wikipediaUrl?: string;
  };
  population?: number;
  gentilicio?: string;
  geoContext?: string;
  coordinates?: { lat: number; lng: number; alt?: number };
  altitude?: number;
  wikipediaUrl?: string;
  nearbyLocations?: {
    name: string;
    slug: string;
    type: string;
  }[];
  parentRef?: string;
  parent?: {
    name: string;
    slug: string;
    province?: {
      name: string;
      slug: string;
      coordinates?: { lat: number; lng: number; alt?: number };
      wikipediaUrl?: string;
    };
    autonomousCommunity?: {
      name: string;
      slug: string;
      coordinates?: { lat: number; lng: number; alt?: number };
      wikipediaUrl?: string;
    };
  };
}

interface SanityServiceLocationOverride {
  seoTitle?: string;
  seoDescription?: string;
  heroHeadline?: string;
  heroText?: string;
  heroButtonText?: string;
  heroButtonLink?: string;
  heroSecondaryButtonText?: string;
  heroSecondaryButtonLink?: string;
  longDescription?: string;
  overviewText?: string;
  featuresTitle?: string;
  featuresHighlight?: string;
  featuresDescription?: string;
  benefits?: string[];
  processTitle?: string;
  processHighlight?: string;
  processDescription?: string;
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
  testimonialsTitle?: string;
  testimonialsHighlight?: string;
  testimonialsDescription?: string;
  relatedProjectsTitle?: string;
  relatedProjectsHighlight?: string;
  relatedProjectsDescription?: string;
  faqTitle?: string;
  faqHighlight?: string;
  faqDescription?: string;
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
  const organizationId = `${baseUrl}/#organization`;

  const localHeroImage = `/api/hero?title=${encodeURIComponent(`${service.title} en ${location.name}`)}&subtitle=${encodeURIComponent("Desarrollo Web y Posicionamiento SEO & GEO")}`;
  const localHeroAlt = `${service.title} en ${location.name} | ONBAST`;
  const localHeroImageAbsolute = `${baseUrl}${localHeroImage}`;

  // --- Data Merging Strategy ---
  // Prioritize Local Overrides, but fallback to Service Defaults for structure
  const heroTitle = override?.heroHeadline || `${service.title} en ${location.name}`;
  const heroDescription = override?.heroText || `Agencia experta en ${service.title} con servicio en ${location.name} y alrededores.`;

  const heroButtonText = override?.heroButtonText || service.heroButtonText;
  const heroButtonLink = override?.heroButtonLink || service.heroButtonLink;
  const heroSecondaryButtonText = override?.heroSecondaryButtonText || service.heroSecondaryButtonText;
  const heroSecondaryButtonLink = override?.heroSecondaryButtonLink || service.heroSecondaryButtonLink;
  
  // Testimonials: Local > Service
  const testimonials = override?.customTestimonials?.length ? override.customTestimonials : service.testimonials?.map(t => ({
    ...t,
    role: `${t.role} (${location.name})`
  }));

  // Projects: Local > Service
  const projects = override?.customProjects?.length ? override.customProjects : service.relatedProjects;

  // Features: Local > Service
  const features = override?.customFeatures?.length ? override.customFeatures : service.features;

  const featuresTitle = override?.featuresTitle || service.featuresTitle;
  const featuresHighlight = override?.featuresHighlight || service.featuresHighlight;
  const featuresDescription = override?.featuresDescription || service.featuresDescription;
  const benefits = override?.benefits?.length ? override.benefits : service.benefits;

  // Process: Local > Service
  const processSteps = override?.customProcess?.length ? override.customProcess : service.process;

  const processTitle = override?.processTitle || service.processTitle;
  const processHighlight = override?.processHighlight || service.processHighlight;
  const processDescription = override?.processDescription || service.processDescription;

  // FAQs: Local > Service
  const faqs = override?.customFaqs?.length ? override.customFaqs : service.faqs;

  const faqTitle = override?.faqTitle || service.faqTitle;
  const faqHighlight = override?.faqHighlight || service.faqHighlight;
  const faqDescription = override?.faqDescription || service.faqDescription;

  const longDescription = override?.longDescription || service.longDescription;
  const overviewText = override?.overviewText || service.overviewText;

  const technologies = override?.technologies?.length ? override.technologies : service.technologies;
  const techTitle = override?.techTitle || service.techTitle;
  const techHighlight = override?.techHighlight || service.techHighlight;
  const techDescription = override?.techDescription || service.techDescription;

  const impactSection = override?.impactSection || service.impactSection;

  const teamTitle = override?.teamTitle || service.teamTitle;
  const teamHighlight = override?.teamHighlight || service.teamHighlight;
  const teamDescription = override?.teamDescription || service.teamDescription;

  const testimonialsTitle = override?.testimonialsTitle || service.testimonialsTitle;
  const testimonialsHighlight = override?.testimonialsHighlight || service.testimonialsHighlight;
  const testimonialsDescription = override?.testimonialsDescription || service.testimonialsDescription;

  const relatedProjectsTitle = override?.relatedProjectsTitle || service.relatedProjectsTitle;
  const relatedProjectsHighlight = override?.relatedProjectsHighlight || service.relatedProjectsHighlight;
  const relatedProjectsDescription = override?.relatedProjectsDescription || service.relatedProjectsDescription;

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

  const normalizeText = (value: unknown) => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  };

  const appendCityToText = (value: unknown) => {
    const trimmed = normalizeText(value);
    if (!trimmed) return undefined;
    if (trimmed.toLowerCase().includes(location.name.toLowerCase())) return trimmed;
    return `${trimmed} en ${location.name}`;
  };

  const serviceOutputName =
    typeof service.serviceOutput === "string"
      ? appendCityToText(service.serviceOutput)
      : appendCityToText(service.serviceOutput?.name);

  const serviceOutputDescription =
    typeof service.serviceOutput === "string" ? undefined : normalizeText(service.serviceOutput?.description);

  const serviceOutputSchemaType =
    typeof service.serviceOutput === "string" ? undefined : normalizeText(service.serviceOutput?.schemaType);

  const audienceName =
    typeof service.audience === "string"
      ? appendCityToText(service.audience)
      : appendCityToText(service.audience?.name);

  const audienceType =
    typeof service.audience === "string" ? undefined : normalizeText(service.audience?.audienceType);

  const audienceDescription =
    typeof service.audience === "string" ? undefined : normalizeText(service.audience?.description);

  const audienceSchemaType = typeof service.audience === "string" ? undefined : normalizeText(service.audience?.schemaType);

  const buildGeographicArea = () => {
    const getGeo = (coordinates: unknown) => {
      if (!coordinates || typeof coordinates !== "object") return undefined;
      const c = coordinates as { lat?: unknown; lng?: unknown };
      if (typeof c.lat !== "number" || typeof c.lng !== "number") return undefined;
      return {
        "@type": "GeoCoordinates",
        latitude: c.lat,
        longitude: c.lng,
      };
    };

    const buildCountrySpain = () => ({
      "@type": "Country",
      name: "España",
    });

    const resolvedProvince = location.province || location.parent?.province;
    const resolvedAutonomousCommunity = location.autonomousCommunity || location.parent?.autonomousCommunity;

    const buildAutonomousCommunityNode = () => {
      if (!resolvedAutonomousCommunity?.name) return undefined;
      const geo = getGeo(resolvedAutonomousCommunity.coordinates);
      return {
        "@type": "AdministrativeArea",
        name: resolvedAutonomousCommunity.name,
        ...(resolvedAutonomousCommunity.wikipediaUrl ? { sameAs: resolvedAutonomousCommunity.wikipediaUrl } : {}),
        ...(geo ? { geo } : {}),
        containedInPlace: buildCountrySpain(),
      };
    };

    const buildProvinceNode = () => {
      if (!resolvedProvince?.name) return undefined;
      const geo = getGeo(resolvedProvince.coordinates);
      const parent = buildAutonomousCommunityNode() || buildCountrySpain();
      return {
        "@type": "AdministrativeArea",
        name: resolvedProvince.name,
        ...(resolvedProvince.wikipediaUrl ? { sameAs: resolvedProvince.wikipediaUrl } : {}),
        ...(geo ? { geo } : {}),
        containedInPlace: parent,
      };
    };

    const buildAdminParentFallback = () => buildProvinceNode() || buildAutonomousCommunityNode() || buildCountrySpain();

    const buildParentCityNode = () => {
      if (!location.parent?.name) return undefined;
      return {
        "@type": "City",
        name: location.parent.name,
        ...(location.parent.slug ? { url: `${baseUrl}/${service.slug}/${location.parent.slug}` } : {}),
        containedInPlace: buildAdminParentFallback(),
      };
    };

    const geoCoordinates = getGeo(location.coordinates);
    const containedInPlace = buildParentCityNode() || buildAdminParentFallback();

    return {
      "@type": location.type === "town" ? "AdministrativeArea" : "City",
      name: location.name,
      ...(location.wikipediaUrl ? { sameAs: location.wikipediaUrl } : {}),
      ...(geoCoordinates ? { geo: geoCoordinates } : {}),
      containedInPlace,
    };
  };

  const localServiceSchema = {
    ...serviceSchema,
    areaServed: {
      ...buildGeographicArea(),
      ...(location.slug ? { url: `${baseUrl}/${service.slug}/${location.slug}` } : {}),
    },
    name: schemaName,
    description: heroDescription,
    image: localHeroImageAbsolute,
    ...(serviceOutputName
      ? {
          serviceOutput: {
            "@type": serviceOutputSchemaType || "WebApplication",
            name: serviceOutputName,
            ...(serviceOutputDescription ? { description: serviceOutputDescription } : {}),
          },
        }
      : {}),
  ...(audienceName || audienceType || audienceDescription
      ? {
          audience: {
            "@type": audienceSchemaType || "BusinessAudience",
            ...(audienceName ? { name: audienceName } : {}),
            ...(audienceType ? { audienceType } : {}),
            ...(audienceDescription ? { description: audienceDescription } : {}),
            geographicArea: buildGeographicArea(),
          },
        }
      : {}),
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

  const offerCatalogSchema = generatePricingOfferCatalogSchema(service.pricing, {
    baseUrl,
    organizationId,
    location: location.slug,
  });

  const localServiceSchemaWithCatalog = offerCatalogSchema
    ? { ...localServiceSchema, hasOfferCatalog: offerCatalogSchema }
    : localServiceSchema;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      localServiceSchemaWithCatalog,
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
        buttonText={heroButtonText}
        buttonLink={heroButtonLink}
        secondaryButtonText={heroSecondaryButtonText}
        secondaryButtonLink={heroSecondaryButtonLink}
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
        featuresTitle={featuresTitle}
        featuresHighlight={featuresHighlight}
        featuresDescription={featuresDescription}
        benefits={benefits} 
        process={processSteps} 
        processTitle={processTitle}
        processHighlight={processHighlight}
        processDescription={processDescription}
        
        // Fallbacks if local block not present
        longDescription={longDescription} 
        overviewText={overviewText} 
        
        technologies={technologies} 
        techTitle={techTitle}
        techHighlight={techHighlight}
        techDescription={techDescription}
        impactSection={impactSection} 
        team={service.team} 
        teamTitle={teamTitle}
        teamHighlight={teamHighlight}
        teamDescription={teamDescription}
        
        // Overridden Lists
        testimonials={testimonials} 
        testimonialsTitle={testimonialsTitle}
        testimonialsHighlight={testimonialsHighlight}
        testimonialsDescription={testimonialsDescription}
        
        // Pricing should eventually link to /planes?service=...&location=...
        pricing={service.pricing} // TODO: Adapt pricing button link in Phase 5
        
        relatedProjects={projects as any} // Cast to match type if needed
        relatedProjectsTitle={relatedProjectsTitle}
        relatedProjectsHighlight={relatedProjectsHighlight}
        relatedProjectsDescription={relatedProjectsDescription}
        
        faqs={faqs} 
        faqTitle={faqTitle}
        faqHighlight={faqHighlight}
        faqDescription={faqDescription}
        ctaSection={ctaSection}
        nearbyLocations={nearbyLocations}
        cityName={location.name}
        serviceSlug={service.slug}
      />

    </main>
  );
}
