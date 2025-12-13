import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/layout/mobile-nav"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-neutral-950/50 border-b border-neutral-800/50">
      <div className="flex items-center gap-2 relative z-50">
        <span className="text-2xl font-bold tracking-tighter text-white">onbast.</span>
      </div>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#services" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">Servicios</a>
        <a href="#projects" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">Proyectos</a>
        <a href="#about" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">Agencia</a>
        <a href="#contact">
          <Button variant="secondary" className="bg-white text-black hover:bg-neutral-200 rounded-full px-6">
            Contacto
          </Button>
        </a>
      </div>

      {/* Mobile Menu */}
      <MobileNav />
    </nav>
  )
}
