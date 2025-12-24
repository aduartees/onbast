import type { Metadata } from "next";
import { Inter, Space_Grotesk, Instrument_Serif, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BreadcrumbProvider } from "@/components/layout/breadcrumb-context";
import Script from "next/script";
import { CookieConsentManager } from "@/components/utils/cookie-consent";

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

export const metadata: Metadata = {
  title: "ONBAST | Web Development & SEO Agency",
  description: "Agencia de Desarrollo Web Ultra-High-Performance, SEO & GEO.",
  metadataBase: new URL("https://onbast.com"),
  alternates: {
    canonical: "./",
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
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
      </body>
    </html>
  );
}
