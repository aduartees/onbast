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

// Cargar variables de entorno (Parser manual mejorado)
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((rawLine) => {
    const line = String(rawLine || '').trim();
    if (!line.length || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // Eliminar comillas envolventes si existen
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

const argv = process.argv.slice(2);
const runEnabled = argv.includes('--run') || process.env.RUN_GENERATION === '1';
const writeEnabled = argv.includes('--write') || process.env.WRITE_TO_SANITY === '1';
const purgeEnabled = argv.includes('--purge') || process.env.PURGE_SERVICE_LOCATIONS === '1';
const localContentOnlyEnabled = argv.includes('--local-content-only') || process.env.LOCAL_CONTENT_ONLY === '1';

if (!process.env.SANITY_WRITE_TOKEN) {
  console.error('❌ ERROR: SANITY_WRITE_TOKEN no encontrada en .env.local');
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.error('❌ ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID y/o NEXT_PUBLIC_SANITY_DATASET no encontrados en .env.local');
  process.exit(1);
}

if (purgeEnabled && !writeEnabled) {
  console.error('❌ ERROR: Para borrar landings debes usar --write (o WRITE_TO_SANITY=1).');
  process.exit(1);
}

if (runEnabled && !process.env.GEMINI_API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY no encontrada en .env.local');
  process.exit(1);
}

// --- CLIENTES ---
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2025-01-01', // Actualizado a 2025
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
  const maxOutputTokens = Number.parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS || '8192', 10); // Aumentado para respuestas largas
  const temperature = Number.parseFloat(process.env.GEMINI_TEMPERATURE || '0.7');
  const thinkingLevelRaw = String(process.env.GEMINI_THINKING_LEVEL || 'high').trim().toLowerCase();
  const thinkingLevel = thinkingLevelRaw === 'low' ? 'low' : 'high';
  const shouldSendThinkingConfig = normalizedModel.includes('gemini-3');
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
          maxOutputTokens,
          temperature,
          ...(shouldSendThinkingConfig ? { thinkingConfig: { thinkingLevel } } : {}),
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
  delayMs: Number.parseInt(process.env.GEMINI_BASE_DELAY_MS || '15000', 10),
  minDelayMs: Number.parseInt(process.env.GEMINI_MIN_DELAY_MS || '5000', 10),
  maxDelayMs: Number.parseInt(process.env.GEMINI_MAX_DELAY_MS || '60000', 10),
};

const landingDelayMs = Number.parseInt(process.env.GEO_LANDING_DELAY_MS || '60000', 10);

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
    pricing {
      title,
      subtitle,
      trustedCompaniesTitle,
      schemaAdditionalProperty[]{ name, value }
    },
    ctaSection { title, description, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink }
  }`);
}

async function getLocations() {
  return await sanity.fetch(`*[_type == "location" && defined(slug.current)]{ _id, name, type, "slug": slug.current, geoContext, "parentName": parent->name }`);
}

// Zod Schema relajado para evitar fallos por detalles menores
const geoContentSchema = z.object({
  seoTitle: z.string().min(1).max(60),
  seoDescription: z.string().min(1).max(160),
  heroHeadline: z.string().min(1).max(60),
  heroText: z.string().min(1),
  heroButtonText: z.string().min(1),
  heroButtonLink: z.string().nullable().optional(),
  heroSecondaryButtonText: z.string().nullable().optional(),
  heroSecondaryButtonLink: z.string().nullable().optional(),
  longDescription: z.string().min(1),
  overviewText: z.string().min(1),
  featuresTitle: z.string().min(1),
  featuresHighlight: z.string().min(1),
  featuresDescription: z.string().min(1),
  benefits: z.array(z.string()).min(1),
  processTitle: z.string().min(1),
  processHighlight: z.string().min(1),
  processDescription: z.string().min(1),
  techTitle: z.string().min(1),
  techHighlight: z.string().min(1),
  techDescription: z.string().min(1),
  technologies: z.array(z.string()).min(1),
  impactSection: z.object({
    title: z.string().min(1),
    highlight: z.string().min(1),
    subtitle: z.string().min(1),
    stats: z.array(z.object({
      value: z.number(),
      prefix: z.string().nullable().optional(),
      suffix: z.string().nullable().optional(),
      label: z.string().min(1),
      description: z.string().nullable().optional(),
    })),
  }).optional(),
  pricingTitle: z.string().min(1),
  pricingSubtitle: z.string().min(1),
  pricingTrustedCompaniesTitle: z.string().min(1),
  pricingSchemaAdditionalProperty: z.array(z.object({
    name: z.string().min(1),
    value: z.string().min(1),
  })).min(1),
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
  localContentBlock: z.array(z.object({ _type: z.string().min(1) }).passthrough()).min(4), // Reducido min a 4 para ser flexible
  customFeatures: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    icon: z.string().nullable().optional(),
  })).min(1),
  customProcess: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  })).min(1),
  customFaqs: z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
  })).min(1),
  ctaSection: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    buttonText: z.string().min(1),
    buttonLink: z.string().nullable().optional(),
    secondaryButtonText: z.string().nullable().optional(),
    secondaryButtonLink: z.string().nullable().optional(),
  }),
});

const localContentOnlySchema = z.object({
  localContentBlock: geoContentSchema.shape.localContentBlock,
});

const stripNullsDeep = (value) => {
  if (value === null) return undefined;
  if (Array.isArray(value)) {
    const next = value
      .map((v) => stripNullsDeep(v))
      .filter((v) => v !== undefined);
    return next;
  }
  if (!value || typeof value !== 'object') return value;

  const out = {};
  Object.entries(value).forEach(([k, v]) => {
    const next = stripNullsDeep(v);
    if (next !== undefined) out[k] = next;
  });
  return out;
};

const addKeys = (value, isArrayItemObject = false) => {
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((item) => addKeys(item, true));
  const out = { ...value };
  if (isArrayItemObject && !out._key) out._key = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  Object.keys(out).forEach((k) => {
    out[k] = addKeys(out[k], false);
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
  return text.split(/\s+/).filter(Boolean).length;
};

const countPortableTextH2 = (nodes) => {
  if (!Array.isArray(nodes)) return 0;
  return nodes.filter((n) => n && typeof n === 'object' && n._type === 'block' && n.style === 'h2').length;
};

async function generateContent(service, location, model) {
  console.log(`🤖 Generando contenido (Gemini 3 Pro) para: ${service.title} en ${location.name}...`);

  const desiredFeaturesCount = Array.isArray(service.features) && service.features.length ? service.features.length : 6;
  const desiredProcessCount = Array.isArray(service.process) && service.process.length ? service.process.length : 5;
  const desiredFaqCount = Number.parseInt(process.env.GEO_FAQ_COUNT || '6', 10);
  const desiredBenefitsCount = Array.isArray(service.benefits) && service.benefits.length ? service.benefits.length : 6;
  const desiredTechCount = Array.isArray(service.technologies) && service.technologies.length ? service.technologies.length : 8;
  const baseImpactStats = Array.isArray(service.impactSection?.stats) ? service.impactSection.stats : [];

  const clampText = (value, maxLen = 600, { suffix = '…', hard = false } = {}) => {
    const str = typeof value === 'string' ? value.trim() : '';
    if (!str) return '';
    if (!Number.isFinite(maxLen) || maxLen <= 0) return '';
    if (str.length <= maxLen) return str;
    if (hard || !suffix) return str.slice(0, maxLen).trim();
    const suffixLen = String(suffix).length;
    if (suffixLen >= maxLen) return str.slice(0, maxLen).trim();
    return `${str.slice(0, maxLen - suffixLen).trim()}${suffix}`;
  };

  const baseServiceForRewrite = {
    title: clampText(service.title, 160),
    seoTitle: clampText(service.seoTitle, 60, { hard: true }),
    seoDescription: clampText(service.seoDescription, 160, { hard: true }),
    shortDescription: clampText(service.shortDescription, 320),
    longDescription: clampText(service.longDescription, 1400),
    overviewText: clampText(service.overviewText, 1200),
    hero: {
      headline: clampText(service.heroHeadline, 60, { hard: true }),
      highlight: clampText(service.heroHighlight, 140),
      introduction: clampText(service.heroIntroduction, 900),
      buttonText: clampText(service.heroButtonText, 80),
      secondaryButtonText: clampText(service.heroSecondaryButtonText, 80),
    },
    sections: {
      team: {
        title: clampText(service.teamTitle, 140),
        highlight: clampText(service.teamHighlight, 120),
        description: clampText(service.teamDescription, 700),
      },
      features: {
        title: clampText(service.featuresTitle, 140),
        highlight: clampText(service.featuresHighlight, 120),
        description: clampText(service.featuresDescription, 800),
        benefits: Array.isArray(service.benefits) ? service.benefits.map((b) => clampText(b, 140)).filter(Boolean) : [],
        items: Array.isArray(service.features)
          ? service.features
              .map((f) => ({
                title: clampText(f?.title, 140),
                description: clampText(f?.description, 600),
                icon: typeof f?.icon === 'string' ? f.icon : undefined,
              }))
              .filter((f) => f.title && f.description)
          : [],
      },
      process: {
        title: clampText(service.processTitle, 140),
        highlight: clampText(service.processHighlight, 120),
        description: clampText(service.processDescription, 800),
        steps: Array.isArray(service.process)
          ? service.process
              .map((p) => ({
                title: clampText(p?.title, 140),
                description: clampText(p?.description, 700),
              }))
              .filter((p) => p.title && p.description)
          : [],
      },
      tech: {
        title: clampText(service.techTitle, 140),
        highlight: clampText(service.techHighlight, 120),
        description: clampText(service.techDescription, 800),
        technologies: Array.isArray(service.technologies) ? service.technologies.map((t) => clampText(t, 80)).filter(Boolean) : [],
      },
      impactSection: service.impactSection
        ? {
            title: clampText(service.impactSection?.title, 160),
            highlight: clampText(service.impactSection?.highlight, 140),
            subtitle: clampText(service.impactSection?.subtitle, 220),
            stats: baseImpactStats,
          }
        : undefined,
      testimonials: {
        title: clampText(service.testimonialsTitle, 140),
        highlight: clampText(service.testimonialsHighlight, 120),
        description: clampText(service.testimonialsDescription, 700),
      },
      relatedProjects: {
        title: clampText(service.relatedProjectsTitle, 140),
        highlight: clampText(service.relatedProjectsHighlight, 120),
        description: clampText(service.relatedProjectsDescription, 700),
      },
      faq: {
        title: clampText(service.faqTitle, 140),
        highlight: clampText(service.faqHighlight, 120),
        description: clampText(service.faqDescription, 700),
        items: Array.isArray(service.faqs)
          ? service.faqs
              .map((q) => ({
                question: clampText(q?.question, 200),
                answer: clampText(q?.answer, 800),
              }))
              .filter((q) => q.question && q.answer)
          : [],
      },
      pricing: service.pricing
        ? {
            title: clampText(service.pricing?.title, 140),
            subtitle: clampText(service.pricing?.subtitle, 320),
            trustedCompaniesTitle: clampText(service.pricing?.trustedCompaniesTitle, 160),
            schemaAdditionalProperty: Array.isArray(service.pricing?.schemaAdditionalProperty)
              ? service.pricing.schemaAdditionalProperty
                  .map((p) => ({
                    name: clampText(p?.name, 80),
                    value: clampText(p?.value, 320),
                  }))
                  .filter((p) => p.name && p.value)
              : [],
          }
        : undefined,
      ctaSection: service.ctaSection
        ? {
            title: clampText(service.ctaSection?.title, 160),
            description: clampText(service.ctaSection?.description, 700),
            buttonText: clampText(service.ctaSection?.buttonText, 80),
            secondaryButtonText: clampText(service.ctaSection?.secondaryButtonText, 80),
          }
        : undefined,
    },
  };

  const serviceContext = JSON.stringify(baseServiceForRewrite);

  const prompt = `
    Actúa como un Ingeniero de Contenidos y Copywriter Senior para ONBAST (Agencia de desarrollo web y Posicionamiento SEO y GEO).
    Estilo: Corporativo, cercano, directo, disruptivo (estilo Vercel/Linear).
    
    OBJETIVO: Reescribir y enriquecer semánticamente (anti thin content) el contenido base del servicio
    para crear la landing page local, manteniendo EXACTAMENTE la propuesta de valor y estructura, pero utilizando un lenguaje más cercano.
    No inventes ofertas, stacks, procesos o claims que no existan en la base.

    BASE DEL SERVICIO (JSON REAL, ÚSALO COMO FUENTE):
    ${serviceContext}

    OBJETIVO: Devolver el JSON final de contenido para la landing page local de:
    - Servicio: ${service.title}
    - Ubicación: ${location.name} (${location.type})
    - Contexto: ${location.geoContext || 'Zona estratégica empresarial'}

    REGLAS ESTRICTAS DE RESPUESTA:
    1. Responde SOLO con un objeto JSON válido. Sin markdown, sin explicaciones previas.
    2. Debes localizar TODOS los textos para ${location.name}.
    3. Reescribe sobre la base: cada field debe ser una reescritura del field base correspondiente.
       - Mantén intención, estructura y significado.
       - Cambia léxico/semántica y añade señales locales de forma natural.
       - Si un field queda idéntico al base (mismo texto), es inválido: readaptalo manteniendo la idea base y con mas o menos la misma cantidad de caracteres, intentando añadir palabras relacionadas al contexto local o el nombre de la ciudad.
    4. Límites estrictos de longitud (NO exceder):
       - seoTitle: máximo 60 caracteres
       - seoDescription: máximo 160 caracteres
       - heroHeadline: máximo 60 caracteres
    5. Los títulos que se renderizan como encabezados (H2) en la landing deben estar localizados y reescritos (no copies literal):
       - heroHeadline, featuresTitle, processTitle, techTitle, teamTitle, testimonialsTitle, relatedProjectsTitle, faqTitle, pricingTitle y ctaSection.title.
       - Evita encabezados genéricos repetidos entre ubicaciones; introduce señales locales sin inventar ofertas.
    6. El campo "localContentBlock" debe ser un array de bloques Portable Text (Sanity) válido.
       - Usa al menos 8-10 encabezados estilo "h2".
       - Extensión total: 1800-2000 palabras.
       - Habla de la economía local de ${location.name}, polígonos industriales o zonas comerciales reales. 
       - Este bloque es para hacer SEO lo mejor posible, asi que debes de usar las palabras clave de la landing y la ciudad varias veces en el texto, y casi que todas en el h2, pero evitando el sobreuso.
       - Repite la keyword principal (servicio + ciudad) constantemente y variaciones semánticas de forma natural.
       - Evita sobreoptimización (no repitas el mismo patrón de título), pero mantén repetición para dominar la intencion de búsqueda.
    
    ESTRUCTURA DE ARRAYS REQUERIDA (NO FALLAR EN CANTIDADES):
    - customFeatures: EXACTAMENTE ${desiredFeaturesCount} objetos, reescritura 1:1 del concepto de features base, pero readaptalas para evitar thin content y añadir nombre y referencias locales.
    - customProcess: EXACTAMENTE ${desiredProcessCount} objetos, reescritura 1:1 del concepto del process base, pero readaptalas para evitar thin content y añadir nombre y referencias locales.
    - customFaqs: EXACTAMENTE ${desiredFaqCount} objetos, reescritura 1:1 del concepto de las FAQs base, pero readaptalas para evitar thin content y añadir nombre y referencias locales en las preguntas y en las respuestas.
    - benefits: EXACTAMENTE ${desiredBenefitsCount} strings, reescritura de benefits base, pero debes adaptar para evitar thin content y añadir nombre y referencias locales.
    - technologies: EXACTAMENTE ${desiredTechCount} strings, reescritura de technologies base, pero debes adaptar para evitar thin content y añadir nombre y referencias locales.
    - pricingSchemaAdditionalProperty: EXACTAMENTE el mismo número de items que la base.
    - impactSection.stats: Debes mantener los valores numéricos exactos, pero debes adaptar labels/descripciones.

    FORMATO JSON DE SALIDA:
    {
      "seoTitle": "...",
      "seoDescription": "...",
      "heroHeadline": "...",
      "heroText": "...",
      "heroButtonText": "...",
      "heroSecondaryButtonText": "...",
      "longDescription": "...",
      "overviewText": "...",
      "featuresTitle": "...",
      "featuresHighlight": "...",
      "featuresDescription": "...",
      "benefits": ["..."],
      "processTitle": "...",
      "processHighlight": "...",
      "processDescription": "...",
      "techTitle": "...",
      "techHighlight": "...",
      "techDescription": "...",
      "technologies": ["..."],
      "impactSection": {
        "title": "...",
        "highlight": "...",
        "subtitle": "...",
        "stats": [ { "value": 100, "prefix": "+", "suffix": "%", "label": "...", "description": "..." } ]
      },
      "pricingTitle": "...",
      "pricingSubtitle": "...",
      "pricingTrustedCompaniesTitle": "...",
      "pricingSchemaAdditionalProperty": [
        { "name": "Ideal para", "value": "..." }
      ],
      "testimonialsTitle": "...",
      "testimonialsHighlight": "...",
      "testimonialsDescription": "...",
      "teamTitle": "...",
      "teamHighlight": "...",
      "teamDescription": "...",
      "relatedProjectsTitle": "...",
      "relatedProjectsHighlight": "...",
      "relatedProjectsDescription": "...",
      "faqTitle": "...",
      "faqHighlight": "...",
      "faqDescription": "...",
      "localContentBlock": [
        { "_type": "block", "style": "h2", "children": [{ "_type": "span", "text": "..." }] },
        { "_type": "block", "style": "normal", "children": [{ "_type": "span", "text": "..." }] }
      ],
      "customFeatures": [ { "title": "...", "description": "...", "icon": "Zap" } ],
      "customProcess": [ { "title": "...", "description": "..." } ],
      "customFaqs": [ { "question": "...", "answer": "..." } ],
      "ctaSection": {
        "title": "...",
        "description": "...",
        "buttonText": "...",
        "secondaryButtonText": "..."
      }
    }
  `;

  try {
    let lastError = null;

    for (let attempt = 1; attempt <= 3; attempt++) { // Reducido a 3 intentos para eficiencia
      try {
        console.log(`↻ Intento ${attempt}/3...`);
        const text = await withTimeout(
          geminiGenerateContent({ prompt, model }),
          180000, 
          'Gemini request'
        );
 
        const parsed = safeJsonParse(text);
        const normalized = {
          ...parsed,
          seoTitle: clampText(parsed?.seoTitle, 60, { hard: true }),
          seoDescription: clampText(parsed?.seoDescription, 160, { hard: true }),
          heroHeadline: clampText(parsed?.heroHeadline, 60, { hard: true }),
        };
        const validated = geoContentSchema.parse(normalized);
        let content = addKeys(validated);

        // --- LÓGICA DE CORRECCIÓN AUTOMÁTICA (SELF-HEALING) ---
        // En lugar de fallar si la IA genera de más, cortamos el array.
        // Si genera de menos, dejamos que pase (mejor que error) o duplicamos el último.

        if (content.customFeatures?.length > desiredFeaturesCount) {
           content.customFeatures = content.customFeatures.slice(0, desiredFeaturesCount);
        }
        if (content.customProcess?.length > desiredProcessCount) {
           content.customProcess = content.customProcess.slice(0, desiredProcessCount);
        }
        if (content.customFaqs?.length > desiredFaqCount) {
           content.customFaqs = content.customFaqs.slice(0, desiredFaqCount);
        }
        
        // Asignar iconos por defecto si faltan
        if (content.customFeatures && service.features) {
          content.customFeatures = content.customFeatures.map((f, i) => ({
            ...f,
            icon: f.icon || service.features[i]?.icon || 'CheckCircle2',
          }));
        }

        // Restaurar enlaces fijos
        content.heroButtonLink = service.heroButtonLink || '/contacto';
        content.heroSecondaryButtonLink = service.heroSecondaryButtonLink || '/proyectos';
        if (content.ctaSection) {
            content.ctaSection.buttonLink = '/contacto';
            content.ctaSection.secondaryButtonLink = '/proyectos';
        }

        // Validación de stats de impacto (Flexible)
        if (baseImpactStats.length && content.impactSection?.stats) {
            // Aseguramos que los valores numéricos críticos se mantengan
            content.impactSection.stats = baseImpactStats.map((base, idx) => {
                const generated = content.impactSection.stats[idx];
                return {
                    ...base, // Mantiene value, prefix, suffix originales
                    label: generated?.label || base.label, // Usa el label localizado si existe
                    description: generated?.description || base.description
                };
            });
        }

        const basePricingProps = Array.isArray(service.pricing?.schemaAdditionalProperty)
          ? service.pricing.schemaAdditionalProperty
          : [];
        if (basePricingProps.length && Array.isArray(content.pricingSchemaAdditionalProperty)) {
          content.pricingSchemaAdditionalProperty = basePricingProps
            .map((base, idx) => {
              const generated = content.pricingSchemaAdditionalProperty[idx];
              return {
                name: base?.name,
                value: generated?.value || base?.value,
              };
            })
            .filter((p) => p?.name && p?.value);
        }

        content = stripNullsDeep(content);
        return content;

      } catch (err) {
        lastError = err;
        console.error(`⚠️ Error en intento ${attempt}:`, err.message);
        await sleep(2000);
      }
    }
    throw lastError;
  } catch (error) {
    console.error(`❌ Fallo definitivo para ${location.name}:`, error.message);
    return null;
  }
}

async function generateLocalContentBlock(service, location, model) {
  console.log(`🤖 Generando localContentBlock (Gemini 3 Pro) para: ${service.title} en ${location.name}...`);

  const clampText = (value, maxLen = 1200, { suffix = '…', hard = false } = {}) => {
    const str = typeof value === 'string' ? value.trim() : '';
    if (!str) return '';
    if (!Number.isFinite(maxLen) || maxLen <= 0) return '';
    if (str.length <= maxLen) return str;
    if (hard || !suffix) return str.slice(0, maxLen).trim();
    const suffixLen = String(suffix).length;
    if (suffixLen >= maxLen) return str.slice(0, maxLen).trim();
    return `${str.slice(0, maxLen - suffixLen).trim()}${suffix}`;
  };

  const baseServiceForRewrite = {
    title: clampText(service.title, 160),
    seoTitle: clampText(service.seoTitle, 60, { hard: true }),
    seoDescription: clampText(service.seoDescription, 160, { hard: true }),
    shortDescription: clampText(service.shortDescription, 320),
    longDescription: clampText(service.longDescription, 1400),
    overviewText: clampText(service.overviewText, 1200),
    sections: {
      features: {
        title: clampText(service.featuresTitle, 140),
        highlight: clampText(service.featuresHighlight, 120),
        description: clampText(service.featuresDescription, 800),
      },
      process: {
        title: clampText(service.processTitle, 140),
        highlight: clampText(service.processHighlight, 120),
        description: clampText(service.processDescription, 800),
      },
      tech: {
        title: clampText(service.techTitle, 140),
        highlight: clampText(service.techHighlight, 120),
        description: clampText(service.techDescription, 800),
      },
      pricing: service.pricing
        ? {
            title: clampText(service.pricing?.title, 140),
            subtitle: clampText(service.pricing?.subtitle, 320),
            trustedCompaniesTitle: clampText(service.pricing?.trustedCompaniesTitle, 160),
          }
        : undefined,
    },
  };

  const serviceContext = JSON.stringify(baseServiceForRewrite);

  const prompt = `
    Actúa como un Ingeniero de Contenidos y Copywriter Senior para ONBAST (Agencia de desarrollo web y Posicionamiento SEO y GEO).
    Estilo: Corporativo, cercano, directo, disruptivo (estilo Vercel/Linear).

    OBJETIVO: Generar SOLO el bloque "localContentBlock" para una landing local ya existente, manteniendo la propuesta de valor del servicio.
    No inventes ofertas, stacks, procesos o claims que no existan en la base, pero usa un lenguaje cercano, que capte la intencion de compra.

    BASE DEL SERVICIO (JSON REAL, ÚSALO COMO FUENTE):
    ${serviceContext}

    OBJETIVO: Devolver el JSON final SOLO con localContentBlock para:
    - Servicio: ${service.title}
    - Ubicación: ${location.name} (${location.type})
    - Contexto: ${location.geoContext || 'Zona estratégica empresarial'}

    REGLAS ESTRICTAS DE RESPUESTA:
    1. Responde SOLO con un objeto JSON válido. Sin markdown, sin explicaciones.
    2. El JSON debe tener EXCLUSIVAMENTE esta forma:
       { "localContentBlock": [ ... ] }
    3. "localContentBlock" debe ser un array Portable Text (Sanity) válido.
       - Usa al menos 8-10 encabezados estilo "h2".
       - Extensión total: 1500-2000 palabras.
       - Incluye párrafos entre H2s; no hagas una lista de H2s vacíos.
       - Habla de la economía local de ${location.name}, polígonos industriales o zonas comerciales reales.
       - Repite la keyword principal (servicio + ciudad) constantemente y variaciones semánticas de forma natural.
       - Evita sobreoptimización (no repitas el mismo patrón de título), pero mantén repetición para dominar la intencion de búsqueda.

    EJEMPLO DE FORMATO (NO COPIAR TEXTO):
    {
      "localContentBlock": [
        { "_type": "block", "style": "h2", "children": [{ "_type": "span", "text": "..." }] },
        { "_type": "block", "style": "normal", "children": [{ "_type": "span", "text": "..." }] }
      ]
    }
  `;

  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`↻ Intento ${attempt}/3...`);
      const text = await withTimeout(
        geminiGenerateContent({ prompt, model }),
        180000,
        'Gemini request'
      );

      const parsed = safeJsonParse(text);
      const validated = localContentOnlySchema.parse(parsed);
      const content = addKeys(validated);

      const h2Count = countPortableTextH2(content.localContentBlock);
      const wordCount = estimatePortableTextWordCount(content.localContentBlock);

      if (h2Count < 8) {
        throw new Error(`localContentBlock insuficiente: h2Count=${h2Count}`);
      }
      if (wordCount < 1200) {
        throw new Error(`localContentBlock insuficiente: wordCount=${wordCount}`);
      }

      return content.localContentBlock;
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ Error generando localContentBlock (intento ${attempt}):`, err?.message || err);
      await sleep(jitter(generationState.delayMs));
    }
  }

  throw lastError || new Error('No se pudo generar localContentBlock');
}

