# 🌍 MASTER PLAN: ESTRATEGIA GEO-LOCALE & ARQUITECTURA DE ESCALADO
> **Versión Definitiva (V3)**
> **Fecha:** 18 Diciembre 2025
> **Objetivo:** Desplegar miles de landings locales (Servicio + Ciudad + Pueblo) sin thin content, con URLs planas de alta autoridad y breadcrumbs lógicos perfectos.

---

## 1. 🏗️ ARQUITECTURA DE RUTAS & BREADCRUMBS (EL RETO TÉCNICO)

El cliente exige **URLs planas** para SEO (`/servicio/ciudad`) pero **Breadcrumbs Jerárquicos** para UX/Google (`Servicios > Servicio > Ciudad > Pueblo`).

### 1.1 Mapa de Rutas Definido

| Nivel | URL Pública (Browser) | Ruta Next.js (Filesystem) | Breadcrumb Lógico (Schema + UI) |
| :--- | :--- | :--- | :--- |
| **Nivel 0 (Home)** | `/` | `/page.tsx` | Inicio |
| **Nivel 1 (Servicio)** | `/servicios/desarrollo-web` | `/servicios/[slug]/page.tsx` | Inicio > Servicios > Desarrollo Web |
| **Nivel 2 (Ciudad)** | `/desarrollo-web/madrid` | `/[serviceSlug]/[citySlug]/page.tsx` | Inicio > Servicios > Desarrollo Web > Madrid |
| **Nivel 3 (Pueblo)** | `/desarrollo-web/getafe` | `/[serviceSlug]/[citySlug]/page.tsx` | Inicio > Servicios > Desarrollo Web > Madrid > Getafe |

> **⚠️ NOTA CRÍTICA:** La ruta dinámica `/[serviceSlug]/[citySlug]` capturará TODO lo que tenga 2 segmentos. Debemos validar estrictamente en `generateStaticParams` o en el `page.tsx` que `serviceSlug` existe como servicio Y `citySlug` existe como ubicación. Si no, **404 inmediato** para evitar canibalizar otras rutas.

### 1.2 Lógica de Breadcrumbs (Disociación URL/Jerarquía)
No podemos confiar en `usePathname()`. Usaremos un **Breadcrumb Generator** basado en datos:
1.  Detectar si es landing local.
2.  Consultar Sanity: `¿Getafe tiene padre? Sí, Madrid`.
3.  Construir array:
    *   `Home` (/)
    *   `Servicios` (/servicios)
    *   `[Nombre Servicio]` (/servicios/[slug])
    *   `[Nombre Ciudad Padre]` (/[servicio]/[ciudad-padre]) -> *Solo si es pueblo*
    *   `[Nombre Ubicación Actual]` (Current)

---

## 2. 🗄️ ARQUITECTURA DE DATOS (SANITY RELACIONAL)

Para evitar el "Thin Content" y la penalización por contenido duplicado, **NO** duplicaremos documentos de servicio. Crearemos una estructura relacional centralizada.

### 2.1 Schema: `location` (Ubicación)
Define la entidad geográfica.
```typescript
{
  name: 'location',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Nombre (Getafe)' },
    { name: 'slug', type: 'slug', title: 'Slug (getafe)' },
    { name: 'type', type: 'string', options: { list: ['city', 'town'] } },
    { name: 'parent', type: 'reference', to: [{ type: 'location' }], title: 'Pertenece a (Madrid)' },
    { name: 'population', type: 'number', title: 'Población (Para prioridad Sitemap)' },
    { name: 'gentilicio', type: 'string', title: 'Gentilicio (Getafense)' },
    { name: 'geoContext', type: 'text', title: 'Contexto Económico/Local (IA Generated)' },
    { name: 'coordinates', type: 'geopoint', title: 'Coordenadas' }
  ]
}
```

### 2.2 Schema: `serviceLocation` (La Tabla Pivote)
Aquí vive la personalización. Conecta un Servicio con una Ubicación.
```typescript
{
  name: 'serviceLocation',
  title: 'Landing Local (Override)',
  type: 'document',
  fields: [
    { name: 'service', type: 'reference', to: [{ type: 'service' }] },
    { name: 'location', type: 'reference', to: [{ type: 'location' }] },
    // --- SEO OVERRIDES ---
    { name: 'seoTitle', type: 'string', title: 'SEO Title (Optimizado Local)' },
    { name: 'seoDescription', type: 'text', title: 'Meta Description' },
    // --- CONTENT OVERRIDES ---
    { name: 'heroHeadline', type: 'string', title: 'H1 Localizado' },
    { name: 'heroText', type: 'text', title: 'Intro Localizada' },
    { name: 'localContentBlock', type: 'array', of: [{type: 'block'}], title: 'Contenido SEO Local (Denso)' },
    // --- RELACIONES LOCALES ---
    { name: 'customTestimonials', type: 'array', of: [{ type: 'testimonial' }], title: 'Testimonios Locales (Opcional)' },
    { name: 'customProjects', type: 'array', of: [{ type: 'reference', to: [{type: 'project'}] }], title: 'Proyectos Destacados (Opcional)' }
  ]
}
```
> **Lógica de Proyectos (Fallback Automático):** 
> Si `customProjects` está vacío, el frontend consultará automáticamente:
> `*[_type == "project" && serviceRef == currentService._id] | order(date desc)[0..2]`
> Esto garantiza que siempre se muestren los 3 últimos trabajos relevantes sin intervención manual.

