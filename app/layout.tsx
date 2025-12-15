import type { Metadata } from "next";
import { Inter, Space_Grotesk, Instrument_Serif, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/layout/footer";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
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
            {children}
            <Footer />
            <Analytics />
          </ThemeProvider>
      </body>
    </html>
  );
}