const purgeServiceLocations = async () => {
  const ids = await sanity.fetch(`*[_type == "serviceLocation"]{ _id }`);
  const list = Array.isArray(ids)
    ? ids.map((d) => d?._id).filter((id) => typeof id === 'string' && id.length)
    : [];

  if (!list.length) {
    console.log('ℹ️ No hay landings locales (serviceLocation) para borrar.');
    return;
  }

  console.log(`🧨 Borrando ${list.length} landings locales (serviceLocation)...`);

  const chunkSize = 50;
  let deleted = 0;
  for (let i = 0; i < list.length; i += chunkSize) {
    const chunk = list.slice(i, i + chunkSize);
    let tx = sanity.transaction();
    for (const id of chunk) tx = tx.delete(id);
    await tx.commit();
    deleted += chunk.length;
    console.log(`🗑️ Borradas: ${deleted}/${list.length}`);
    await sleep(500);
  }
};

async function main() {
  if (purgeEnabled) {
    await purgeServiceLocations();
    return;
  }

  if (!runEnabled) {
    console.log('ℹ️ Modo seguro: añade --run para ejecutar (y --write para escribir en Sanity).');
    console.log('ℹ️ Para actualizar solo localContentBlock: añade --local-content-only.');
    return;
  }

  const resolvedGeminiModel = resolveGeminiModel();
  console.log('🚀 Iniciando Generación GEO (ONBAST Engine)...');
  console.log(`🧠 Modelo IA: ${resolvedGeminiModel}`);

  const services = await getServices();
  const locations = await getLocations();

  const hasTypesEnv = Object.prototype.hasOwnProperty.call(process.env, 'GEO_LOCATION_TYPES');
  const rawTypes = hasTypesEnv ? String(process.env.GEO_LOCATION_TYPES ?? '') : 'city';
  const normalizedTypes = String(rawTypes).trim().toLowerCase();
  const allowedTypes = !normalizedTypes || normalizedTypes === 'all' || normalizedTypes === '*'
    ? []
    : String(rawTypes)
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
  const filteredLocations = allowedTypes.length
    ? locations.filter((l) => allowedTypes.includes(String(l?.type || '').trim()))
    : locations;

  console.log(`📍 Servicios: ${services.length} | Ubicaciones: ${filteredLocations.length}/${locations.length} | Tipos: ${allowedTypes.join(',')}`);

  if (localContentOnlyEnabled) {
    const serviceSlugFilter = typeof process.env.GEO_SERVICE_SLUG === 'string' ? process.env.GEO_SERVICE_SLUG.trim() : '';
    const citySlugFilter = typeof process.env.GEO_CITY_SLUG === 'string' ? process.env.GEO_CITY_SLUG.trim() : '';
    const limit = Number.parseInt(process.env.GEO_LIMIT || '0', 10);

    let query = '*[_type == "serviceLocation" && defined(service._ref) && defined(location._ref)';
    if (serviceSlugFilter) query += ' && service->slug.current == $serviceSlug';
    if (citySlugFilter) query += ' && location->slug.current == $citySlug';
    query += ']';
    query += `{
      _id,
      "service": service-> {
        _id,
        title,
        "slug": slug.current,
        seoTitle,
        seoDescription,
        shortDescription,
        longDescription,
        overviewText,
        featuresTitle,
        featuresHighlight,
        featuresDescription,
        processTitle,
        processHighlight,
        processDescription,
        techTitle,
        techHighlight,
        techDescription,
        pricing { title, subtitle, trustedCompaniesTitle }
      },
      "location": location-> {
        _id,
        name,
        type,
        "slug": slug.current,
        geoContext,
        "parentName": parent->name
      }
    }`;
    if (Number.isFinite(limit) && limit > 0) query += `[0...${limit}]`;

    const items = await sanity.fetch(query, {
      ...(serviceSlugFilter ? { serviceSlug: serviceSlugFilter } : {}),
      ...(citySlugFilter ? { citySlug: citySlugFilter } : {}),
    });

    const list = Array.isArray(items) ? items : [];
    console.log(`🧩 Modo localContentBlock: ${list.length} landings a procesar.`);

    for (const item of list) {
      const service = item?.service;
      const location = item?.location;
      const id = item?._id;
      if (!id || !service?._id || !location?._id) {
        console.log('⏩ Saltando (doc incompleto)');
        continue;
      }

      const localContentBlock = await generateLocalContentBlock(service, location, resolvedGeminiModel);

      if (!writeEnabled) {
        console.log(`🧪 DRY-RUN: Actualizaría localContentBlock: ${service.title} en ${location.name}`);
      } else {
        await sanity.patch(id).set({ localContentBlock }).commit();
        console.log(`✅ Actualizado localContentBlock: ${service.title} en ${location.name}`);
      }

      await sleep(landingDelayMs);
    }

    return;
  }

  for (const service of services) {
    for (const location of filteredLocations) {
      // Verificar si ya existe
      const existing = await sanity.fetch(
        `*[_type == "serviceLocation" && service._ref == $serviceId && location._ref == $locationId][0]._id`,
        { serviceId: service._id, locationId: location._id }
      );

      if (existing && process.env.UPDATE_EXISTING !== '1') {
        console.log(`⏩ Saltando (Existe): ${service.title} - ${location.name}`);
        continue;
      }

      const content = await generateContent(service, location, resolvedGeminiModel);

      if (content) {
        const doc = {
            _type: 'serviceLocation',
            service: { _type: 'reference', _ref: service._id },
            location: { _type: 'reference', _ref: location._id },
            ...content
        };

        if (!writeEnabled) {
          console.log(`🧪 DRY-RUN: ${existing ? 'Actualizaría' : 'Crearía'}: ${service.title} en ${location.name}`);
        } else if (existing) {
          await sanity.patch(existing).set(content).commit();
          console.log(`✅ Actualizado: ${service.title} en ${location.name}`);
        } else {
          await sanity.create(doc);
          console.log(`✅ Creado: ${service.title} en ${location.name}`);
        }
      }
      // Pausa para evitar rate limits
      await sleep(landingDelayMs);
    }
  }
}

try {
  await main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