### 2.3 Schema: `pricingPlan` (Centralización de Precios)
Para que cambiar el precio en un sitio lo cambie en todos.
*   **Campos:** Nombre, Precio, Periodicidad, Features, ID Enlace.
*   **Uso:** Se referencia desde `service` y desde la página `/planes`.

---

## 3. 🤖 ESTRATEGIA DE CONTENIDO AUTOMATIZADO (ANTI-THIN CONTENT)

Google odia: "Diseño web en Madrid", "Diseño web en Getafe" (mismo texto).
Solución: **Inyección de Contexto Real**.

### 3.1 Prompting de IA (Script de Generación - Gemini 3.0 Preview)

Usaremos **Gemini 3.0 Preview** por su ventana de contexto y capacidad de razonamiento superior.

**Flujo de Datos (Herencia + Enriquecimiento):**
1.  **Input 1 (Base):** JSON completo del Servicio Padre (Sanity). *Garantiza que no inventamos servicios que no damos.*
2.  **Input 2 (Contexto):** Datos de la Ciudad (Nombre, Tipo, Economía).
3.  **Instrucción SEO:** "Mantén la propuesta de valor técnica EXACTA, pero reescribe el copy para maximizar la densidad semántica local y atacar la intención de búsqueda transaccional en [Ciudad]. No seas poético, sé denso y persuasivo."

**Output Esperado (JSON Schema Strict):**
El prompt exigirá un JSON que coincida exactamente con la estructura de `serviceLocation`:
```json
{
  "seoTitle": "Diseño Web en Getafe | ONBAST",
  "seoDescription": "...",
  "heroHeadline": "...",
  "localContentBlock": [ ...PortableText... ]
}
```
*   **Cero Alucinaciones:** Si el servicio padre dice "Next.js", la landing de Getafe no puede decir "WordPress".
*   **Densidad Semántica:** La landing local debe ser más agresiva en keywords ("Diseño web Getafe", "Agencia SEO Sur de Madrid") que la Hub (que es más Branding/Minimalista).

### 3.2 Imágenes Dinámicas (Next.js ImageResponse)
Generaremos Open Graph images y Hero Images dinámicas en el borde (Edge).
*   **Tecnología:** `@vercel/og`
*   **Diseño:** Imagen base del servicio (oscura/elegante) + Overlay de Texto con tipografía corporativa: "Estrategia Digital en **Getafe**".
*   **Ventaja:** 0 peso en build, 100% SEO friendly (nombres de archivo simulados en ruta `/api/og?title=...`).

### 3.3 Testimonios "Lógicos"
Si no existen testimonios reales específicos para "Getafe", el sistema:
1.  Toma testimonios generales del servicio.
2.  (Opcional) Modifica dinámicamente el cargo visualmente: "CEO de Restaurante **en Getafe**" (Usar con ética/cuidado).
3.  **Mejor opción:** Seleccionar testimonios de clientes de la misma PROVINCIA o SECTOR predominante en esa ciudad.

---

## 4. 🧩 NUEVOS COMPONENTES DE UI (ESTRUCTURA AMPLIADA)

Las landings locales tendrán una estructura más rica para retener al usuario.

1.  **Hero Local:** H1 dinámico + Subtítulo con "Proof of Location".
2.  **Impacto/Logos:** Autoridad inmediata.
3.  **Tabla Comparativa (Nueva):** "Agencia Tradicional" vs "ONBAST [Ciudad]".
4.  **Beneficios:** Explicación visual.
5.  **Proyectos:** Prueba visual (Automático Last 3).
6.  **Precios:** El filtro comercial (Link a `/planes`).
7.  **Testimonios:** Prueba social localizada.
8.  **Bloque Contenido SEO (Nuevo):** Densidad de palabras clave y contexto local (Económico/Geográfico).
9.  **FAQ:** Schema FAQPage.
10. **Interlinking Local (Nuevo):** "Servicios cercanos a ti" (Pueblos vecinos).
11. **CTA Final.**

---

