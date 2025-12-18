"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Twitter, Linkedin, Github, Instagram, ArrowUpRight, Facebook, Youtube } from "lucide-react";

interface FooterProps {
  data?: {
    agency?: {
      name?: string;
      email?: string;
      address?: {
        city?: string;
        country?: string;
      };
    };
    footer?: {
      brandText?: string;
      socialLinks?: {
        platform: string;
        url: string;
      }[];
      columns?: {
        title: string;
        links: {
          label: string;
          url: string;
        }[];
      }[];
      copyrightText?: string;
    };
  };
}

export function Footer({ data }: FooterProps) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Don't show footer in Sanity Studio
  if (pathname?.startsWith("/studio")) {
    return null;
  }

  const { agency, footer } = data || {};

  // Social Icon Helper
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'github': return <Github className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      default: return <ArrowUpRight className="w-4 h-4" />;
    }
  };

  return (
    <footer className="relative bg-neutral-950 pt-24 pb-12 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col gap-6 items-center md:items-start text-center md:text-left">
            <p className="text-2xl font-bold text-white tracking-tighter font-inter">{agency?.name || "onbast."}</p>
            <p className="text-neutral-400 max-w-sm leading-relaxed text-sm font-light">
              {footer?.brandText || "Redefiniendo el estándar digital. Creamos experiencias web de alto rendimiento y estrategias GEO que dominan el futuro de la búsqueda."}
            </p>
            <div className="flex gap-4 mt-4">
              {footer?.socialLinks?.map((link, idx) => (
                <SocialLink 
                  key={idx} 
                  href={link.url} 
                  icon={getSocialIcon(link.platform)} 
                  label={link.platform} 
                />
              ))}
              {!footer?.socialLinks && (
                 <>
                  <SocialLink href="#" icon={<Twitter className="w-4 h-4" />} label="X (Twitter)" />
                  <SocialLink href="#" icon={<Linkedin className="w-4 h-4" />} label="LinkedIn" />
                 </>
              )}
            </div>
          </div>

          {/* Dynamic Links Columns */}
          {footer?.columns?.map((col, idx) => (
            <div key={idx} className="md:col-span-2 flex flex-col gap-4 items-center md:items-start text-center md:text-left">
              <p className="text-white font-medium mb-2">{col.title}</p>
              {col.links?.map((link, linkIdx) => (
                 <FooterLink key={linkIdx} href={link.url}>{link.label}</FooterLink>
              ))}
            </div>
          ))}

          {/* Fallback Static Columns if no dynamic data */}
          {!footer?.columns && (
            <>
              <div className="md:col-span-2 md:col-start-7 flex flex-col gap-4 items-center md:items-start text-center md:text-left">
                <p className="text-white font-medium mb-2">Explorar</p>
                <FooterLink href="/servicios">Servicios</FooterLink>
                <FooterLink href="/projects">Proyectos</FooterLink>
                <FooterLink href="/agencia">Agencia</FooterLink>
              </div>
              <div className="md:col-span-2 flex flex-col gap-4 items-center md:items-start text-center md:text-left">
                <p className="text-white font-medium mb-2">Legal</p>
                <FooterLink href="/privacy">Privacidad</FooterLink>
                <FooterLink href="/terms">Términos</FooterLink>
              </div>
            </>
          )}

          {/* Contact Column (Always present, possibly dynamic) */}
          <div className="md:col-span-2 flex flex-col gap-4 items-center md:items-start text-center md:text-left">
            <p className="text-white font-medium mb-2">Contacto</p>
            <FooterLink href={`mailto:${agency?.email || "hello@onbast.agency"}`}>
              {agency?.email || "hello@onbast.agency"}
            </FooterLink>
            <span className="text-neutral-400 text-sm">
              Toda España
            </span>
            <Link href="/contacto" title="Contacto" className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm transition-colors mt-2">
              Iniciar Proyecto <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4 relative z-20 pb-12 md:pb-0 w-full">
          <p className="text-neutral-400 text-xs text-center md:text-left w-full">
            © {currentYear} {agency?.name || "ONBAST Agency"}. {footer?.copyrightText || "Todos los derechos reservados."}
          </p>
        </div>
      </div>

      {/* GIANT BLURRED LOGO BACKGROUND */}
      <div className="absolute bottom-0 md:bottom-0 left-1/2 -translate-x-1/2 translate-y-0 md:translate-y-[35%] w-full flex justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="text-[28vw] md:text-[25vw] font-bold text-white/[0.1] font-inter tracking-tighter leading-none whitespace-nowrap blur-[1px] md:blur-sm transform translate-y-0">
          {agency?.name || "ONBAST"}
        </span>
      </div>
      
      {/* Decorative Gradient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none z-0" />
    </footer>
  );
}

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href} 
    title={typeof children === 'string' ? children : 'Link'}
    className="text-neutral-400 hover:text-white text-sm transition-colors duration-200 w-fit"
  >
    {children}
  </Link>
);

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  const title = label.startsWith('Perfil de') ? label : `Perfil de ${label} de ONBAST`;
  return (
    <a 
      href={href} 
      aria-label={title}
      title={title}
      className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:bg-white/10 hover:text-white hover:border-white/10 transition-all duration-300"
    >
      {icon}
    </a>
  );
};
