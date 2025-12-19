import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// --- CONFIGURACIÓN DE ENTORNO ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

// Cargar variables de entorno
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
    }
  });
}

// Validar API Keys
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY no encontrada en .env.local');
  process.exit(1);
}

// Importar Google Generative AI dinámicamente
let GoogleGenerativeAI;
try {
  const googleAIModule = await import('@google/generative-ai');
  GoogleGenerativeAI = googleAIModule.GoogleGenerativeAI;
} catch (e) {
  console.error('❌ ERROR: El paquete "@google/generative-ai" no está instalado.');
  console.error('👉 Ejecuta: npm install @google/generative-ai');
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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Usamos el modelo más avanzado disponible (Gemini 3.0 Pro Preview)
const model = genAI.getGenerativeModel({ 
  model: "gemini-3-pro-preview",
  generationConfig: {
    responseMimeType: "application/json",
  }
});

// --- LÓGICA DE GENERACIÓN ---

async function getServices() {
  return await sanity.fetch(`*[_type == "service"]{ 
    _id, 
    title, 
    "slug": slug.current, 
    shortDescription, 
    benefits,
    features[] { title, description, icon },
    process[] { title, description },
    technologies,
    faqs[] { question, answer },
    pricing { title, subtitle } 
  }`);
}

async function getLocations() {
  return await sanity.fetch(`*[_type == "location" && defined(slug.current)]{ _id, name, type, "slug": slug.current, geoContext, "parentName": parent->name }`);
}

async function generateContent(service, location) {
  console.log(`🤖 Generando contenido (Gemini) para: ${service.title} en ${location.name}...`);
  console.log('DEBUG: Iniciando petición a Gemini...');

  // Construir contexto rico del servicio para la IA
  const serviceContext = `
    FEATURES: ${service.features ? service.features.map(f => `- ${f.title}: ${f.description}`).join('\n') : 'N/A'}
    PROCESO: ${service.process ? service.process.map(p => `- ${p.title}: ${p.description}`).join('\n') : 'N/A'}
    TECNOLOGÍAS: ${service.technologies ? service.technologies.join(', ') : 'N/A'}
    PREGUNTAS FRECUENTES BASE: ${service.faqs ? service.faqs.map(f => `Q: ${f.question} A: ${f.answer}`).join('\n') : 'N/A'}
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

    SECCIONES A GENERAR (JSON STRICT):

    1. seoTitle: "${service.title} en ${location.name} | ONBAST" (Variar ligeramente para evitar duplicados exactos).
    2. seoDescription: Transaccional. Menciona servicio + ciudad + beneficio clave. Max 155 caracteres.
    3. heroHeadline: H1 Potente. Ej: "Dominio Digital en ${location.name}" o "${service.title} de Alto Rendimiento en ${location.name}".
    4. heroText: Intro de 2 líneas. Conecta la necesidad del servicio con la ambición de las empresas de ${location.name}.
    
    5. localContentBlock (CRÍTICO - EXTENSO + NATURAL):
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
    
    6. customFeatures (6 Items):
       - Títulos y descripciones que suenen a solución local.
       - Ej: "Soporte en [Zona Local]" en lugar de "Soporte 24/7".
    
    7. customProcess (5 Items):
       - Pasos que impliquen cercanía o conocimiento del terreno.
    
    8. customFaqs (2-3 Items):
       - Preguntas muy específicas. Ej: "¿Os desplazáis a [Pueblo cercano]?", "¿Tenéis experiencia con el sector [Sector típico de la ciudad]?".

    9. ctaSection (LOCALIZADO):
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

  try {
    const result = await model.generateContent(prompt);
    console.log('DEBUG: Petición completada. Procesando respuesta...');
    const response = await result.response;
    const text = response.text();
    console.log('DEBUG: Respuesta de texto recibida. Longitud:', text.length);

    const content = addKeys(safeJsonParse(text));

    // Asegurar que customFeatures tenga iconos (reusar los del servicio base o poner uno por defecto)
    if (content.customFeatures && service.features) {
        content.customFeatures = content.customFeatures.map((f, i) => ({
            ...f,
            icon: service.features[i]?.icon || 'CheckCircle2'
        }));
    }

    if (content.ctaSection) {
      content.ctaSection.buttonLink = '/contacto';
      content.ctaSection.secondaryButtonLink = '/proyectos';
    }

    return content;
  } catch (error) {
    console.error(`❌ Error generando contenido para ${location.name}:`, error);
    return null;
  }
}

async function main() {
  console.log('🚀 Iniciando Generación de Contenido GEO con Gemini (Programmatic SEO)...');
  console.log(`DEBUG: API Key cargada: ${process.env.GEMINI_API_KEY ? 'SÍ (' + process.env.GEMINI_API_KEY.slice(0,5) + '...)' : 'NO'}`);

  const services = await getServices();
  const locations = await getLocations();

  console.log(`📍 Encontrados: ${services.length} Servicios y ${locations.length} Ubicaciones.`);

  for (const service of services) {
    for (const location of locations) {
      // 1. Verificar si ya existe
      const exists = await sanity.fetch(
        `count(*[_type == "serviceLocation" && service._ref == $serviceId && location._ref == $locationId])`,
        { serviceId: service._id, locationId: location._id }
      );

      if (exists > 0) {
        console.log(`⏩ Saltando (Ya existe): ${service.title} - ${location.name}`);
        continue;
      }

      // 2. Generar Contenido
      const content = await generateContent(service, location);

      if (!content) continue;

      // 3. Guardar en Sanity
      try {
        await sanity.create({
          _type: 'serviceLocation',
          service: { _type: 'reference', _ref: service._id },
          location: { _type: 'reference', _ref: location._id },
          seoTitle: content.seoTitle,
          seoDescription: content.seoDescription,
          heroHeadline: content.heroHeadline,
          heroText: content.heroText,
          localContentBlock: content.localContentBlock,
          ctaSection: content.ctaSection,
          customFeatures: content.customFeatures,
          customProcess: content.customProcess,
          customFaqs: content.customFaqs
        });
        console.log(`✅ Guardado: ${service.title} en ${location.name}`);
      } catch (err) {
        console.error(`❌ Error guardando en Sanity:`, err.message);
      }

      // Pausa adaptativa para evitar Rate Limits (429)
      // Gemini Free Tier es limitado. Aumentamos a 45 segundos entre peticiones para ir sobre seguro.
      console.log('⏳ Esperando 45s para respetar cuota de API...');
      await new Promise(r => setTimeout(r, 45000));
    }
  }

  console.log('🏁 Proceso Finalizado.');
}

main().catch(console.error);
