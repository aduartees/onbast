import { defineQuery } from "next-sanity";

export const PRICING_PLANS_QUERY = defineQuery(`*[_type == "pricingPlan"] | order(price asc) {
  title,
  price,
  currency,
  period,
  badge,
  description,
  features,
  addon,
  buttonText,
  "buttonLinkID": buttonLinkID.current
}`);

export const PRICING_ADDONS_QUERY = defineQuery(`*[_type == "pricingAddon"] | order(title asc) {
  title,
  price,
  description,
  "id": id.current
}`);

export const SERVICES_QUERY = defineQuery(`*[_type == "service"] | order(_createdAt asc) {
  _id,
  title,
  "slug": slug.current,
  "description": shortDescription,
  additionalType,
  icon,
  "imageUrl": mainImage.asset->url,
  colSpan
}`);

export const HOME_SERVICES_SCHEMA_QUERY = defineQuery(`*[_type == "service"] | order(_createdAt asc) {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  seoDescription,
  "seoImage": seoImage.asset->url,
  "imageUrl": mainImage.asset->url,
  additionalType
}`);

export const SERVICE_BY_SLUG_QUERY = defineQuery(`*[_type == "service" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  additionalType,
  shortDescription,
  longDescription,
  overviewText,
  "imageUrl": mainImage.asset->url,
  "imageName": mainImage.asset->originalFilename,
  "imageAlt": mainImage.alt,
  heroButtonText,
  heroButtonLink,
  heroSecondaryButtonText,
  heroSecondaryButtonLink,
  heroHeadline,
  heroHighlight,
  heroIntroduction,
  "heroTrustedLogos": *[_type == "settings"] | order(_updatedAt desc)[0].trustedLogos[] {
    name,
    "logo": logo.asset->url,
    "alt": logo.alt
  },
  "agency": *[_type == "settings"][0].agencyInfo {
    name,
    url,
    description,
    "logo": logo.asset->url,
    email,
    phone,
    address,
    socialProfiles
  },
  icon,
  featuresTitle,
  featuresHighlight,
  featuresDescription,
  features[] {
    title,
    description,
    icon
  },
  benefits,
  processTitle,
  processHighlight,
  processDescription,
  process[] {
    title,
    description
  },
  impactSection {
    title,
    highlight,
    subtitle,
    stats[] {
      value,
      prefix,
      suffix,
      label,
      description
    }
  },
  techTitle,
  techHighlight,
  techDescription,
  technologies,
  teamTitle,
  teamHighlight,
  teamDescription,
  "team": select(
    count(team) > 0 => team[]->{
      name,
      role,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      social
    },
    *[_type == "teamMember"] | order(_createdAt asc) {
      name,
      role,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      social
    }
  ),
  testimonialsTitle,
  testimonialsHighlight,
  testimonialsDescription,
  testimonials[]->{
    name,
    role,
    quote,
    "imageUrl": image.asset->url
  },
  pricing {
    title,
    subtitle,
    "plans": plans[]->{
      title,
      price,
      currency,
      period,
      badge,
      description,
      features,
      addon,
      buttonText,
      "buttonLinkID": buttonLinkID.current
    },
    trustedCompaniesTitle,
    "trustedLogos": trustedLogos[] {
        "logo": image.asset->url,
        name
    }
  },
  relatedProjectsTitle,
  relatedProjectsHighlight,
  relatedProjectsDescription,
  "relatedProjects": select(
    count(relatedProjects) > 0 => relatedProjects[]->{
      _id,
      title,
      description,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url,
      tags,
      link
    },
    *[_type == "project"] | order(_createdAt desc)[0...3] {
      _id,
      title,
      description,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url,
      tags,
      link
    }
  ),
  faqTitle,
  faqHighlight,
  faqDescription,
  faqs[] {
    question,
    answer
  },
  ctaSection {
    title,
    description,
    buttonText,
    buttonLink,
    secondaryButtonText,
    secondaryButtonLink
  },
  seoTitle,
  seoDescription,
  "seoImage": seoImage.asset->url,
  "serviceLocations": array::unique(*[_type == "serviceLocation" && service->slug.current == $slug].location-> [type == "city"] {
    name,
    "slug": slug.current,
    type
  })
}`);

export const PROJECTS_QUERY = defineQuery(`*[_type == "project"] | order(_createdAt desc)[0...3] {
  _id,
  title,
  description,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  tags,
  link
}`);

export const HOME_PAGE_QUERY = defineQuery(`*[_type == "homePage"][0] {
  hero,
  philosophy,
  techArsenal,
  services,
  projects,
  contact,
  "siteSettings": *[_type == "settings"][0] {
    "agency": agencyInfo {
      name,
      email,
      phone,
      address,
      socialProfiles,
      "logo": logo.asset->url
    }
  }
}`);

