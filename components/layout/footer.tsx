"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Twitter, Linkedin, Github, Instagram, ArrowUpRight } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Don't show footer in Sanity Studio
  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <footer className="relative bg-neutral-950 pt-24 pb-12 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-white tracking-tighter font-inter">onbast.</h3>
            <p className="text-neutral-400 max-w-sm leading-relaxed text-sm font-light">
              Redefiniendo el estándar digital. Creamos experiencias web de alto rendimiento y estrategias GEO que dominan el futuro de la búsqueda.
            </p>
            <div className="flex gap-4 mt-4">
              <SocialLink href="#" icon={<Twitter className="w-4 h-4" />} label="Twitter" />
              <SocialLink href="#" icon={<Linkedin className="w-4 h-4" />} label="LinkedIn" />
              <SocialLink href="#" icon={<Github className="w-4 h-4" />} label="GitHub" />
              <SocialLink href="#" icon={<Instagram className="w-4 h-4" />} label="Instagram" />
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2 md:col-start-7 flex flex-col gap-4">
            <h4 className="text-white font-medium mb-2">Explorar</h4>
            <FooterLink href="#services">Servicios</FooterLink>
            <FooterLink href="#projects">Proyectos</FooterLink>
            <FooterLink href="#about">Agencia</FooterLink>
            <FooterLink href="#blog">Insights</FooterLink>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-white font-medium mb-2">Legal</h4>
            <FooterLink href="/privacy">Privacidad</FooterLink>
            <FooterLink href="/terms">Términos</FooterLink>
            <FooterLink href="/cookies">Cookies</FooterLink>
          </div>

          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-white font-medium mb-2">Contacto</h4>
            <FooterLink href="mailto:hello@onbast.agency">hello@onbast.agency</FooterLink>
            <span className="text-neutral-400 text-sm">Madrid, España</span>
            <Link href="/contact" className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm transition-colors mt-2">
              Iniciar Proyecto <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4 relative z-20 pb-12 md:pb-0">
          <p className="text-neutral-400 text-xs text-center md:text-left">
            © {currentYear} ONBAST Agency. Todos los derechos reservados.
          </p>
          <p className="text-neutral-400 text-xs flex items-center gap-2">
            Designed & Built with <span className="text-red-500">♥</span> by ONBAST
          </p>
        </div>
      </div>

      {/* GIANT BLURRED LOGO BACKGROUND */}
      <div className="absolute bottom-0 md:bottom-0 left-1/2 -translate-x-1/2 translate-y-0 md:translate-y-[35%] w-full flex justify-center pointer-events-none select-none z-0 overflow-hidden">
        <h1 className="text-[28vw] md:text-[25vw] font-bold text-white/[0.1] font-inter tracking-tighter leading-none whitespace-nowrap blur-[1px] md:blur-sm transform translate-y-0">
          ONBAST
        </h1>
      </div>
      
      {/* Decorative Gradient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none z-0" />
    </footer>
  );
}

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href} 
    className="text-neutral-400 hover:text-white text-sm transition-colors duration-200 w-fit"
  >
    {children}
  </Link>
);

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a 
    href={href} 
    aria-label={label}
    className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:bg-white/10 hover:text-white hover:border-white/10 transition-all duration-300"
  >
    {icon}
  </a>
);
