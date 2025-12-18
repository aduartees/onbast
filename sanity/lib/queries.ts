export const SERVICES_QUERY = `*[_type == "service"] | order(_createdAt asc) {
  _id,
  title,
  "slug": slug.current,
  "description": shortDescription,
  icon,
  "imageUrl": mainImage.asset->url,
  colSpan
}`;

export const SERVICE_BY_SLUG_QUERY = `*[_type == "service" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
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
  team[]->{
    name,
    role,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    social
  },
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
  relatedProjects[]->{
    _id,
    title,
    description,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url,
    tags,
    link
  },
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
  "seoImage": seoImage.asset->url
}`;

export const PROJECTS_QUERY = `*[_type == "project"] | order(_createdAt desc)[0...3] {
  _id,
  title,
  description,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  tags,
  link
}`;

export const HOME_PAGE_QUERY = `*[_type == "homePage"][0] {
  hero,
  philosophy,
  techArsenal,
  services,
  projects,
  contact
}`;

export const SERVICES_PAGE_QUERY = `*[_type == "servicesPage"][0] {
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
  seoDescription
}`;

export const SETTINGS_QUERY = `*[_type == "settings"][0] {
  "agency": agencyInfo {
    name,
    email,
    address,
    socialProfiles,
    "logo": logo.asset->url
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
}`;

// Deprecated: FOOTER_QUERY is now part of SETTINGS_QUERY, but keeping for backward compatibility if needed temporarily
export const FOOTER_QUERY = SETTINGS_QUERY;

export const AGENCY_PAGE_QUERY = `*[_type == "agencyPage"][0] {
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
}`;

export const PROJECTS_PAGE_QUERY = `{
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
}`;

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0] {
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
}`;