## 5. 💰 EL CONFIGURADOR (/PLANES) & CENTRALIZACIÓN DE PRECIOS

El usuario quiere globalizar precios y convertir la venta en una experiencia interactiva.

### 5.1 Lógica del Configurador (/planes)
*   Nueva página `/planes`.
*   **Step 1:** Infraestructura (Web/App). -> Selecciona `pricingPlan` base.
*   **Step 2:** Visibilidad (SEO/GEO). -> Selecciona Add-on recurrente.
*   **Step 3:** Local (GMB). -> Selecciona Add-on local.
*   **Step 4 (Conversión):** Resumen del Plan + Formulario de Contacto.
    *   Campos: Nombre, Email, Teléfono, Mensaje.
    *   **Acción:** Envía un email a `info@onbast.com` con el JSON de la selección del usuario ("El cliente quiere Web + SEO Local en Getafe").
    *   **Tecnología:** Server Actions + Resend/Nodemailer.

### 5.2 Integración en Landings
En las landings locales, el bloque de precios NO mostrará solo la tarjeta estática. Mostrará la tarjeta del servicio principal pre-seleccionada, con un botón "Personalizar Plan" que lleva a `/planes?service=web&location=getafe`.

---

## 6. 🚀 PLAN DE EJECUCIÓN (PASO A PASO)

### FASE 1: Schema & Datos (Base Sólida)
1.  Crear `sanity/schemaTypes/location.ts`.
2.  Crear `sanity/schemaTypes/serviceLocation.ts`.
3.  Crear `sanity/schemaTypes/pricingPlan.ts`.
4.  Actualizar `sanity/structure.ts`.
5.  Script `scripts/seed-locations.ts` (Importar principales ciudades).

### FASE 2: Generación de Contenido IA
1.  Crear script `scripts/generate-geo-content.ts` (OpenAI).
2.  Generar contenido para 1 Ciudad Piloto (ej: Madrid) y 3 Pueblos Piloto.

### FASE 3: Routing & Frontend
1.  Crear `app/(website)/[serviceSlug]/[citySlug]/page.tsx`.
2.  Implementar `generateStaticParams`.
3.  Implementar `generateMetadata` (Schema `Service` + `AreaServed`).
4.  Crear generador de Breadcrumbs lógico.

### FASE 4: Componentes Visuales
1.  Adaptar `ServiceHeader` para aceptar props locales.
2.  Crear `ComparisonTable.tsx`.
3.  Crear `NearbyLocations.tsx`.
4.  Crear Generador de Imágenes OG (`/app/api/og/route.tsx`).

### FASE 5: El Configurados (/planes)
1.  Desarrollar página `/planes` con Framer Motion (Wizard).
2.  Conectar lógica de precios desde Sanity.

---

## 7. ✅ CRITERIOS DE ÉXITO

*   **URL:** `/desarrollo-web/getafe` carga y devuelve 200 OK.
*   **Schema:** Google Rich Results Tool valida `Service` con `areaServed: Getafe`.
*   **Breadcrumb:** Muestra `... > Madrid > Getafe`.
*   **Content:** El texto menciona la economía local de Getafe.
*   **Precios:** Cambiar en Sanity -> Cambia en Home, Servicio y Landing Local.

---

## 8. ⚠️ CHECKLIST DE SEGURIDAD SEO (WHITE HAT ESTRICTO)

*   [ ] **Canonical Tags:** La landing de Getafe debe tener canonical a sí misma (no a la de Madrid).
*   [ ] **Sitemap.xml:** Debe incluir todas las URLs generadas.
*   [ ] **Orphan Pages:** Asegurar que el componente `Interlinking` conecta todo.
*   [ ] **Schema Correcto (Service Area):**
    *   ✅ USAR: `areaServed` (Prestamos servicio aquí).
    *   ❌ PROHIBIDO: `address` o `LocalBusiness` con dirección inventada en la ciudad destino. Eso es penalización garantizada.
    *   La única dirección física en Schema será la de la Sede Central (si aplica).
*   [ ] **Contenido Honesto:** El copy dirá "Servicio para empresas de Getafe", nunca "Nuestras oficinas en Getafe".

---

## 9. 📋 CHECKLIST OPERATIVO DE EJECUCIÓN (LIVING DOCUMENT)

Este checklist se actualizará en tiempo real a medida que completemos hitos. Antes de marcar un check, se debe realizar la verificación técnica correspondiente.

### FASE 0: PREPARACIÓN Y SEGURIDAD
- [ ] **Backup:** Verificar que el estado actual de `master` es estable y desplegable.
- [ ] **Auditoría de Precios:** Listar todos los lugares donde hay precios hardcodeados actualmente (UI components).
- [ ] **Sanity Check:** Verificar que no hay schemas con errores de tipado antes de añadir nuevos.

