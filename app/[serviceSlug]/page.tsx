import { client } from "@/sanity/lib/client";
import { notFound, permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ serviceSlug: string }>;
}

const SERVICE_SLUG_EXISTS_QUERY = `*[_type == "service" && slug.current == $serviceSlug][0]{"slug": slug.current}`;

export default async function ServiceSlugRedirectPage({ params }: PageProps) {
  const { serviceSlug } = await params;

  const service = await client.fetch<{ slug?: string }>(
    SERVICE_SLUG_EXISTS_QUERY,
    { serviceSlug },
    { next: { revalidate: 3600 } }
  );

  if (!service?.slug) notFound();

  permanentRedirect(`/servicios/${serviceSlug}`);
}