export const SERVICES_PAGE_QUERY = defineQuery(`*[_type == "servicesPage"][0] {
  hero,
  catalog,
  tech {
    pill,
    title,
    highlight,
    description,
    stackCards[] {
      title,
      description,
      icon,
      "imageUrl": image.asset->url
    }
  },
  featuredProjects {
    pill,
    title,
    highlight,
    description,
    projects[]->{
      _id,
      title,
      description,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url,
      tags,
      link
    }
  },
  cta,
  seoTitle,
  seoDescription,
  "siteSettings": *[_type == "settings"][0] {
    "agency": agencyInfo {
      name,
      email,
      phone,
      address,
      socialProfiles,
      "logo": logo.asset->url
    }
  }
}`);

export const SETTINGS_QUERY = defineQuery(`*[_type == "settings"][0] {
  "agency": agencyInfo {
    name,
    email,
    address,
    socialProfiles,
    "logo": logo.asset->url,
    phone,
    "whatsapp": *[_type == "contactPage"][0].contactInfo.whatsapp,
  },
  header {
    logoText,
    menuItems[] {
      label,
      url,
      submenu[] {
        label,
        url,
        description
      }
    },
    ctaButton {
      text,
      url
    }
  },
  footer {
    brandText,
    socialLinks,
    columns[] {
      title,
      links[] {
        label,
        url
      }
    },
    copyrightText
  }
}`);

// Deprecated: FOOTER_QUERY is now part of SETTINGS_QUERY, but keeping for backward compatibility if needed temporarily
export const FOOTER_QUERY = SETTINGS_QUERY;

export const AGENCY_PAGE_QUERY = defineQuery(`*[_type == "agencyPage"][0] {
  hero {
    title,
    headline,
    highlight,
    description,
    "imageUrl": image.asset->url
  },
  history {
    title,
    highlight,
    description,
    "imageUrl": image.asset->url
  },
  methodology {
    title,
    highlight,
    description,
    steps[] {
      title,
      description
    }
  },
  teamSection {
    title,
    highlight,
    description,
    members[]->{
      name,
      role,
      "imageUrl": image.asset->url,
      social
    }
  },
  location {
    title,
    highlight,
    description,
    "imageUrl": image.asset->url,
    address,
    coordinates,
    googleMapsUrl
  },
  projects {
    title,
    highlight,
    description,
    selectedProjects[]->{
      _id,
      title,
      description,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url,
      tags,
      link
    }
  },
  testimonials {
    title,
    highlight,
    description,
    selectedTestimonials[]->{
      name,
      role,
      quote,
      "imageUrl": image.asset->url
    }
  },
  cta {
    title,
    description,
    buttonText,
    buttonLink
  },
  seo {
    title,
    description,
    "image": image.asset->url
  },
  "siteSettings": *[_type == "settings"][0] {
    "agency": agencyInfo {
      name,
      email,
      phone,
      address,
      socialProfiles,
      "logo": logo.asset->url
    }
  }
}`);

export const PROJECTS_PAGE_QUERY = defineQuery(`{
  "page": *[_type == "projectsPage"][0] {
    hero,
    clients {
      title,
      highlight,
      description,
      "logos": logos[] {
        name,
        "logo": logo.asset->url
      }
    },
    impact {
      title,
      highlight,
      description,
      stats[] {
        value,
        label,
        suffix
      }
    },
    gallery {
      title,
      subtitle,
      highlight,
      description
    },
    process {
      title,
      highlight,
      description,
      steps[] {
        title,
        description
      }
    },
    faq {
      title,
      highlight,
      description,
      questions[] {
        question,
        answer
      }
    },
    seo {
      title,
      description,
      "image": image.asset->url
    },
    cta
  },
  "projects": *[_type == "project"] | order(_createdAt desc)[0...9] {
    _id,
    title,
    description,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url,
    tags,
    link
  },
  "siteSettings": *[_type == "settings"][0] {
    "agency": agencyInfo {
      name,
      email,
      phone,
      address,
      socialProfiles,
      "logo": logo.asset->url
    }
  }
}`);

export const CONTACT_PAGE_QUERY = defineQuery(`*[_type == "contactPage"][0] {
  hero {
    title,
    headline,
    highlight,
    description
  },
  contactInfo {
    email,
    phone,
    whatsapp,
    schedule,
    location
  },
  formTopics,
  faq {
    title,
    highlight,
    description,
    questions[] {
      question,
      answer
    }
  },
  cta {
    title,
    description,
    buttonText,
    buttonLink
  },
  seo {
    title,
    description,
    "image": image.asset->url
  },
  "siteSettings": *[_type == "settings"][0] {
    "agency": agencyInfo {
      name,
      email,
      phone,
      address,
      socialProfiles,
      "logo": logo.asset->url
    }
  }
}`);

// --- GEO STRATEGY QUERIES ---

