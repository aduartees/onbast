# 🚀 ONBAST - Guía de Desarrollo & Arquitectura GEO

> **Agencia de Desarrollo Web Ultra-High-Performance, SEO & GEO (Generative Engine Optimization).**

Esta guía define los estándares de arquitectura, diseño y desarrollo para construir la plataforma digital de ONBAST. Nuestro objetivo es crear una experiencia visualmente impactante (Awwwards-level) optimizada para ser entendida y priorizada por IAs (ChatGPT, Perplexity, Gemini) y motores de búsqueda tradicionales.

---

## 🛠 1. Stack Tecnológico (Hard Constraints)

El proyecto se construye sobre una base sólida y moderna. No se permiten desviaciones sin aprobación de arquitectura.

-   **Framework Core:** [Next.js 15+](https://nextjs.org/) (App Router) + Turbopack.
-   **Lenguaje:** TypeScript (Strict Mode).
-   **Estilos & Sistema de Diseño:**
    -   [Tailwind CSS](https://tailwindcss.com/) (Utility-first).
    -   `clsx` + `tailwind-merge` (Gestión de clases condicionales).
    -   [Shadcn/ui](https://ui.shadcn.com/) (Componentes base estructurales: Modales, Forms, Buttons).
    -   [Aceternity UI](https://ui.aceternity.com/) (Efectos visuales de alto impacto: Hero, Grids, Backgrounds).
    -   [Framer Motion](https://www.framer.com/motion/) (Orquestación de animaciones).
-   **CMS (Headless):** [Sanity.io](https://www.sanity.io/) (Gestión de contenido estructurado).
-   **SEO & GEO:** JSON-LD dinámico, HTML5 Semántico estricto.
-   **Infraestructura:** Vercel (Edge Functions, Image Optimization).

---

## 🎨 2. Identidad Visual & UX (Ultra Modern)

La estética de ONBAST debe transmitir **Innovación, Velocidad y Solidez Técnica**.

### 2.1. Paleta de Colores (Dark Mode First)
Utilizaremos variables CSS para permitir theming dinámico, pero la identidad base es oscura y futurista.

```css
:root {
  /* Fondo Base - Profundo y limpio */
  --background: 240 10% 3.9%; /* #09090b */
  --foreground: 0 0% 98%;     /* #fafafa */

  /* Accento Principal - "Electric Indigo" o "Cyber Blue" */
  --primary: 252 59% 48%;     /* #4f46e5 (Indigo moderno) */
  --primary-foreground: 0 0% 98%;

  /* Accento Secundario - Para gradientes y detalles */
  --secondary: 180 100% 50%;  /* Cyan Neon para tech vibes */
  --secondary-foreground: 240 5.9% 10%;

  /* UI Elements */
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}
```

### 2.2. Tipografía
-   **Principal (Headings & Body):** `Geist Sans` o `Inter` (Legibilidad máxima en pantallas).
-   **Acento (Hero/Creative):** `Space Grotesk` (Opcional, para toques técnicos).

### 2.3. Filosofía de Animación
-   **"Fluid & Snappy":** Las transiciones no deben durar más de 300ms-500ms.
-   **Scroll-triggered:** Los elementos aparecen suavemente al hacer scroll (Framer Motion `whileInView`).
-   **Micro-interacciones:** Feedback inmediato en hover y click.

---

## 🏗 3. Arquitectura del Proyecto

Estructura de directorios optimizada para escalabilidad y orden.

```bash
/
├── app/                    # Next.js App Router
│   ├── (site)/             # Rutas públicas (agrupación lógica)
│   │   ├── page.tsx        # Home
│   │   ├── layout.tsx      # Layout principal (Header/Footer)
│   │   └── services/       # Páginas de servicios
│   ├── api/                # Route Handlers (API interna)
│   ├── globals.css         # Estilos globales
│   └── layout.tsx          # Root Layout (Providers)
├── components/
│   ├── ui/                 # Shadcn/ui (Button, Input, Card)
│   ├── aceternity/         # Componentes visuales (Sparkles, Beams)
│   ├── sections/           # Bloques de negocio (Hero, Features, Pricing)
│   └── shared/             # Componentes reutilizables (SEOHead, Logo)
├── lib/
│   ├── utils.ts            # cn(), formatters
│   └── seo.ts              # Helpers para JSON-LD
├── sanity/
│   ├── schemaTypes/        # Definición de modelos (post, service, project)
│   ├── lib/                # Cliente y consultas (queries.ts)
│   └── env.ts              # Variables de entorno validadas
├── public/                 # Assets estáticos (SVGs, Favicons)
└── types/                  # Definiciones TypeScript globales
```

---

## ⚡ 4. Workflow de Desarrollo (Paso a Paso)

### Paso 1: Inicialización
```bash
npx create-next-app@latest onbast --typescript --tailwind --eslint
npx shadcn@latest init
# Instalar dependencias clave
npm install framer-motion clsx tailwind-merge lucide-react next-themes next-sanity @sanity/image-url
```

### Paso 2: Desarrollo "Visual First"
1.  **Selección de Componentes:** Antes de codificar CSS personalizado, busca en el catálogo de Shadcn (funcional) o Aceternity (visual).
2.  **Composición:** Crea la UI en `components/sections/` combinando primitivas.
    *   *Ejemplo:* Un `HeroSection` usa `BackgroundBeams` (Aceternity) de fondo y `Button` (Shadcn) para el CTA.

### Paso 3: Integración CMS (Sanity)
Sigue estrictamente este orden para añadir contenido dinámico:
1.  **Schema:** Define el modelo en `sanity/schemaTypes/nombreModelo.ts`.
2.  **Query:** Escribe la query GROQ en `sanity/lib/queries.ts`.
3.  **Type:** Define la interfaz TypeScript para la respuesta de la query.
4.  **Componente:** Conecta el componente visual con los datos tipados.

### Paso 4: Implementación GEO (Generative Engine Optimization)
Para que las IAs entiendan nuestro sitio, cada página debe ser semánticamente perfecta.

-   **Estructura HTML:**
    ```tsx
    <main>
      <section id="hero"><h1>...</h1></section>
      <section id="services"><article>...</article></section>
    </main>
    ```
-   **JSON-LD (Schema.org):**
    Inyectar datos estructurados en cada página dinámica.
    ```tsx
    // components/shared/JsonLd.tsx
    export function JsonLd({ data }) {
      return (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      );
    }
    ```

---

## 📝 5. Reglas de Código (Linter & Style)

1.  **Imports:** Usar alias `@/` siempre.
    *   ✅ `import { Button } from "@/components/ui/button"`
    *   ❌ `import { Button } from "../../components/ui/button"`
2.  **Imágenes:** SIEMPRE usar `next/image`. Prohibido `<img>` nativo salvo excepciones SVG muy específicas.
3.  **Server Components:** Por defecto todo es Server Component. Usa `'use client'` solo en las hojas (hojas del árbol de componentes) que necesiten interactividad (hooks, eventos).
4.  **Tipado:** `any` está prohibido. Define interfaces para props y respuestas de API.

---

## 🚀 6. Despliegue

El proyecto está configurado para **Vercel**.
-   Conectar repositorio GitHub.
-   Configurar variables de entorno (`NEXT_PUBLIC_SANITY_PROJECT_ID`, etc.).
-   El deploy es automático con cada push a `main`.

---

**ONBAST Development Team**
*Construyendo el futuro de la web.*
