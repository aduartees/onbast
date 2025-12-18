# 🚀 DOCUMENTACIÓN MAESTRA: ARQUITECTURA, ESTRATEGIA Y TECNOLOGÍA
> **Versión:** 1.0.0
> **Fecha:** 18 Diciembre 2025
> **Rol:** Arquitecto Senior Full-Stack & GEO Expert

Este documento define la **Verdad Única** sobre cómo construimos, diseñamos y optimizamos nuestra agencia digital. No es solo código; es una filosofía de **Excelencia Visual** y **Dominio de Motores de Búsqueda (GEO/SEO)**.

---

## 1. 🧬 ADN Y FILOSOFÍA DEL PROYECTO

Nuestro objetivo es construir aplicaciones web que no solo sean rápidas, sino **memorables**. Rechazamos lo genérico. Fusionamos ingeniería de software estricta con diseño de vanguardia.

### Los 3 Pilares Fundamentales:
1.  **Visual First & Impact:** Si no impresiona en los primeros 3 segundos, hemos fallado. Usamos efectos visuales de alta gama (Aceternity UI) sobre una base sólida de usabilidad (Shadcn/ui).
2.  **GEO (Generative Engine Optimization) Nativo:** No hacemos SEO de los 2010s. Estructuramos la data para que las IAs (ChatGPT, Perplexity, Google SGE) *entiendan* y *recomienden* nuestro contenido.
3.  **Arquitectura Escalable & Type-Safe:** Todo está tipado. Nada está hardcodeado. El CMS (Sanity) controla el contenido; Next.js controla la experiencia.

---

## 2. 🛠️ STACK TECNOLÓGICO (HARD CONSTRAINTS)

Solo utilizamos tecnologías modernas, probadas y de alto rendimiento.

| Capa | Tecnología | Justificación |
| :--- | :--- | :--- |
| **Core Framework** | **Next.js 16+ (App Router)** | Renderizado híbrido (SSR/SSG), Server Actions y Turbopack. |
| **Lenguaje** | **TypeScript (Strict Mode)** | Cero errores en runtime. Interfaces estrictas para CMS y Props. |
| **Estilos & UI** | **Tailwind CSS + Shadcn/ui** | Velocidad de desarrollo y consistencia. `clsx` y `tailwind-merge` para lógica condicional. |
| **Efectos Visuales** | **Aceternity UI + Framer Motion** | Animaciones fluidas, GPU-accelerated, para secciones "Hero" y "Features". |
| **CMS (Headless)** | **Sanity.io** | Schema-first, tiempo real, ultra-flexible. Single Source of Truth. |
| **Base de Datos** | **Sanity Content Lake** | NoSQL, optimizado para entrega de contenido global. |
| **Iconografía** | **Lucide React** | Iconos SVG ligeros, consistentes y tree-shakeable. |
| **Despliegue** | **Vercel** | Edge Functions, Image Optimization y CI/CD integrado. |

---

## 3. 🧠 ESTRATEGIA GEO & SEO (LA JOYA DE LA CORONA)

Aquí es donde nos diferenciamos. No solo "ponemos keywords". Hablamos el idioma de las máquinas.

### A. Semántica Estricta (El DOM habla)
Las IAs leen la estructura HTML antes que el CSS.
- **Prohibido:** Usar `<div>` para todo.
- **Obligatorio:**
    - `<header>`: Navegación y branding.
    - `<main>`: Contenido principal único por página.
    - `<section>`: Bloques lógicos de contenido (Hero, Servicios).
    - `<article>`: Contenido independiente (Blog posts, Tarjetas de servicio).
    - `<h1>` - `<h6>`: Jerarquía estricta. Nunca saltar niveles.

### B. JSON-LD & Schema.org (Inyección de Contexto)
Cada página importante inyecta un script de datos estructurados que dice explícitamente qué es el contenido.
- **Home:** `Organization` (Logo, Redes, Contacto).
- **Servicio:** `Service` (Nombre, Descripción, AreaServed).
- **Proyecto:** `CreativeWork`.