export const SERVICE_LOCATION_PAGE_QUERY = defineQuery(`{
  "service": *[_type == "service" && slug.current == $serviceSlug][0] {
    _id,
    title,
    "slug": slug.current,
    additionalType,
    shortDescription,
    longDescription,
    overviewText,
    "imageUrl": mainImage.asset->url,
    "imageName": mainImage.asset->originalFilename,
    "imageAlt": mainImage.alt,
    heroButtonText,
    heroButtonLink,
    heroSecondaryButtonText,
    heroSecondaryButtonLink,
    heroHeadline,
    heroHighlight,
    heroIntroduction,
    "heroTrustedLogos": *[_type == "settings"] | order(_updatedAt desc)[0].trustedLogos[] {
      name,
      "logo": logo.asset->url,
      "alt": logo.alt
    },
    icon,
    featuresTitle,
    featuresHighlight,
    featuresDescription,
    features[] {
      title,
      description,
      icon
    },
    benefits,
    processTitle,
    processHighlight,
    processDescription,
    process[] {
      title,
      description
    },
    impactSection {
      title,
      highlight,
      subtitle,
      stats[] {
        value,
        prefix,
        suffix,
        label,
        description
      }
    },
    techTitle,
    techHighlight,
    techDescription,
    technologies,
    teamTitle,
    teamHighlight,
    teamDescription,
    "team": select(
      count(team) > 0 => team[]->{
        name,
        role,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        social
      },
      *[_type == "teamMember"] | order(_createdAt asc) {
        name,
        role,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        social
      }
    ),
    testimonialsTitle,
    testimonialsHighlight,
    testimonialsDescription,
    testimonials[]->{
      name,
      role,
      quote,
      "imageUrl": image.asset->url
    },
    pricing {
      title,
      subtitle,
      badge,
      price,
      period,
      description,
      buttonText,
      buttonLink,
      secondaryButtonText,
      secondaryButtonLink,
      features,
      addon,
      trustedCompaniesTitle,
      "trustedLogos": trustedLogos[] {
          "logo": image.asset->url,
          name
      }
    },
    relatedProjectsTitle,
    relatedProjectsHighlight,
    relatedProjectsDescription,
    "relatedProjects": select(
      count(relatedProjects) > 0 => relatedProjects[]->{
        _id,
        title,
        description,
        "slug": slug.current,
        "imageUrl": mainImage.asset->url,
        tags,
        link
      },
      *[_type == "project"] | order(_createdAt desc)[0...3] {
        _id,
        title,
        description,
        "slug": slug.current,
        "imageUrl": mainImage.asset->url,
        tags,
        link
      }
    ),
    faqTitle,
    faqHighlight,
    faqDescription,
    faqs[] {
      question,
      answer
    },
    ctaSection {
      title,
      description,
      buttonText,
      buttonLink,
      secondaryButtonText,
      secondaryButtonLink
    },
    "agency": *[_type == "settings"][0].agencyInfo {
      name,
      url,
      description,
      "logo": logo.asset->url,
      email,
      phone,
      address,
      socialProfiles
    }
  },
  "location": *[_type == "location" && slug.current == $citySlug][0] {
    _id,
    name,
    "slug": slug.current,
    type,
    population,
    gentilicio,
    geoContext,
    coordinates,
    wikipediaUrl,
    "parentRef": parent._ref,
    parent->{
      name,
      "slug": slug.current
    }
  },
  "override": *[_type == "serviceLocation" && service->slug.current == $serviceSlug && location->slug.current == $citySlug][0] {
    seoTitle,
    seoDescription,
    heroHeadline,
    heroText,
    localContentBlock,
    ctaSection {
      title,
      description,
      buttonText,
      buttonLink,
      secondaryButtonText,
      secondaryButtonLink
    },
    customFeatures[] {
      title,
      description,
      icon
    },
    customProcess[] {
      title,
      description
    },
    customFaqs[] {
      question,
      answer
    },
    customTestimonials[]->{
      name,
      role,
      quote,
      "imageUrl": image.asset->url
    },
    customProjects[]->{
      title,
      description,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url,
      tags
    }
  },
  "nearbyLocations": *[_type == "location" && slug.current != $citySlug && (
    // Caso 1: Si la ubicación actual es hija (tiene parentRef), mostrar hermanos (mismo padre)
    (defined(^.location.parentRef) && defined(parent) && parent._ref == ^.location.parentRef) ||
    // Caso 2: Si la ubicación actual es hija (tiene parentRef), incluir su padre
    (defined(^.location.parentRef) && _id == ^.location.parentRef) ||
    // Caso 3: Si la ubicación actual es padre (no tiene parentRef), mostrar hijos
    (!defined(^.location.parentRef) && defined(parent) && parent._ref == ^.location._id)
  )][0...12] {
    name,
    "slug": slug.current,
    type
  }
}`);

export const ALL_SERVICES_AND_LOCATIONS_QUERY = defineQuery(`{
  "services": *[_type == "service"] { "slug": slug.current },
  "locations": *[_type == "location"] { "slug": slug.current }
}`);
