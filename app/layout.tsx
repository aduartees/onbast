import type { Metadata } from "next";
import { Inter, Space_Grotesk, Instrument_Serif, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { BreadcrumbProvider } from "@/components/layout/breadcrumb-context";
import Script from "next/script";
import { CookieConsentManager } from "@/components/utils/cookie-consent";
import { getBaseUrl } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"], 
  variable: "--font-poppins" 
});
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const instrumentSerif = Instrument_Serif({ 
  weight: "400",
  subsets: ["latin"], 
  variable: "--font-instrument",
  style: "italic"
});

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: "ONBAST | Agencia de Desarrollo Web y Posicionamiento SEO & GEO",
  description: "Agencia de Desarrollo Web y Posicionamiento SEO & GEO. Transformamos tu negocio con el modelo WaaS: plataformas vivas, velocidad extrema y visibilidad total en Google y ChatGPT. Domina el futuro digital.",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "./",
  },
  other: {
    "llms-txt": `${baseUrl}/llms.txt`,
  },
  icons: {
    icon: [
      { url: "/icon", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    title: "ONBAST",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Script
          id="consent-mode-default"
          strategy="beforeInteractive"
        >{`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'wait_for_update': 500
});`}</Script>
      </head>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-x-hidden scroll-smooth",
          inter.variable,
          poppins.variable,
          spaceGrotesk.variable,
          instrumentSerif.variable
        )}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <BreadcrumbProvider>
              {children}
            </BreadcrumbProvider>
            <CookieConsentManager />
          </ThemeProvider>
      </body>
    </html>
  );
}