**Implementación Técnica:**
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
/>
```

### C. Metadatos Dinámicos
Usamos la API `generateMetadata` de Next.js.
- Títulos y descripciones nunca son estáticos; vienen de Sanity.
- Open Graph (OG Images) generados dinámicamente para que al compartir en WhatsApp/LinkedIn se vea profesional.

---

## 4. 🎨 SISTEMA DE DISEÑO Y UI (COMPONENT DRIVEN)

No inventamos CSS. Componemos interfaces.

### Flujo de Creación de UI:
1.  **Necesidad:** "Necesitamos una sección de testimonios".
2.  **Selección:** ¿Existe en Shadcn? (Estructura base). ¿Existe en Aceternity? (Impacto visual).
3.  **Adaptación:** Personalizamos via Tailwind (`className`) manteniendo la consistencia de colores/fuentes.
4.  **Componentización:** Se extrae a `/components/sections/testimonials.tsx`.

### Reglas de Estilo:
- **Mobile First:** Siempre diseñamos pensando en pantallas pequeñas primero (`w-full`), luego ajustamos para desktop (`md:w-1/2`).
- **Dark Mode Default:** La interfaz debe brillar en modo oscuro. Usamos variables CSS de Shadcn (`bg-background`, `text-foreground`).
- **Imágenes:** SIEMPRE `next/image`. Nunca `<img>`. Optimización automática de formato (WebP/AVIF) y Lazy Loading.

---

## 5. 🗄️ ARQUITECTURA DE DATOS (CMS SANITY)

El contenido es el rey, y Sanity es su castillo.

### El Flujo de Datos Sagrado:
1.  **Schema (`/sanity/schemaTypes`):** Definimos la estructura del dato (ej: `service.ts`).
2.  **Query (`/sanity/lib/queries.ts`):** Escribimos la consulta GROQ optimizada (solo traemos lo que usamos).
3.  **Type (`TypeScript Interface`):** Tipamos la respuesta de la query.
4.  **Componente (`tsx`):** El componente recibe los datos tipados y renderiza.

**Regla de Oro:** NUNCA hardcodeamos textos comerciales en el código. Si el cliente quiere cambiar un precio o un título, debe poder hacerlo desde Sanity Studio sin tocar una línea de código.

---

## 6. 📂 ESTRUCTURA DE DIRECTORIOS (LIMPIEZA)

```
/
├── app/                  # App Router (Rutas y Layouts)
│   ├── (website)/        # Rutas públicas (agencia, servicios...)
│   ├── api/              # Endpoints API (si necesarios)
│   └── studio/           # Sanity Studio embebido
├── components/
│   ├── ui/               # Componentes base (Shadcn - Botones, Inputs)
│   ├── aceternity/       # Componentes visuales (Efectos, Grids)
│   ├── sections/         # Bloques de página (Hero, Features, Contact)
│   └── layout/           # Navbar, Footer, Mobile Nav
├── lib/                  # Utilidades (cn, formatters)
├── sanity/               # Configuración del CMS
│   ├── lib/              # Cliente, Queries, Image URL Builder
│   └── schemaTypes/      # Definiciones de modelos de datos
└── public/               # Assets estáticos (SVGs, Robots.txt)
```

---

## 7. 🚀 PROTOCOLO DE DESPLIEGUE Y GIT

1.  **Ramas:** Trabajamos feature-based o directamente en master si es pair-programming rápido, pero siempre probando en local (`npm run dev`).
2.  **Commits:** Semánticos (`feat:`, `fix:`, `style:`, `docs:`).
3.  **CI/CD:** Cada push a `master` dispara un deploy en Vercel.
4.  **Variables de Entorno:** `.env.local` para secretos. Nunca se suben al repo.

---

> **Nota Final:** Esta arquitectura está viva. Evoluciona con cada feature, pero los principios de Calidad, SEO Semántico y Separación de Datos/Vista son innegociables.
