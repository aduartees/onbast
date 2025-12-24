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

const SERVICES_SLUGS_QUERY = `*[_type == "service" && defined(slug.current)]{
  "slug": slug.current,
  _updatedAt
}`;

const LOCATIONS_SLUGS_QUERY = `*[_type == "location" && defined(slug.current)]{
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const [staticUpdatedAt, services, locations] = await Promise.all([
    client.fetch<StaticUpdatedAt>(STATIC_UPDATED_AT_QUERY, {}, { next: { revalidate } }),
    client.fetch<SanitySlugDoc[]>(SERVICES_SLUGS_QUERY, {}, { next: { revalidate } }),
    client.fetch<SanityLocationSlugDoc[]>(LOCATIONS_SLUGS_QUERY, {}, { next: { revalidate } }),
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

  const serviceLastModifiedBySlug = new Map(
    services
      .filter((service) => typeof service?.slug === "string" && service.slug.length)
      .map((service) => [service.slug as string, toDate(service._updatedAt)]),
  );
  const locationLastModifiedBySlug = new Map(
    locations
      .filter((location) => typeof location?.slug === "string" && location.slug.length)
      .map((location) => [location.slug as string, toDate(location._updatedAt)]),
  );

  for (const service of services) {
    if (!service?.slug) continue;
    const serviceLastModified = serviceLastModifiedBySlug.get(service.slug) ?? new Date();

    for (const location of locations) {
      if (!location?.slug) continue;
      const locationLastModified = locationLastModifiedBySlug.get(location.slug) ?? new Date();
      const lastModified =
        serviceLastModified.getTime() >= locationLastModified.getTime()
          ? serviceLastModified
          : locationLastModified;

      entries.push({
        url: `${baseUrl}/${service.slug}/${location.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