### FASE 1: ARQUITECTURA DE DATOS (SANITY)
- [ ] **Crear Schema `location.ts`:**
    - [ ] Definir campos: name, slug, type (city/town), parent, population, gentilicio, geoContext, coordinates.
    - [ ] Verificar validación de slug.
- [ ] **Crear Schema `pricingPlan.ts`:**
    - [ ] Definir campos: title, price, currency, period, features, buttonText, buttonLinkID.
    - [ ] Verificar que soporta suscripciones y pagos únicos.
- [ ] **Crear Schema `serviceLocation.ts`:**
    - [ ] Definir referencias a `service` y `location`.
    - [ ] Definir campos de Override SEO (title, description).
    - [ ] Definir campos de Override Content (heroHeadline, heroText, localContentBlock).
    - [ ] Definir campos Relacionales (customTestimonials, customProjects).
- [ ] **Actualizar `sanity/schemaTypes/index.ts`:** Registrar los nuevos schemas.
- [ ] **Actualizar `sanity/structure.ts`:** Crear vistas filtradas para "Ciudades", "Planes" y "Landings Locales" para que el CMS sea usable.

### FASE 2: MIGRACIÓN Y SEMILLADO DE DATOS
- [ ] **Script `seed-locations.ts`:**
    - [ ] Importar JSON de municipios de España (> 20.000 hab).
    - [ ] Poblar Sanity con jerarquía (Madrid -> Getafe).
- [ ] **Migración de Precios:**
    - [ ] Crear documentos `pricingPlan` en Sanity para los servicios actuales.
    - [ ] (Opcional) Script para vincular servicios existentes a los nuevos planes.

### FASE 3: FRONTEND - ROUTING & SEO
- [ ] **Ruta Dinámica:** Crear `app/(website)/[serviceSlug]/[citySlug]/page.tsx`.
    - [ ] Validar que `params.serviceSlug` existe.
    - [ ] Validar que `params.citySlug` existe.
    - [ ] Implementar `generateStaticParams` para ISR.
- [ ] **Lógica de Breadcrumbs:**
    - [ ] Actualizar `breadcrumbs.tsx` o crear `GeoBreadcrumbs.tsx`.
    - [ ] Implementar lógica de padres (Getafe -> Madrid).
- [ ] **Metadatos Dinámicos:**
    - [ ] Implementar `generateMetadata` en la página dinámica.
    - [ ] Inyectar Schema.org `Service` con `areaServed`.
    - [ ] Inyectar Canonical URL correcta.

### FASE 4: FRONTEND - COMPONENTES UI (NUEVOS)
- [ ] **Adaptar `HeroSection`:** Aceptar `headline` y `subtitle` opcionales (override).
- [ ] **Crear `ComparisonTable.tsx`:** Diseño "Us vs Them".
- [ ] **Crear `NearbyLocations.tsx`:** Lógica para buscar pueblos cercanos en el mismo `parent`.
- [ ] **Crear `LocalFAQ.tsx`:** Componente de preguntas frecuentes con Schema.
- [ ] **Generador de Imágenes (`og-image`):**
    - [ ] Ruta `/api/og`.
    - [ ] Diseño con `@vercel/og` (Logo + Texto Ciudad + Fondo Oscuro).

### FASE 5: EL CONFIGURADOR (/PLANES)
- [ ] **Página `/planes/page.tsx`:**
    - [ ] Layout limpio (sin header/footer distractores).
- [ ] **Componente Wizard (Framer Motion):**
    - [ ] Paso 1: Selección de Servicio (Fetch de `pricingPlan`).
    - [ ] Paso 2: Selección de Add-ons.
    - [ ] Paso 3: Selección Local.
- [ ] **Formulario Final:**
    - [ ] Inputs: Nombre, Email, Teléfono, Mensaje.
    - [ ] Validación con Zod.
- [ ] **Backend Action:**
    - [ ] Server Action para enviar email a `info@onbast.com`.
    - [ ] Template de email con resumen del pedido.

### FASE 6: AUTOMATIZACIÓN DE CONTENIDO (IA)
- [ ] **Script `generate-geo-content.ts`:**
    - [ ] Configurar cliente OpenAI (Gemini 3.0 Preview).
    - [ ] Prompt Engineering (Estructura JSON estricta).
    - [ ] Lógica de iteración (Servicio x Ciudad).
    - [ ] Escritura en Sanity.

### FASE 7: QA & VALIDACIÓN FINAL
- [ ] **Validación SEO:** Rich Results Test (Verde en todos los schemas).
- [ ] **Validación Visual:** Revisar responsive en móvil (tablas, imágenes).
- [ ] **Validación Funcional:** Probar el formulario de `/planes` end-to-end.
- [ ] **Performance:** Lighthouse Score > 90.

