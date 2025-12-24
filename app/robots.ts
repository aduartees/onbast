import type { MetadataRoute } from "next";

const getBaseUrl = (fallback = "https://onbast.com") => {
  const raw = process.env.NEXT_PUBLIC_URL;
  const value = typeof raw === "string" && raw.trim().length ? raw.trim() : fallback;
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/studio",
          "/api",
          "/_next",
          "/llms.txt",
          "/aviso-legal",
          "/politica-de-privacidad",
          "/cookies",
          "/condiciones-del-servicio",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
