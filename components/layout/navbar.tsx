import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tighter text-white">onbast.</span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a href="#services" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">Servicios</a>
        <a href="#projects" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">Proyectos</a>
        <a href="#about" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">Agencia</a>
      </div>
      <Button variant="secondary" className="bg-white text-black hover:bg-neutral-200">
        Contacto
      </Button>
    </nav>
  )
}
