"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreadcrumb } from "@/components/layout/breadcrumb-context";

// Map common paths to readable names
const PATH_MAP: Record<string, string> = {
  "agencia": "Agencia",
  "servicios": "Servicios",
  "planes": "Planes",
  "proyectos": "Proyectos",
  "projects": "Proyectos",
  "contact": "Contacto",
  "blog": "Blog",
  "legal": "Legal",
  "privacy": "Privacidad",
  "terms": "Términos",
  "politica-de-privacidad": "Política de Privacidad",
  "aviso-legal": "Aviso Legal",
  "cookies": "Cookies",
  "condiciones-del-servicio": "Condiciones del Servicio"
};

export function Breadcrumbs() {
  const rawPathname = usePathname();
  const pathname = rawPathname === "/" ? "/" : rawPathname.replace(/\/+$/, "");
  const { lastItemOverride, itemsOverride } = useBreadcrumb();

  const baseUrl = (() => {
    const raw = process.env.NEXT_PUBLIC_URL;
    const value = typeof raw === "string" && raw.trim().length ? raw.trim() : "https://www.onbast.com";
    const normalized = value.replace(/\/+$/, "");

    try {
      const url = new URL(normalized);
      const hostname = url.hostname.toLowerCase();
      const shouldForceHttpsAndWww = hostname === "onbast.com" || hostname === "www.onbast.com";

      if (hostname === "onbast.com") url.hostname = "www.onbast.com";
      if (shouldForceHttpsAndWww) url.protocol = "https:";

      return url.origin;
    } catch {
      return "https://www.onbast.com";
    }
  })();

  const segments = useMemo(() => pathname.split("/").filter(Boolean), [pathname]);
  const isLocalLanding = segments.length === 2 && segments[0] !== "servicios";

  const breadcrumbs = useMemo(() => {
    if (pathname === "/") return [];

    if (itemsOverride && itemsOverride.length > 0) {
      return itemsOverride;
    }

    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      
      // If it's the last item and we have an override, use it.
      // Otherwise use map or capitalize first letter of each word and replace hyphens
      let name = PATH_MAP[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      
      if (index === segments.length - 1 && lastItemOverride) {
        name = lastItemOverride;
      }
      
      return { name, href };
    });
  }, [pathname, lastItemOverride, itemsOverride]);

  // Don't render on home page, studio, local landing until overrides are set, or if empty
  if (
    pathname === "/" || 
    pathname.startsWith("/studio") || 
    (isLocalLanding && !itemsOverride) ||
    breadcrumbs.length === 0
  ) {
    return null;
  }

  // Generate JSON-LD - Only if NOT a service landing page (handled in page.tsx for SEO title)
  const isServiceLanding = pathname.startsWith("/servicios/") && pathname.split("/").length > 2;
  const isServerBreadcrumbSchemaPage = pathname === "/servicios" || pathname === "/planes";
  const shouldRenderJsonLd = !isServerBreadcrumbSchemaPage && !isServiceLanding && !isLocalLanding && !itemsOverride;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": baseUrl
      },
      ...breadcrumbs.map((crumb, index) => {
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": crumb.name,
          "item": `${baseUrl}${crumb.href}`
        };
      })
    ]
  };

  return (
    <>
      {shouldRenderJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      {/* Visual Breadcrumbs - Absolute positioned to sit on top of Heros */}
      <nav 
        aria-label="Breadcrumb"
        className="absolute top-[96px] md:top-24 left-0 w-full z-40 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto px-6 pointer-events-auto flex justify-center md:justify-start">
            <ol className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 text-[10px] md:text-xs text-neutral-500 bg-neutral-950/30 backdrop-blur-sm border border-white/5 py-1 px-3 rounded-full inline-flex uppercase tracking-wider">
              <li>
                <Link 
                  href="/" 
                  title="Volver al inicio"
                  className="flex items-center hover:text-white transition-colors"
                  aria-label="Volver al inicio"
                >
                  <Home className="w-3 h-3" />
                </Link>
              </li>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={crumb.href} className="flex items-center gap-x-2">
                    <ChevronRight className="w-3 h-3 text-neutral-600" />
                    {isLast ? (
                      <span 
                        className="text-white font-medium cursor-default truncate max-w-[220px] md:max-w-xs" 
                        aria-current="page"
                      >
                        {crumb.name}
                      </span>
                    ) : (
                      <Link 
                        href={crumb.href} 
                        title={crumb.name}
                        className="hover:text-white transition-colors truncate max-w-[160px]"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
        </div>
      </nav>
    </>
  );
}
