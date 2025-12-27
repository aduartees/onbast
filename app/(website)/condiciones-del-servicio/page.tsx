import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { TERMS_OF_SERVICE_PAGE_QUERY } from "@/sanity/lib/queries";
import { LegalPage } from "@/components/sections/legal-page";
import { generateBreadcrumbSchema } from "@/lib/seo";
import type { TypedObject } from "@portabletext/types";

export const dynamic = "force-dynamic";

type TermsOfServiceQueryResult = {
  title?: string;
  updatedAt?: string;
  content?: TypedObject[];
  seo?: {
    title?: string;
    description?: string;
  };
  siteSettings?: {
    agency?: {
      name?: string;
      url?: string;
      logo?: string;
    };
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch<TermsOfServiceQueryResult>(TERMS_OF_SERVICE_PAGE_QUERY, {}, { next: { revalidate: 60 } });

  const fallbackTitle = "Condiciones del Servicio";
  const title = data?.seo?.title || data?.title || fallbackTitle;
  const description = data?.seo?.description;
  const baseUrlRaw = process.env.NEXT_PUBLIC_URL || data?.siteSettings?.agency?.url || "https://www.onbast.com";
  const baseUrl = typeof baseUrlRaw === "string" ? baseUrlRaw.replace(/\/+$/, "") : "https://www.onbast.com";

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
    alternates: {
      canonical: `${baseUrl}/condiciones-del-servicio`,
    },
  };
}

export default async function TermsOfServicePage() {
  const data = await client.fetch<TermsOfServiceQueryResult>(TERMS_OF_SERVICE_PAGE_QUERY, {}, { next: { revalidate: 60 } });
  const fallbackTitle = "Condiciones del Servicio";
  const pageTitle = data?.title || fallbackTitle;

  const baseUrlRaw = process.env.NEXT_PUBLIC_URL || data?.siteSettings?.agency?.url || "https://www.onbast.com";
  const baseUrl = typeof baseUrlRaw === "string" ? baseUrlRaw.replace(/\/+$/, "") : "https://www.onbast.com";
  const orgId = `${baseUrl}/#organization`;
  const websiteId = `${baseUrl}#website`;
  const webpageId = `${baseUrl}/condiciones-del-servicio#webpage`;
  const pageUrl = `${baseUrl}/condiciones-del-servicio`;

  const organizationSchema = {
    "@type": "Organization",
    "@id": orgId,
    name: data?.siteSettings?.agency?.name,
    url: baseUrl,
    ...(data?.siteSettings?.agency?.logo ? { logo: data.siteSettings.agency.logo } : {}),
  };

  const websiteSchema = {
    "@type": "WebSite",
    "@id": websiteId,
    url: baseUrl,
    name: data?.siteSettings?.agency?.name,
    publisher: { "@id": orgId },
  };

  const webpageSchema = {
    "@type": "WebPage",
    "@id": webpageId,
    url: pageUrl,
    name: data?.seo?.title || pageTitle,
    ...(data?.seo?.description ? { description: data.seo.description } : {}),
    isPartOf: { "@id": websiteId },
    about: { "@id": orgId },
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", item: `${baseUrl}/` },
    { name: pageTitle, item: pageUrl },
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, websiteSchema, webpageSchema, breadcrumbSchema].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalPage title={pageTitle} updatedAt={data?.updatedAt} content={data?.content} />
    </>
  );
}
