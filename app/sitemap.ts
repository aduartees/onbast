import type { MetadataRoute } from "next";

import { client } from "@/sanity/lib/client";

export const revalidate = 3600;

type StaticUpdatedAt = {
  home?: string;
  agency?: string;
  services?: string;
  projects?: string;
  contact?: string;
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

type SanityLocationSlugDoc = {
  slug?: string;
  _updatedAt?: string;
};

const STATIC_UPDATED_AT_QUERY = `{
  "home": *[_type == "homePage"][0]._updatedAt,
  "agency": *[_type == "agencyPage"][0]._updatedAt,
  "services": *[_type == "servicesPage"][0]._updatedAt,
  "projects": *[_type == "projectsPage"][0]._updatedAt,
  "contact": *[_type == "contactPage"][0]._updatedAt
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

const CITY_SLUGS_QUERY = `*[_type == "location" && type == "city" && defined(slug.current) && !(_id in path("drafts.**"))]{
  "slug": slug.current,
  _updatedAt
}`;

const getBaseUrl = (fallback = "https://onbast.com") => {
  const raw = process.env.NEXT_PUBLIC_URL;
  const value = typeof raw === "string" && raw.trim().length ? raw.trim() : fallback;
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

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

  const [staticUpdatedAt, services, serviceLocations, cities] = await Promise.all([
    client.fetch<StaticUpdatedAt>(STATIC_UPDATED_AT_QUERY, {}, { next: { revalidate } }),
    client.fetch<SanitySlugDoc[]>(SERVICES_SLUGS_QUERY, {}, { next: { revalidate } }),
    client.fetch<SanityServiceLocationDoc[]>(SERVICE_LOCATION_SLUGS_QUERY, {}, { next: { revalidate } }),
    client.fetch<SanityLocationSlugDoc[]>(CITY_SLUGS_QUERY, {}, { next: { revalidate } }),
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
