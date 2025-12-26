import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { z } from 'zod';

// --- CONFIGURACIÓN DE ENTORNO ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

// Cargar variables de entorno
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((rawLine) => {
    const line = String(rawLine || '').trim();
    if (!line.length || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!key.length) return;
    process.env[key] = value.replace(/^["']|["']$/g, '');
  });
}

if (!process.env.SANITY_WRITE_TOKEN) {
  console.error('❌ ERROR: SANITY_WRITE_TOKEN no encontrada en .env.local');
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.error('❌ ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID y/o NEXT_PUBLIC_SANITY_DATASET no encontrados en .env.local');
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY no encontrada en .env.local');
  process.exit(1);
}

// --- CLIENTES ---
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const resolveGeminiModel = () => {
  const envModel = String(process.env.GEMINI_MODEL || '').trim();
  if (envModel) return envModel;
  return 'gemini-3-pro-preview';
};

const geminiGenerateContent = async ({ prompt, model }) => {
  const normalizedModel = String(model || '').trim().startsWith('models/')
    ? String(model || '').trim()
    : `models/${String(model || '').trim()}`;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/${normalizedModel}:generateContent`;
  const requestTimeoutMs = Number.parseInt(process.env.GEMINI_REQUEST_TIMEOUT_MS || '240000', 10);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
      signal: controller.signal,
    });

    const raw = await res.text();
    if (!res.ok) {
      throw new Error(`Gemini HTTP ${res.status}: ${raw.slice(0, 500)}`);
    }

    const payload = JSON.parse(raw);
    const parts = payload?.candidates?.[0]?.content?.parts;
    const text = Array.isArray(parts)
      ? parts.map((p) => (typeof p?.text === 'string' ? p.text : '')).join('')
      : undefined;

    if (!text || typeof text !== 'string') {
      throw new Error(`Gemini response missing text: ${raw.slice(0, 500)}`);
    }

    return text;
  } finally {
    clearTimeout(timeoutId);
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (process.env.DEBUG_GEO_SCRIPT === '1') {
  process.on('beforeExit', (code) => {
    console.log(`ℹ️ beforeExit code=${code}`);
  });

  process.on('exit', (code) => {
    console.log(`ℹ️ exit code=${code}`);
  });
}

const withTimeout = async (promise, ms, label) => {
  const timeoutMs = Number.isFinite(ms) && ms > 0 ? ms : 240000;
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label || 'operation'} timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};

const generationState = {
  delayMs: Number.parseInt(process.env.GEMINI_BASE_DELAY_MS || '45000', 10),
  minDelayMs: Number.parseInt(process.env.GEMINI_MIN_DELAY_MS || '20000', 10),
  maxDelayMs: Number.parseInt(process.env.GEMINI_MAX_DELAY_MS || '180000', 10),
};

const jitter = (ms) => {
  const delta = Math.max(250, Math.floor(ms * 0.15));
  return ms + Math.floor((Math.random() * 2 - 1) * delta);
};

const adaptDelay = ({ ok, retryAfterMs }) => {
  if (!ok) {
    const next = Math.min(generationState.maxDelayMs, Math.max(generationState.delayMs * 2, retryAfterMs || 0));
    generationState.delayMs = next;
    return;
  }

  const next = Math.max(generationState.minDelayMs, Math.floor(generationState.delayMs * 0.9));
  generationState.delayMs = next;
};

// --- LÓGICA DE GENERACIÓN ---

async function getServices() {
  return await sanity.fetch(`*[_type == "service" && defined(slug.current)]{ 
    _id, 
    title, 
    "slug": slug.current, 
    seoTitle,
    seoDescription,
    shortDescription, 
    longDescription,
    overviewText,
    heroHeadline,
    heroHighlight,
    heroIntroduction,
    heroButtonText,
    heroButtonLink,
    heroSecondaryButtonText,
    heroSecondaryButtonLink,
    teamTitle,
    teamHighlight,
    teamDescription,
    featuresTitle,
    featuresHighlight,
    featuresDescription,
    benefits,
    features[] { title, description, icon },
    processTitle,
    processHighlight,
    processDescription,
    process[] { title, description },
    techTitle,
    techHighlight,
    techDescription,
    technologies,
    impactSection {
      title,
      highlight,
      subtitle,
      stats[] { value, prefix, suffix, label, description }
    },
    testimonialsTitle,
    testimonialsHighlight,
    testimonialsDescription,
    relatedProjectsTitle,
    relatedProjectsHighlight,
    relatedProjectsDescription,
    faqTitle,
    faqHighlight,
    faqDescription,
    faqs[] { question, answer },
    pricing { title, subtitle },
    ctaSection { title, description, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink }
  }`);
}

async function getLocations() {
  return await sanity.fetch(`*[_type == "location" && defined(slug.current)]{ _id, name, type, "slug": slug.current, geoContext, "parentName": parent->name }`);
}

const geoContentSchema = z.object({
  seoTitle: z.string().min(1).max(70),
  seoDescription: z.string().min(1).max(160),
  heroHeadline: z.string().min(1),
  heroText: z.string().min(1),
  heroButtonText: z.string().min(1),
  heroButtonLink: z.string().min(1),
  heroSecondaryButtonText: z.string().min(1),
  heroSecondaryButtonLink: z.string().min(1),
  longDescription: z.string().min(1),
  overviewText: z.string().min(1),
  featuresTitle: z.string().min(1),
  featuresHighlight: z.string().min(1),
  featuresDescription: z.string().min(1),
  benefits: z.array(z.string().min(1)).min(1),
  processTitle: z.string().min(1),
  processHighlight: z.string().min(1),
  processDescription: z.string().min(1),
  techTitle: z.string().min(1),
  techHighlight: z.string().min(1),
  techDescription: z.string().min(1),
  technologies: z.array(z.string().min(1)).min(1),
  impactSection: z.object({
    title: z.string().min(1),
    highlight: z.string().min(1),
    subtitle: z.string().min(1),
    stats: z.array(z.object({
      value: z.number(),
      prefix: z.string().optional(),
      suffix: z.string().optional(),
      label: z.string().min(1),
      description: z.string().optional(),
    }).passthrough()),
  }).passthrough().optional(),
  teamTitle: z.string().min(1),
  teamHighlight: z.string().min(1),
  teamDescription: z.string().min(1),
  testimonialsTitle: z.string().min(1),
  testimonialsHighlight: z.string().min(1),
  testimonialsDescription: z.string().min(1),
  relatedProjectsTitle: z.string().min(1),
  relatedProjectsHighlight: z.string().min(1),
  relatedProjectsDescription: z.string().min(1),
  faqTitle: z.string().min(1),
  faqHighlight: z.string().min(1),
  faqDescription: z.string().min(1),
  localContentBlock: z.array(z.object({ _type: z.string().min(1) }).passthrough()).min(12),
  customFeatures: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    icon: z.string().optional(),
  }).passthrough()).min(1),
  customProcess: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }).passthrough()).min(1),
  customFaqs: z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
  }).passthrough()).min(1),
  ctaSection: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    buttonText: z.string().min(1),
    buttonLink: z.string().min(1),
    secondaryButtonText: z.string().min(1),
    secondaryButtonLink: z.string().min(1),
  }).passthrough(),
}).passthrough();

const addKeys = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(addKeys);
  const out = { ...obj };
  if (!out._key) out._key = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  Object.keys(out).forEach((k) => {
    out[k] = addKeys(out[k]);
  });
  return out;
};

const safeJsonParse = (input) => {
  const trimmed = String(input || '').trim();
  const withoutFences = trimmed
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '');
  return JSON.parse(withoutFences);
};

const estimatePortableTextWordCount = (nodes) => {
  if (!Array.isArray(nodes)) return 0;
  const text = nodes
    .filter((n) => n && typeof n === 'object' && n._type === 'block')
    .flatMap((n) => Array.isArray(n.children) ? n.children : [])
    .map((c) => (typeof c?.text === 'string' ? c.text : ''))
    .join(' ');
  const words = text
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  return words.length;
};

const countPortableTextH2 = (nodes) => {
  if (!Array.isArray(nodes)) return 0;
  return nodes.filter((n) => n && typeof n === 'object' && n._type === 'block' && n.style === 'h2').length;
};

async function generateContent(service, location, model) {
  console.log(`🤖 Generando contenido (Gemini) para: ${service.title} en ${location.name}...`);

  const desiredFeaturesCount = Array.isArray(service.features) && service.features.length ? service.features.length : 6;
  const desiredProcessCount = Array.isArray(service.process) && service.process.length ? service.process.length : 5;
  const desiredFaqCount = Number.parseInt(process.env.GEO_FAQ_COUNT || '6', 10);
  const desiredBenefitsCount = Array.isArray(service.benefits) && service.benefits.length ? service.benefits.length : 6;
  const desiredTechCount = Array.isArray(service.technologies) && service.technologies.length ? service.technologies.length : 8;
  const baseImpactStats = Array.isArray(service.impactSection?.stats) ? service.impactSection.stats : [];

  // Construir contexto rico del servicio para la IA
  const serviceContext = `
    SEO BASE:
    - seoTitle: ${service.seoTitle || 'N/A'}
    - seoDescription: ${service.seoDescription || 'N/A'}

    HERO BASE:
    - headline: ${service.heroHeadline || 'N/A'}
    - highlight: ${service.heroHighlight || 'N/A'}
    - introduction: ${service.heroIntroduction || 'N/A'}
    - buttonText: ${service.heroButtonText || 'N/A'}
    - buttonLink: ${service.heroButtonLink || 'N/A'}
    - secondaryButtonText: ${service.heroSecondaryButtonText || 'N/A'}
    - secondaryButtonLink: ${service.heroSecondaryButtonLink || 'N/A'}

    LONG DESCRIPTION BASE: ${service.longDescription || 'N/A'}
    OVERVIEW BASE: ${service.overviewText || 'N/A'}

    TEAM BASE:
    - title: ${service.teamTitle || 'N/A'}
    - highlight: ${service.teamHighlight || 'N/A'}
    - description: ${service.teamDescription || 'N/A'}

    FEATURES BASE:
    - title: ${service.featuresTitle || 'N/A'}
    - highlight: ${service.featuresHighlight || 'N/A'}
    - description: ${service.featuresDescription || 'N/A'}
    - items:
    ${Array.isArray(service.features) && service.features.length ? service.features.map((f) => `      - ${f.title}: ${f.description} (icon: ${f.icon || 'N/A'})`).join('\n') : '      - N/A'}

    BENEFITS BASE:
    ${Array.isArray(service.benefits) && service.benefits.length ? service.benefits.map((b) => `      - ${b}`).join('\n') : '      - N/A'}

    PROCESS BASE:
    - title: ${service.processTitle || 'N/A'}
    - highlight: ${service.processHighlight || 'N/A'}
    - description: ${service.processDescription || 'N/A'}
    - steps:
    ${Array.isArray(service.process) && service.process.length ? service.process.map((p) => `      - ${p.title}: ${p.description}`).join('\n') : '      - N/A'}

    TECH BASE:
    - title: ${service.techTitle || 'N/A'}
    - highlight: ${service.techHighlight || 'N/A'}
    - description: ${service.techDescription || 'N/A'}
    - stack: ${Array.isArray(service.technologies) && service.technologies.length ? service.technologies.join(', ') : 'N/A'}

    IMPACT BASE:
    - title: ${service.impactSection?.title || 'N/A'}
    - highlight: ${service.impactSection?.highlight || 'N/A'}
    - subtitle: ${service.impactSection?.subtitle || 'N/A'}
    - stats:
    ${baseImpactStats.length ? baseImpactStats.map((s) => `      - value:${s.value} prefix:${s.prefix || ''} suffix:${s.suffix || ''} label:${s.label} description:${s.description || ''}`).join('\n') : '      - N/A'}

    TESTIMONIALS BASE:
    - title: ${service.testimonialsTitle || 'N/A'}
    - highlight: ${service.testimonialsHighlight || 'N/A'}
    - description: ${service.testimonialsDescription || 'N/A'}

    PROJECTS BASE:
    - title: ${service.relatedProjectsTitle || 'N/A'}
    - highlight: ${service.relatedProjectsHighlight || 'N/A'}
    - description: ${service.relatedProjectsDescription || 'N/A'}

    FAQ BASE:
    - title: ${service.faqTitle || 'N/A'}
    - highlight: ${service.faqHighlight || 'N/A'}
    - description: ${service.faqDescription || 'N/A'}
    - items:
    ${Array.isArray(service.faqs) && service.faqs.length ? service.faqs.map((f) => `      Q: ${f.question} A: ${f.answer}`).join('\n') : '      - N/A'}

    CTA BASE:
    - title: ${service.ctaSection?.title || 'N/A'}
    - description: ${service.ctaSection?.description || 'N/A'}
    - buttonText: ${service.ctaSection?.buttonText || 'N/A'}
    - buttonLink: ${service.ctaSection?.buttonLink || 'N/A'}
    - secondaryButtonText: ${service.ctaSection?.secondaryButtonText || 'N/A'}
    - secondaryButtonLink: ${service.ctaSection?.secondaryButtonLink || 'N/A'}

    PRICING BASE:
    - title: ${service.pricing?.title || 'N/A'}
    - subtitle: ${service.pricing?.subtitle || 'N/A'}
  `;

  const prompt = `
    Actúa como un Copywriter Senior especializado en Marketing Digital, con un tono moderno, disruptivo, directo y de alta autoridad (Estilo Agencia Vercel/Stripe pero más agresivo).
    
    TU OBJETIVO: Generar el contenido para una Landing Page Local (GEO - Generative Engine Optimization).
    
    DATOS DEL SERVICIO:
    - Servicio: ${service.title}
    - Descripción: ${service.shortDescription}
    - Beneficios Clave: ${service.benefits ? service.benefits.join(', ') : 'Calidad, Rapidez, Precio, modelo de Suscripción'}
    
    CONTEXTO TÉCNICO Y DE NEGOCIO (ÚSALO PARA DAR PROFUNDIDAD):
    ${serviceContext}
    
    DATOS DE LA UBICACIÓN:
    - Ciudad: ${location.name} (${location.type})
    - Contexto Geo-Económico: ${location.geoContext || 'Ciudad con tejido empresarial activo.'}
    - Región Padre: ${location.parentName || 'España'}

    INSTRUCCIONES DE ESTILO Y FORMATO:
    1. Tono: Profesional pero cortante. Usa frases cortas. Evita el relleno ("fluff"). Ve al grano.
    2. Enfoque: Habla de ROI, crecimiento, tecnología y dominio de mercado. No uses tópicos aburridos como "somos los mejores".
    3. Personalización: Menciona explícitamente ${location.name} y sus zonas/barrios/polígonos si es relevante. Haz que el lector sienta que conoces su realidad local.
    4. Naturalidad: Evita frases que suenen a plantilla. Varía estructuras. No repitas el nombre de la ciudad en cada línea.
    5. Veracidad: No inventes clientes, oficinas ni cifras. Puedes hablar de escenarios comunes y patrones del mercado.

    REGLA ANTI-THIN CONTENT:
    - NO basta con localContentBlock. Debes reescribir y localizar TODAS las secciones listadas.
    - Mantén el significado del servicio base, pero añade contexto local realista.
    - No inventes clientes, oficinas ni cifras.

    SECCIONES A GENERAR (JSON STRICT):

    1. seoTitle: "${service.title} en ${location.name} | ONBAST" (Variar ligeramente para evitar duplicados exactos).
    2. seoDescription: Transaccional. Menciona servicio + ciudad + beneficio clave. Max 155 caracteres.
    3. heroHeadline: H1 Potente. Ej: "Dominio Digital en ${location.name}" o "${service.title} de Alto Rendimiento en ${location.name}".
    4. heroText: Intro de 2 líneas. Conecta la necesidad del servicio con la ambición de las empresas de ${location.name}.
    
    5. heroButtonText: Reescribe el CTA principal para ${location.name}. (NO vacío)
    6. heroButtonLink: usa "${service.heroButtonLink || '/contacto'}".
    7. heroSecondaryButtonText: Reescribe el CTA secundario.
    8. heroSecondaryButtonLink: usa "${service.heroSecondaryButtonLink || '/proyectos'}".

    9. longDescription: Reescribe y localiza la descripción larga.
    10. overviewText: Reescribe y localiza el overview.

    11. featuresTitle / featuresHighlight / featuresDescription:
       - Reescribe y localiza.
       - featuresHighlight debe ser una sola palabra potente.

    12. benefits (EXACTAMENTE ${desiredBenefitsCount} items):
       - Beneficios locales accionables.

    13. processTitle / processHighlight / processDescription:
       - Reescribe y localiza.

    14. techTitle / techHighlight / techDescription:
       - Reescribe y localiza.

    15. technologies (EXACTAMENTE ${desiredTechCount} items):
       - Stack/tecnologías relevantes.

    16. impactSection:
       - Reescribe title/highlight/subtitle.
       - stats debe mantener EXACTAMENTE los mismos value/prefix/suffix del BASE.
       - stats debe tener EXACTAMENTE ${baseImpactStats.length || 0} items.

    17. testimonialsTitle / testimonialsHighlight / testimonialsDescription: Reescribe y localiza.

    17b. teamTitle / teamHighlight / teamDescription: Reescribe y localiza.

    18. relatedProjectsTitle / relatedProjectsHighlight / relatedProjectsDescription: Reescribe y localiza.

    19. faqTitle / faqHighlight / faqDescription: Reescribe y localiza.

    20. localContentBlock (CRÍTICO - EXTENSO + NATURAL):
       - Genera un bloque de contenido estructurado (Portable Text) de unas 900-1200 palabras.
       - Debe sonar humano y coherente con una agencia moderna como ONBAST: directo, técnico, orientado a resultados.
       - NO seas redundante, NO repitas frases, NO uses muletillas tipo "en conclusión".
       - NO menciones que eres una IA ni hables de "prompt"/"modelo".
       - Estructura obligatoria (mínimo 6 secciones H2):
         A) "Contexto en ${location.name}" (mercado y demanda)
         B) "Qué cambia cuando tu web compite por intención local" (SEO/GEO)
         C) "Estrategia ONBAST para ${location.name}" (método)
         D) "Arquitectura técnica que convierte" (performance, UX, tracking)
         E) "Sectores y casos típicos" (sin inventar clientes)
         F) "Plan de acción en 30-60-90 días" (bullet points)
       - Usa H3 (estilo "h3") para sub-bloques accionables dentro de cada H2.
       - Usa H3 (estilo "h3") para sub-bloques accionables.
       - Usa listas (bullet points) para ventajas y para el plan 30-60-90.
       - Menciona la economía local o sectores predominantes en ${location.name} y cómo este servicio les ayuda.
       - Añade micro-ejemplos reales (sin inventar clientes ni oficinas) y menciona áreas empresariales/zona industrial si aplica.
       - Inserta términos léxico-semánticos relevantes (sin keyword stuffing) alrededor de ${service.title} en ${location.name}.
    
    21. customFeatures (EXACTAMENTE ${desiredFeaturesCount} items):
       - Reescribe desde FEATURES BASE.

    22. customProcess (EXACTAMENTE ${desiredProcessCount} items):
       - Reescribe desde PROCESS BASE.

    23. customFaqs (EXACTAMENTE ${desiredFaqCount} items):
       - Reescribe desde FAQ BASE con preguntas hiper-locales.

    24. ctaSection (LOCALIZADO):
       - title: Un cierre agresivo y local (menciona ${location.name}).
       - description: 2-3 líneas, orientado a conversión, sin clichés ni promesas vagas.
       - buttonText: orientado a acción.
       - buttonLink: siempre "/contacto".
       - secondaryButtonText: orientado a prueba social/portfolio.
       - secondaryButtonLink: siempre "/proyectos".

    FORMATO DE RESPUESTA JSON (Estricto):
    {
      "seoTitle": "string",
      "seoDescription": "string",
      "heroHeadline": "string",
      "heroText": "string",
      "heroButtonText": "string",
      "heroButtonLink": "string",
      "heroSecondaryButtonText": "string",
      "heroSecondaryButtonLink": "string",
      "longDescription": "string",
      "overviewText": "string",
      "featuresTitle": "string",
      "featuresHighlight": "string",
      "featuresDescription": "string",
      "benefits": ["string"],
      "processTitle": "string",
      "processHighlight": "string",
      "processDescription": "string",
      "techTitle": "string",
      "techHighlight": "string",
      "techDescription": "string",
      "technologies": ["string"],
      "impactSection": {
        "title": "string",
        "highlight": "string",
        "subtitle": "string",
        "stats": [{ "value": 0, "prefix": "string", "suffix": "string", "label": "string", "description": "string" }]
      },
      "testimonialsTitle": "string",
      "testimonialsHighlight": "string",
      "testimonialsDescription": "string",
      "teamTitle": "string",
      "teamHighlight": "string",
      "teamDescription": "string",
      "relatedProjectsTitle": "string",
      "relatedProjectsHighlight": "string",
      "relatedProjectsDescription": "string",
      "faqTitle": "string",
      "faqHighlight": "string",
      "faqDescription": "string",
      "localContentBlock": [
        {
          "_type": "block",
          "style": "h2",
          "children": [{ "_type": "span", "text": "Título de Sección Potente" }]
        },
        {
          "_type": "block",
          "style": "normal",
          "children": [{ "_type": "span", "text": "Párrafo con insights de valor sobre el mercado local..." }]
        },
        {
          "_type": "block",
          "listItem": "bullet",
          "level": 1,
          "style": "normal",
          "children": [{ "_type": "span", "text": "Ventaja competitiva 1" }]
        }
      ],
      "customFeatures": [
        { "title": "string", "description": "string" }
      ],
      "customProcess": [
        { "title": "string", "description": "string" }
      ],
      "customFaqs": [
        { "question": "string", "answer": "string" }
      ],
      "ctaSection": {
        "title": "string",
        "description": "string",
        "buttonText": "string",
        "buttonLink": "/contacto",
        "secondaryButtonText": "string",
        "secondaryButtonLink": "/proyectos"
      }
    }
  `;

  try {
    let lastError = null;

    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        console.log(`↻ Attempt ${attempt}/5 (delay ${generationState.delayMs}ms)`);
        const requestTimeoutMs = Number.parseInt(process.env.GEMINI_REQUEST_TIMEOUT_MS || '240000', 10);
        console.log(`→ Gemini request chars: ${prompt.length} (timeout ${requestTimeoutMs}ms)`);
        console.log('→ Gemini call start');
        const geminiPromise = geminiGenerateContent({ prompt, model });
        console.log(`→ Gemini promise then=${typeof geminiPromise?.then}`);
        const text = await withTimeout(geminiPromise, requestTimeoutMs, 'Gemini generateContent');
        console.log(`← Gemini response chars: ${String(text || '').length}`);

        adaptDelay({ ok: true });

        const parsed = safeJsonParse(text);
        const validated = geoContentSchema.parse(parsed);
        const content = addKeys(validated);

        const words = estimatePortableTextWordCount(content.localContentBlock);
        const h2Count = countPortableTextH2(content.localContentBlock);
        if (words < 750 || words > 1600) {
          throw new Error(`localContentBlock debe tener entre 750 y 1600 palabras (tiene ${words})`);
        }
        if (h2Count < 6) {
          throw new Error(`localContentBlock debe incluir al menos 6 bloques h2 (tiene ${h2Count})`);
        }

        if (content.customFeatures?.length !== desiredFeaturesCount) {
          throw new Error(`customFeatures debe tener ${desiredFeaturesCount} items (tiene ${content.customFeatures?.length || 0})`);
        }

        if (content.customProcess?.length !== desiredProcessCount) {
          throw new Error(`customProcess debe tener ${desiredProcessCount} items (tiene ${content.customProcess?.length || 0})`);
        }

        if (content.customFaqs?.length !== desiredFaqCount) {
          throw new Error(`customFaqs debe tener ${desiredFaqCount} items (tiene ${content.customFaqs?.length || 0})`);
        }

        if (content.benefits?.length !== desiredBenefitsCount) {
          throw new Error(`benefits debe tener ${desiredBenefitsCount} items (tiene ${content.benefits?.length || 0})`);
        }

        if (content.technologies?.length !== desiredTechCount) {
          throw new Error(`technologies debe tener ${desiredTechCount} items (tiene ${content.technologies?.length || 0})`);
        }

        if (baseImpactStats.length) {
          if (!content.impactSection?.stats || content.impactSection.stats.length !== baseImpactStats.length) {
            throw new Error(`impactSection.stats debe tener ${baseImpactStats.length} items`);
          }
          content.impactSection.stats.forEach((stat, idx) => {
            const base = baseImpactStats[idx];
            if (stat.value !== base.value) throw new Error(`impactSection.stats[${idx}].value debe ser ${base.value}`);
            if ((stat.prefix || '') !== (base.prefix || '')) throw new Error(`impactSection.stats[${idx}].prefix debe ser "${base.prefix || ''}"`);
            if ((stat.suffix || '') !== (base.suffix || '')) throw new Error(`impactSection.stats[${idx}].suffix debe ser "${base.suffix || ''}"`);
          });
        }

        if (content.customFeatures && service.features) {
          content.customFeatures = content.customFeatures.map((f, i) => ({
            ...f,
            icon: f.icon || service.features[i]?.icon || 'CheckCircle2',
          }));
        }

        content.heroButtonLink = service.heroButtonLink || '/contacto';
        content.heroSecondaryButtonLink = service.heroSecondaryButtonLink || '/proyectos';

        if (content.ctaSection) {
          content.ctaSection.buttonLink = '/contacto';
          content.ctaSection.secondaryButtonLink = '/proyectos';
        }

        return content;
      } catch (err) {
        lastError = err;
        console.error(`❌ Fallo attempt ${attempt}:`, err?.message || err);
        adaptDelay({ ok: false, retryAfterMs: undefined });
        await sleep(jitter(generationState.delayMs));
      }
    }

    console.error(`❌ Error generando contenido para ${location.name}:`, lastError);
    return null;
  } catch (error) {
    console.error(`❌ Error generando contenido para ${location.name}:`, error);
    return null;
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const arg = (name) => {
    const hit = argv.find((a) => a === name || a.startsWith(`${name}=`));
    if (!hit) return undefined;
    const idx = hit.indexOf('=');
    return idx === -1 ? '' : hit.slice(idx + 1);
  };
  const has = (name) => argv.includes(name);
  const parseCsv = (value) => String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const dryRun = !has('--yes') || process.env.DRY_RUN === '1' || has('--dry-run');
  const updateExisting = has('--update-existing') || process.env.UPDATE_EXISTING === '1' || !has('--only-missing');
  const limit = Number.parseInt(arg('--limit') || process.env.LIMIT || '0', 10);
  const serviceSlugsFilter = parseCsv(arg('--service-slugs') || process.env.SERVICE_SLUGS);
  const locationSlugsFilter = parseCsv(arg('--location-slugs') || process.env.LOCATION_SLUGS);
  const batchSize = Number.parseInt(arg('--batch-size') || process.env.BATCH_SIZE || '5', 10);
  const batchPauseMs = Number.parseInt(arg('--batch-pause-ms') || process.env.BATCH_PAUSE_MS || '60000', 10);

  const resolvedGeminiModel = resolveGeminiModel();

  console.log('🚀 Iniciando Generación de Contenido GEO (Programmatic SEO)...');
  console.log(`Modelo: ${resolvedGeminiModel}`);
  console.log(`Dry-run: ${dryRun ? 'SÍ' : 'NO'}`);
  console.log(`Update existing: ${updateExisting ? 'SÍ' : 'NO'}`);
  console.log(`Limit: ${Number.isFinite(limit) ? limit : 0}`);
  if (dryRun) {
    console.log('⚠️ DRY RUN: no se escribirá nada en Sanity. Ejecuta con --yes para crear/actualizar documentos.');
  }
  if (serviceSlugsFilter.length) console.log(`Filtro servicios: ${serviceSlugsFilter.join(', ')}`);
  if (locationSlugsFilter.length) console.log(`Filtro ubicaciones: ${locationSlugsFilter.join(', ')}`);

  const services = await getServices();
  const locations = await getLocations();

  const selectedServices = serviceSlugsFilter.length
    ? services.filter((s) => serviceSlugsFilter.includes(s.slug))
    : services;

  const selectedLocations = locationSlugsFilter.length
    ? locations.filter((l) => locationSlugsFilter.includes(l.slug))
    : locations;

  console.log(`📍 Servicios: ${selectedServices.length} | Ubicaciones: ${selectedLocations.length}`);

  let createdCount = 0;
  let updatedCount = 0;
  let processedCount = 0;

  for (const service of selectedServices) {
    for (const location of selectedLocations) {
      if (limit > 0 && createdCount >= limit) {
        console.log(`🏁 Límite alcanzado: ${createdCount}`);
        return;
      }

      const existing = await sanity.fetch(
        `*[_type == "serviceLocation" && service._ref == $serviceId && location._ref == $locationId][0]{ _id }`,
        { serviceId: service._id, locationId: location._id }
      );
      const existingId = existing?._id;

      if (existingId && !updateExisting) {
        console.log(`⏩ Saltando (Ya existe): ${service.title} - ${location.name}`);
        continue;
      }

      // 2. Generar Contenido
      const content = await generateContent(service, location, resolvedGeminiModel);

      if (!content) continue;

      // 3. Guardar en Sanity
      try {
        if (!dryRun) {
          const nextDoc = {
            service: { _type: 'reference', _ref: service._id },
            location: { _type: 'reference', _ref: location._id },
            seoTitle: content.seoTitle,
            seoDescription: content.seoDescription,
            heroHeadline: content.heroHeadline,
            heroText: content.heroText,
            heroButtonText: content.heroButtonText,
            heroButtonLink: content.heroButtonLink,
            heroSecondaryButtonText: content.heroSecondaryButtonText,
            heroSecondaryButtonLink: content.heroSecondaryButtonLink,
            longDescription: content.longDescription,
            overviewText: content.overviewText,
            featuresTitle: content.featuresTitle,
            featuresHighlight: content.featuresHighlight,
            featuresDescription: content.featuresDescription,
            benefits: content.benefits,
            processTitle: content.processTitle,
            processHighlight: content.processHighlight,
            processDescription: content.processDescription,
            techTitle: content.techTitle,
            techHighlight: content.techHighlight,
            techDescription: content.techDescription,
            technologies: content.technologies,
            impactSection: content.impactSection,
            teamTitle: content.teamTitle,
            teamHighlight: content.teamHighlight,
            teamDescription: content.teamDescription,
            testimonialsTitle: content.testimonialsTitle,
            testimonialsHighlight: content.testimonialsHighlight,
            testimonialsDescription: content.testimonialsDescription,
            relatedProjectsTitle: content.relatedProjectsTitle,
            relatedProjectsHighlight: content.relatedProjectsHighlight,
            relatedProjectsDescription: content.relatedProjectsDescription,
            faqTitle: content.faqTitle,
            faqHighlight: content.faqHighlight,
            faqDescription: content.faqDescription,
            localContentBlock: content.localContentBlock,
            ctaSection: content.ctaSection,
            customFeatures: content.customFeatures,
            customProcess: content.customProcess,
            customFaqs: content.customFaqs,
          };

          if (existingId) {
            await sanity.patch(existingId).set(nextDoc).commit();
          } else {
            await sanity.create({ _type: 'serviceLocation', ...nextDoc });
          }
        }

        if (existingId) {
          updatedCount += 1;
        } else {
          createdCount += 1;
        }
        console.log(`✅ ${dryRun ? 'Dry-run' : (existingId ? 'Actualizado' : 'Creado')}: ${service.title} en ${location.name}`);

        if (limit > 0 && createdCount >= limit) {
          console.log(`🏁 Límite alcanzado: ${createdCount}`);
          return;
        }
      } catch (err) {
        console.error(`❌ Error guardando en Sanity:`, err.message);
      }

      processedCount += 1;
      if (batchSize > 0 && processedCount % batchSize === 0) {
        await sleep(jitter(Math.max(generationState.delayMs, batchPauseMs)));
      } else {
        await sleep(jitter(generationState.delayMs));
      }
    }
  }

  console.log(`🏁 Proceso Finalizado. Creados: ${createdCount}`);
  if (updatedCount) console.log(`🔁 Actualizados: ${updatedCount}`);
}

try {
  await main();
} catch (err) {
  console.error(err);
  process.exitCode = 1;
}
