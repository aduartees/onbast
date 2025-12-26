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
  "allowedAddonIds": allowedAddons[].plan->buttonLinkID.current,
  "allowedAddons": allowedAddons[]{
    "id": plan->buttonLinkID.current,
    "title": plan->title,
    "price": coalesce(price, plan->price),
    "period": plan->period,
    "description": coalesce(description, plan->description)
  },
  buttonText,
  "buttonLinkID": buttonLinkID.current
}`);

export const SERVICES_QUERY = defineQuery(`*[_type == "service"] | order(_createdAt asc) {
  _id,
  title,
  "slug": slug.current,
  "description": shortDescription,
  additionalType,
  additionalTypes,
  serviceOutput { schemaType, name, description },
  audience { schemaType, name, audienceType, description },
  pricing { schemaAdditionalProperty[]{ name, value } },
  isCoreService,
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
  additionalType,
  additionalTypes,
  serviceOutput { schemaType, name, description },
  audience { schemaType, name, audienceType, description },
  pricing { schemaAdditionalProperty[]{ name, value } },
  isCoreService
}`);

export const SERVICE_BY_SLUG_QUERY = defineQuery(`*[_type == "service" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  additionalType,
  additionalTypes,
  serviceOutput { schemaType, name, description },
  audience { schemaType, name, audienceType, description },
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
  "testimonials": *[_type == "testimonial"] | order(_createdAt desc) {
    name,
    role,
    quote,
    "imageUrl": image.asset->url
  },
  pricing {
    title,
    subtitle,
    schemaAdditionalProperty[]{ name, value },
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
  "serviceLocations": *[_type == "location" && type == "city" && defined(slug.current)]
    | order(coalesce(population, 0) desc, name asc)[0...24] {
      name,
      "slug": slug.current,
      type
    }
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
    url,
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

export const PRIVACY_POLICY_PAGE_QUERY = defineQuery(`*[_type == "privacyPolicyPage"][0] {
  title,
  updatedAt,
  content[]{
    ...,
    _type == "image" => {
      ...,
      "url": asset->url
    }
  },
  "siteSettings": *[_type == "settings"][0] {
    "agency": agencyInfo {
      name,
      url,
      "logo": logo.asset->url
    }
  }
}`);

export const LEGAL_NOTICE_PAGE_QUERY = defineQuery(`*[_type == "legalNoticePage"][0] {
  title,
  updatedAt,
  content[]{
    ...,
    _type == "image" => {
      ...,
      "url": asset->url
    }
  },
  "siteSettings": *[_type == "settings"][0] {
    "agency": agencyInfo {
      name,
      url,
      "logo": logo.asset->url
    }
  }
}`);

export const COOKIES_PAGE_QUERY = defineQuery(`*[_type == "cookiesPage"][0] {
  title,
  updatedAt,
  content[]{
    ...,
    _type == "image" => {
      ...,
      "url": asset->url
    }
  },
  "siteSettings": *[_type == "settings"][0] {
    "agency": agencyInfo {
      name,
      url,
      "logo": logo.asset->url
    }
  }
}`);

export const TERMS_OF_SERVICE_PAGE_QUERY = defineQuery(`*[_type == "termsOfServicePage"][0] {
  title,
  updatedAt,
  content[]{
    ...,
    _type == "image" => {
      ...,
      "url": asset->url
    }
  },
  seo {
    title,
    description
  },
  "siteSettings": *[_type == "settings"][0] {
    "agency": agencyInfo {
      name,
      url,
      "logo": logo.asset->url
    }
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
  "coreServices": *[_type == "service" && isCoreService == true] | order(_createdAt asc)[0...8] {
    title,
    additionalType,
    additionalTypes
  },
  "fallbackServices": *[_type == "service" && (defined(additionalType) || count(additionalTypes) > 0)] | order(_createdAt asc)[0...8] {
    title,
    additionalType,
    additionalTypes
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

export const SERVICE_LOCATION_STATIC_PARAMS_QUERY = defineQuery(`*[_type == "serviceLocation" && defined(service->slug.current) && defined(location->slug.current) && !(_id in path("drafts.**"))]{
  "serviceSlug": service->slug.current,
  "citySlug": location->slug.current
}`);

export const SERVICE_LOCATION_PAGE_QUERY = defineQuery(`{
  "service": *[_type == "service" && slug.current == $serviceSlug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    "slug": slug.current,
    additionalType,
    additionalTypes,
    serviceOutput { schemaType, name, description },
    audience { schemaType, name, audienceType, description },
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
    "testimonials": *[_type == "testimonial"] | order(_createdAt desc) {
      name,
      role,
      quote,
      "imageUrl": image.asset->url
    },
    pricing {
      title,
      subtitle,
      schemaAdditionalProperty[]{ name, value },
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
  "location": *[_type == "location" && slug.current == $citySlug && !(_id in path("drafts.**"))][0] {
    _id,
    name,
    "slug": slug.current,
    type,
    province->{
      name,
      "slug": slug.current,
      coordinates,
      wikipediaUrl
    },
    autonomousCommunity->{
      name,
      "slug": slug.current,
      coordinates,
      wikipediaUrl
    },
    population,
    gentilicio,
    geoContext,
    coordinates,
    altitude,
    wikipediaUrl,
    "nearbyLocations": nearbyLocations[]-> {
      name,
      "slug": slug.current,
      type
    },
    "parentRef": parent._ref,
    parent->{
      name,
      "slug": slug.current,
      province->{
        name,
        "slug": slug.current,
        coordinates,
        wikipediaUrl
      },
      autonomousCommunity->{
        name,
        "slug": slug.current,
        coordinates,
        wikipediaUrl
      }
    }
  },
  "override": *[_type == "serviceLocation" && service->slug.current == $serviceSlug && location->slug.current == $citySlug && !(_id in path("drafts.**"))][0] {
    seoTitle,
    seoDescription,
    heroHeadline,
    heroText,
    heroButtonText,
    heroButtonLink,
    heroSecondaryButtonText,
    heroSecondaryButtonLink,
    longDescription,
    overviewText,
    featuresTitle,
    featuresHighlight,
    featuresDescription,
    benefits,
    processTitle,
    processHighlight,
    processDescription,
    techTitle,
    techHighlight,
    techDescription,
    technologies,
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
    pricingTitle,
    pricingSubtitle,
    pricingTrustedCompaniesTitle,
    pricingSchemaAdditionalProperty[]{
      name,
      value
    },
    teamTitle,
    teamHighlight,
    teamDescription,
    testimonialsTitle,
    testimonialsHighlight,
    testimonialsDescription,
    relatedProjectsTitle,
    relatedProjectsHighlight,
    relatedProjectsDescription,
    faqTitle,
    faqHighlight,
    faqDescription,
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
  "nearbyLocations": select(
    count(*[_type == "location" && slug.current == $citySlug][0].nearbyLocations) > 0 =>
      *[_type == "location" && slug.current == $citySlug][0].nearbyLocations[]-> {
        _id,
        name,
        "slug": slug.current,
        type
      }[slug != $citySlug && count(*[_type == "serviceLocation" && service->slug.current == $serviceSlug && location._ref == ^._id && !(_id in path("drafts.**"))]) > 0][0...12],
    *[_type == "location" && slug.current == $citySlug][0].type == "city" =>
      *[_type == "location" && type == "town" && parent._ref == *[_type == "location" && slug.current == $citySlug][0]._id]
        | order(coalesce(population, 0) desc, name asc) {
          _id,
          name,
          "slug": slug.current,
          type
        }[count(*[_type == "serviceLocation" && service->slug.current == $serviceSlug && location._ref == ^._id && !(_id in path("drafts.**"))]) > 0][0...12],
    *[_type == "location" && slug.current == $citySlug][0].type == "town" =>
      array::compact([
        *[_type == "location" && slug.current == $citySlug][0].parent-> {
          _id,
          name,
          "slug": slug.current,
          type
        },
        ...*[_type == "location" && type == "town" && parent._ref == *[_type == "location" && slug.current == $citySlug][0].parent._ref && slug.current != $citySlug]
          | order(coalesce(population, 0) desc, name asc)[0...11] {
            _id,
            name,
            "slug": slug.current,
            type
          }
      ])[count(*[_type == "serviceLocation" && service->slug.current == $serviceSlug && location._ref == _id && !(_id in path("drafts.**"))]) > 0][0...12],
    []
  )
}`);

export const ALL_SERVICES_AND_LOCATIONS_QUERY = defineQuery(`{
  "services": *[_type == "service"] { "slug": slug.current },
  "locations": *[_type == "location"] { "slug": slug.current }
}`);
