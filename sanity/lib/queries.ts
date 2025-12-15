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
  "imageAlt": mainImage.alt,
  heroButtonText,
  heroButtonLink,
  heroHeadline,
  heroIntroduction,
  "heroTrustedLogos": *[_type == "settings"][0].trustedLogos[] {
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
  featuresDescription,
  features[] {
    title,
    description,
    icon
  },
  benefits,
  processTitle,
  processDescription,
  process[] {
    title,
    description
  },
  impactSection {
    title,
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
  techDescription,
  technologies,
  teamTitle,
  teamDescription,
  team[]->{
    name,
    role,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    social
  },
  testimonialsTitle,
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
    "trustedLogos": trustedLogos[].asset->url
  },
  faqTitle,
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
  seoDescription
}`;

export const PROJECTS_QUERY = `*[_type == "project"] | order(_createdAt desc) {
  _id,
  title,
  description,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  tags,
  link
}`;
