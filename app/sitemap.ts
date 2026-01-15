import type { MetadataRoute } from "next";

import { client } from "@/sanity/lib/client";
import { getBaseUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

type StaticUpdatedAt = {
  home?: string;
  agency?: string;
  services?: string;
  projects?: string;
  contact?: string;
  privacy?: string;
  cookies?: string;
  legalNotice?: string;
  terms?: string;
};

type SanitySlugDoc = {
  slug?: string;
  _updatedAt?: string;
};

type SanityServiceLocationDoc = {
  serviceSlug?: string;
  citySlug?: string;
  _updatedAt?: string;
};

const STATIC_UPDATED_AT_QUERY = `{
  "home": *[_type == "homePage"][0]._updatedAt,
  "agency": *[_type == "agencyPage"][0]._updatedAt,
  "services": *[_type == "servicesPage"][0]._updatedAt,
  "projects": *[_type == "projectsPage"][0]._updatedAt,
  "contact": *[_type == "contactPage"][0]._updatedAt,
  "privacy": *[_type == "privacyPolicyPage"][0]._updatedAt,
  "cookies": *[_type == "cookiesPage"][0]._updatedAt,
  "legalNotice": *[_type == "legalNoticePage"][0]._updatedAt,
  "terms": *[_type == "termsOfServicePage"][0]._updatedAt
}`;

const SERVICES_SLUGS_QUERY = `*[_type == "service" && defined(slug.current) && !(_id in path("drafts.**"))]{
  "slug": slug.current,
  _updatedAt
}`;

const SERVICE_LOCATION_SLUGS_QUERY = `*[_type == "serviceLocation" && defined(service->slug.current) && defined(location->slug.current) && !(_id in path("drafts.**"))]{
  "serviceSlug": service->slug.current,
  "citySlug": location->slug.current,
  _updatedAt
}`;

const toDate = (value: string | undefined) => {
  const d = value ? new Date(value) : new Date();
  return Number.isNaN(d.getTime()) ? new Date() : d;
};

const maxDate = (a?: string, b?: string) => {
  const da = toDate(a);
  const db = toDate(b);
  return da.getTime() >= db.getTime() ? da : db;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const [staticUpdatedAt, services, serviceLocations] = await Promise.all([
    client.fetch<StaticUpdatedAt>(STATIC_UPDATED_AT_QUERY, {}, { cache: "no-store" }),
    client.fetch<SanitySlugDoc[]>(SERVICES_SLUGS_QUERY, {}, { cache: "no-store" }),
    client.fetch<SanityServiceLocationDoc[]>(SERVICE_LOCATION_SLUGS_QUERY, {}, { cache: "no-store" }),
  ]);

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: toDate(staticUpdatedAt?.home),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/agencia`,
      lastModified: toDate(staticUpdatedAt?.agency),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: toDate(staticUpdatedAt?.services),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/proyectos`,
      lastModified: toDate(staticUpdatedAt?.projects),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: toDate(staticUpdatedAt?.contact),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/planes`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/politica-de-privacidad`,
      lastModified: toDate(staticUpdatedAt?.privacy),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/aviso-legal`,
      lastModified: toDate(staticUpdatedAt?.legalNotice),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: toDate(staticUpdatedAt?.cookies),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/condiciones-del-servicio`,
      lastModified: toDate(staticUpdatedAt?.terms),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  for (const service of services) {
    if (!service?.slug) continue;
    entries.push({
      url: `${baseUrl}/servicios/${service.slug}`,
      lastModified: toDate(service._updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  const seen = new Set<string>();
  for (const pair of serviceLocations) {
    if (!pair?.serviceSlug || !pair?.citySlug) continue;
    const url = `${baseUrl}/${pair.serviceSlug}/${pair.citySlug}`;
    if (seen.has(url)) continue;
    seen.add(url);
    entries.push({
      url,
      lastModified: toDate(pair._updatedAt),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}
