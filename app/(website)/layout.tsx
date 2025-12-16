import { Navbar } from "@/components/layout/navbar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Footer } from "@/components/layout/footer";
import { client } from "@/sanity/lib/client";
import { SETTINGS_QUERY } from "@/sanity/lib/queries";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await client.fetch(SETTINGS_QUERY, {}, { next: { revalidate: 60 } });

  return (
    <>
      <Navbar data={settings} />
      <Breadcrumbs />
      {children}
      <Footer data={settings} />
    </>
  );
}
