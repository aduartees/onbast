import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { PRIVACY_POLICY_PAGE_QUERY } from "@/sanity/lib/queries";
import { LegalPage } from "@/components/sections/legal-page";
import { generateBreadcrumbSchema } from "@/lib/seo";
import type { TypedObject } from "@portabletext/types";

export const dynamic = "force-dynamic";

type PrivacyPolicyQueryResult = {
  title?: string;
  updatedAt?: string;
  content?: TypedObject[];
  siteSettings?: {
    agency?: {
      name?: string;
      url?: string;
      logo?: string;
    };
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch<PrivacyPolicyQueryResult>(PRIVACY_POLICY_PAGE_QUERY, {}, { next: { revalidate: 60 } });

  const title = data?.title || "Política de Privacidad";
  const baseUrl = process.env.NEXT_PUBLIC_URL || data?.siteSettings?.agency?.url || "https://onbast.com";

  return {
    title,
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
      canonical: `${baseUrl}/politica-de-privacidad`,
    },
  };
}

export default async function PrivacyPolicyPage() {
  const data = await client.fetch<PrivacyPolicyQueryResult>(PRIVACY_POLICY_PAGE_QUERY, {}, { next: { revalidate: 60 } });
  const fallbackTitle = "Política de Privacidad";
  const pageTitle = data?.title || fallbackTitle;

  const baseUrl = process.env.NEXT_PUBLIC_URL || data?.siteSettings?.agency?.url || "https://onbast.com";
  const orgId = `${baseUrl}/#organization`;
  const websiteId = `${baseUrl}#website`;
  const webpageId = `${baseUrl}/politica-de-privacidad#webpage`;
  const pageUrl = `${baseUrl}/politica-de-privacidad`;

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
    name: pageTitle,
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
