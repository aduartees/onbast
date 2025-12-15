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
  problem,
  solution,
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  heroButtonText,
  heroButtonLink,
  heroHeadline,
  heroIntroduction,
  "heroTrustedLogos": heroTrustedLogos[] {
    name,
    "logo": logo.asset->url
  },
  icon,
  featuresTitle,
  features[] {
    title,
    description,
    icon
  },
  benefits,
  processTitle,
  process[] {
    title,
    description,
    "imageUrl": image.asset->url
  },
  impactSection {
    title,
    cards[] {
      title,
      description,
      colSpan,
      minHeight,
      "imageUrl": backgroundImage.asset->url,
      "imageAlt": backgroundImage.alt,
      color
    }
  },
  technologies,
  teamTitle,
  team[]->{
    name,
    role,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    social
  },
  testimonialsTitle,
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
    addon {
      title,
      price,
      active
    },
    "trustedLogos": trustedLogos[].asset->url
  },
  faqTitle,
  faqs[] {
    question,
    answer
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
