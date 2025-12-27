import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { SERVICE_LOCATION_PAGE_QUERY, SERVICE_LOCATION_STATIC_PARAMS_QUERY } from "@/sanity/lib/queries";
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
  pricingTitle?: string;
  pricingSubtitle?: string;
  pricingTrustedCompaniesTitle?: string;
  pricingSchemaAdditionalProperty?: { name?: string; value?: string }[];
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
  const pairs = await client.fetch<{ serviceSlug: string; citySlug: string }[]>(
    SERVICE_LOCATION_STATIC_PARAMS_QUERY,
    {},
    { next: { revalidate: 3600 } }
  );

  return Array.isArray(pairs)
    ? pairs
        .filter((p) => typeof p?.serviceSlug === "string" && typeof p?.citySlug === "string")
        .map((p) => ({ serviceSlug: p.serviceSlug, citySlug: p.citySlug }))
    : [];
}

// --- Dynamic Metadata ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serviceSlug, citySlug } = await params;
  const data: QueryResult = await client.fetch(SERVICE_LOCATION_PAGE_QUERY, { serviceSlug, citySlug });

  if (!data?.service || !data?.location || !data?.override) {
    return {
      title: "Página No Encontrada - ONBAST",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { service, location, override } = data;
  const baseUrlRaw = process.env.NEXT_PUBLIC_URL || "https://www.onbast.com";
  const baseUrl = typeof baseUrlRaw === "string" ? baseUrlRaw.replace(/\/+$/, "") : "https://www.onbast.com";

  // Logic: Override > Constructed > Default
  const metaTitle = override?.seoTitle || `${service.title} en ${location.name} | ONBAST`;
  const metaDescription = override?.seoDescription || `Servicios profesionales de ${service.title} en ${location.name}. Suscripciones adaptadas a la economía local. Auténticos profesionales de ${service.title} en ${location.name}. `;
  const shareImage = `${baseUrl}/api/og?title=${encodeURIComponent(`${service.title} en ${location.name}`)}&subtitle=${encodeURIComponent("ONBAST | WEB, SEO & GEO")}`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `${baseUrl}/${service.slug}/${location.slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${baseUrl}/${service.slug}/${location.slug}`,
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

  if (!data?.service || !data?.location || !data?.override) return notFound();

  const { service, location, override } = data;

  const baseUrlRaw = process.env.NEXT_PUBLIC_URL || "https://www.onbast.com";
  const baseUrl = typeof baseUrlRaw === "string" ? baseUrlRaw.replace(/\/+$/, "") : "https://www.onbast.com";
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

  const pricing = (() => {
    const base = service.pricing || {};
    const schemaAdditionalProperty = override?.pricingSchemaAdditionalProperty?.length
      ? override.pricingSchemaAdditionalProperty
      : base.schemaAdditionalProperty;

    return {
      ...base,
      ...(override?.pricingTitle ? { title: override.pricingTitle } : {}),
      ...(override?.pricingSubtitle ? { subtitle: override.pricingSubtitle } : {}),
      ...(override?.pricingTrustedCompaniesTitle
        ? { trustedCompaniesTitle: override.pricingTrustedCompaniesTitle }
        : {}),
      ...(schemaAdditionalProperty ? { schemaAdditionalProperty } : {}),
    };
  })();
  
  // Testimonials: Local > Service
  const baseTestimonials = override?.customTestimonials?.length ? override.customTestimonials : service.testimonials;

  const pickTestimonialIndicesForCity = (count: number, seed: string, k = 2) => {
    if (!Number.isFinite(count) || count <= 0) return new Set<number>();
    const target = Math.max(0, Math.min(k, Math.floor(count)));
    if (target === 0) return new Set<number>();
    if (target >= count) return new Set(Array.from({ length: count }, (_, i) => i));

    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    h >>>= 0;

    const out = new Set<number>();
    for (let i = 0; out.size < target && i < count * 3; i++) {
      const base = (h + Math.imul(i + 1, 2654435761)) >>> 0;
      let idx = base % count;
      while (out.has(idx)) idx = (idx + 1) % count;
      out.add(idx);
    }
    return out;
  };

  const appendCityToRole = (value: unknown) => {
    if (typeof value !== "string") return value as any;
    const trimmed = value.trim();
    if (!trimmed) return trimmed;
    if (trimmed.toLowerCase().includes(location.name.toLowerCase())) return trimmed;
    return `${trimmed} (${location.name})`;
  };

  const cityRoleIndices = pickTestimonialIndicesForCity(
    Array.isArray(baseTestimonials) ? baseTestimonials.length : 0,
    `${service.slug}:${location.slug}`,
    2
  );

  const testimonials = Array.isArray(baseTestimonials)
    ? baseTestimonials.map((t: any, idx: number) => {
        if (!cityRoleIndices.has(idx)) return t;
        return {
          ...t,
          role: appendCityToRole(t?.role),
        };
      })
    : baseTestimonials;

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

  const nearbyLocations = data.nearbyLocations?.length ? data.nearbyLocations : [];

  // --- Schema Generation ---
  // We need to generate Service schema but with AreaServed
  const serviceSchema = generateServiceSchema({ ...service, pricing }, service.agency);
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

  const audienceType = typeof service.audience === "string" ? undefined : normalizeText(service.audience?.audienceType);
  const audienceDescription = typeof service.audience === "string" ? undefined : normalizeText(service.audience?.description);
  const audienceSchemaType = typeof service.audience === "string" ? undefined : normalizeText(service.audience?.schemaType);

  const localLandingUrl = `${baseUrl}/${service.slug}/${location.slug}`;
  const genericServiceUrl = `${baseUrl}/servicios/${service.slug}`;

  const buildGeographicArea = () => {
    const normalizeName = (value: unknown) => {
      if (typeof value !== "string") return "";
      return value.trim().toLowerCase();
    };

    const canonicalizeAdminName = (value: unknown) => {
      if (typeof value !== "string") return "";
      const raw = value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/\s+/g, " ");

      const prefixes = [
        "principado de ",
        "principado del ",
        "comunidad autonoma de ",
        "comunidad autonoma del ",
        "comunidad foral de ",
        "comunidad foral del ",
        "comunidad de ",
        "comunidad del ",
        "region de ",
        "region del ",
        "provincia de ",
        "provincia del ",
      ];

      const hit = prefixes.find((p) => raw.startsWith(p));
      const stripped = hit ? raw.slice(hit.length) : raw;
      return stripped.trim();
    };

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

    const sameAdminName =
      canonicalizeAdminName(resolvedProvince?.name) &&
      canonicalizeAdminName(resolvedAutonomousCommunity?.name) &&
      canonicalizeAdminName(resolvedProvince?.name) === canonicalizeAdminName(resolvedAutonomousCommunity?.name);

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
      if (sameAdminName) return undefined;
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

    const buildAdministrativeArea = () => {
      if (sameAdminName) return buildAutonomousCommunityNode() || buildCountrySpain();
      return buildProvinceNode() || buildAutonomousCommunityNode() || buildCountrySpain();
    };

    const isAdministrativeLocation = () => {
      const name = normalizeName(location.name);
      const provinceName = normalizeName(location.province?.name);
      const autonomousCommunityName = normalizeName(location.autonomousCommunity?.name);
      return Boolean((provinceName && provinceName === name) || (autonomousCommunityName && autonomousCommunityName === name));
    };

    const isAdministrativeParent = () => {
      if (!location.parent?.name) return false;
      const parentName = normalizeName(location.parent.name);
      const provinceName = normalizeName(location.parent.province?.name);
      const autonomousCommunityName = normalizeName(location.parent.autonomousCommunity?.name);
      return Boolean(
        (provinceName && provinceName === parentName) ||
          (autonomousCommunityName && autonomousCommunityName === parentName) ||
          (normalizeName(resolvedProvince?.name) && parentName === normalizeName(resolvedProvince?.name)) ||
          (normalizeName(resolvedAutonomousCommunity?.name) && parentName === normalizeName(resolvedAutonomousCommunity?.name))
      );
    };

    const buildParentCityNode = () => {
      if (!location.parent?.name) return undefined;
      if (isAdministrativeParent()) return undefined;
      return {
        "@type": "City",
        name: location.parent.name,
        ...(location.parent.slug ? { url: `${baseUrl}/${service.slug}/${location.parent.slug}` } : {}),
        containedInPlace: buildAdministrativeArea(),
      };
    };

    const geoCoordinates = getGeo(location.coordinates);

    if (isAdministrativeLocation()) {
      const admin = buildAdministrativeArea();
      const adminContainedInPlace =
        admin && typeof admin === "object" && "containedInPlace" in admin
          ? (admin as { containedInPlace?: unknown }).containedInPlace
          : undefined;
      return {
        "@type": "AdministrativeArea",
        name: location.name,
        ...(location.wikipediaUrl ? { sameAs: location.wikipediaUrl } : {}),
        ...(geoCoordinates ? { geo: geoCoordinates } : {}),
        containedInPlace: adminContainedInPlace || buildCountrySpain(),
      };
    }

    const containedInPlace = buildParentCityNode() || buildAdministrativeArea();

    return {
      "@type": "City",
      name: location.name,
      ...(location.wikipediaUrl ? { sameAs: location.wikipediaUrl } : {}),
      ...(geoCoordinates ? { geo: geoCoordinates } : {}),
      containedInPlace,
    };
  };

  const localServiceSchema = {
    ...serviceSchema,
    url: localLandingUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": localLandingUrl,
      url: localLandingUrl,
    },
    isRelatedTo: {
      "@type": "Service",
      url: genericServiceUrl,
      name: service.title,
    },
    areaServed: {
      ...buildGeographicArea(),
      url: localLandingUrl,
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
    { name: "Inicio", item: `${baseUrl}/` },
    { name: "Servicios", item: `${baseUrl}/servicios` },
    { name: service.title, item: `${baseUrl}/servicios/${service.slug}` },
  ];

  if (location.parent) {
     // If it's a town, add parent city
     // Check if parent slug is available. In query we fetched parent->slug
     if (location.parent.slug) {
        breadcrumbs.push({ name: location.parent.name, item: `${baseUrl}/${service.slug}/${location.parent.slug}` });
     }
  }

  breadcrumbs.push({ name: location.name, item: `${baseUrl}/${service.slug}/${location.slug}` });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const offerCatalogSchema = generatePricingOfferCatalogSchema(pricing, {
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
        pricing={pricing} // TODO: Adapt pricing button link in Phase 5
        
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
