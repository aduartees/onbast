import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-4 text-center">
      <h1 className="text-9xl font-bold text-indigo-500 mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-8">Página no encontrada</h2>
      <p className="text-neutral-400 mb-8 max-w-md">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Button asChild>
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
