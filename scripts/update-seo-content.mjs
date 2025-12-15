import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to read .env.local
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const env = {};
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        env[key] = value;
      }
    });
    return env;
  } catch (error) {
    console.error('Error reading .env.local:', error);
    return {};
  }
}

const env = loadEnv();

if (!env.SANITY_WRITE_TOKEN) {
  console.error('❌ SANITY_WRITE_TOKEN not found in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function uploadImage(keyword) {
  try {
    const url = `https://picsum.photos/seed/${keyword}/800/600`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    const buffer = await res.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: `seo-${keyword}-${Date.now()}.jpg`
    });
    return asset._id;
  } catch (error) {
    console.error('Image upload failed:', error);
    return null;
  }
}

const seoServiceData = {
  title: 'Posicionamiento SEO & GEO',
  slug: { current: 'posicionamiento-seo' },
  shortDescription: 'Domina los resultados de búsqueda tradicionales (Google) y las respuestas de la Inteligencia Artificial (ChatGPT, Perplexity, Gemini).',
  longDescription: 'El SEO ha evolucionado. Ya no basta con aparecer en Google. Tu marca debe ser la respuesta recomendada por los motores de Inteligencia Artificial. Fusionamos SEO técnico avanzado con estrategias de GEO (Generative Engine Optimization) para garantizar tu visibilidad en la nueva era digital.',
  overviewText: 'En un mundo donde el 40% de las búsquedas ya se realizan en interfaces conversacionales, optimizar solo para palabras clave es obsoleto. Optimizamos para entidades, contextos y respuestas directas, asegurando que tu negocio sea la referencia autorizada.',
  icon: 'Search', // Lucide icon name
  heroButtonText: 'Auditoría SEO Gratuita',
  heroButtonLink: '/contacto',
  
  // Problem / Solution
  problem: 'Las agencias tradicionales siguen aplicando técnicas de 2020. Ignoran que los usuarios ahora preguntan a IAs, no solo buscan keywords. Si tu marca no es entendida por los LLMs, eres invisible en el futuro inmediato.',
  solution: 'Implementamos un grafo de conocimiento estructurado y datos semánticos que "enseñan" a las IAs quién eres y por qué eres la mejor opción, asegurando tu presencia en la "Posición Cero" y en las recomendaciones generativas.',

  // Features (Bento Grid)
  featuresTitle: 'Estrategia Integral',
  features: [
    {
      title: 'GEO (Generative Engine Optimization)',
      description: 'Adaptación de contenidos para ser citados como fuente primaria por IAs como ChatGPT y Perplexity.',
      icon: 'Bot'
    },
    {
      title: 'SEO Técnico Avanzado',
      description: 'Arquitectura web, Core Web Vitals, renderizado JS y optimización de rastreo para máxima eficiencia.',
      icon: 'Cpu'
    },
    {
      title: 'Estrategia Semántica',
      description: 'Creación de Topic Clusters y grafos de conocimiento que establecen tu autoridad temática.',
      icon: 'Network'
    },
    {
      title: 'Link Building de Autoridad',
      description: 'Relaciones públicas digitales (Digital PR) para conseguir menciones de alta calidad.',
      icon: 'Link'
    }
  ],

  // Benefits (List)
  benefits: [
    'Visibilidad dual: Google + Motores de IA',
    'Aumento de tráfico cualificado y conversiones',
    'Autoridad de marca indiscutible en tu nicho',
    'Estrategia sostenible a largo plazo (Evergreen)',
    'Reducción del Coste de Adquisición (CAC)'
  ],

  // Process (Sticky Scroll)
  processTitle: 'Metodología GEO',
  process: [
    {
      title: '1. Auditoría Técnica & Semántica',
      description: 'Analizamos tu huella digital actual, errores técnicos y cómo las IAs perciben tu marca actualmente.',
      imageKeyword: 'seo-audit'
    },
    {
      title: '2. Diseño de Estrategia GEO',
      description: 'Definimos las entidades clave y las preguntas conversacionales que tu cliente ideal está haciendo.',
      imageKeyword: 'strategy-map'
    },
    {
      title: '3. Optimización On-Page',
      description: 'Implementación masiva de Schema.org, mejora de velocidad y estructuración de datos.',
      imageKeyword: 'coding-seo'
    },
    {
      title: '4. Contenido de Autoridad',
      description: 'Creación de piezas "Power Page" diseñadas para responder exhaustivamente y ser citadas.',
      imageKeyword: 'content-writing'
    }
  ],

  // Technologies
  technologies: [
    'Google Search Console', 'Ahrefs', 'Semrush', 'Screaming Frog', 'Schema.org', 'Python', 'OpenAI API'
  ],

  // Impact Section (Cards)
  impactSection: {
    title: 'Resultados Medibles',
    cards: [
      {
        title: '+300% Tráfico Orgánico',
        description: 'Crecimiento promedio en 6 meses para clientes Enterprise.',
        colSpan: 2,
        color: 'indigo'
      },
      {
        title: 'Top 3 en Perplexity',
        description: 'Visibilidad garantizada en búsquedas conversacionales de marca.',
        colSpan: 1,
        color: 'blue'
      },
      {
        title: '10x ROI',
        description: 'Retorno de inversión sostenido gracias al tráfico gratuito.',
        colSpan: 3,
        color: 'neutral'
      }
    ]
  },

  // FAQ
  faqTitle: 'Preguntas Frecuentes SEO',
  faqs: [
    {
      question: '¿Qué es GEO y en qué se diferencia del SEO?',
      answer: 'GEO (Generative Engine Optimization) se enfoca en optimizar para motores de respuesta como ChatGPT o Perplexity, priorizando la citación y la autoridad semántica. El SEO tradicional se enfoca en el ranking de enlaces azules en Google.'
    },
    {
      question: '¿Cuánto tiempo tarda en verse resultados?',
      answer: 'El SEO es una estrategia a medio-largo plazo. Generalmente, los resultados significativos comienzan a verse entre el mes 3 y 6, aunque las correcciones técnicas pueden tener impacto inmediato.'
    },
    {
      question: '¿Necesito SEO si ya hago publicidad (SEM)?',
      answer: 'Sí. El SEO reduce tu dependencia del pago por clic y mejora la calidad de tu página, lo que a su vez reduce el coste de tus anuncios (Quality Score).'
    }
  ]
};

async function run() {
  console.log('🚀 Actualizando contenido de Servicio SEO...');

  // 1. Upload Images for Process Steps (needed for schema)
  const processWithImages = [];
  for (const step of seoServiceData.process) {
    console.log(`Uploading image for step: ${step.title}...`);
    const imageId = await uploadImage(step.imageKeyword);
    processWithImages.push({
      title: step.title,
      description: step.description,
      image: imageId ? { _type: 'image', asset: { _type: 'reference', _ref: imageId } } : undefined
    });
  }

  // 2. Upload Main Image
  console.log('Uploading main hero image...');
  const mainImageId = await uploadImage('seo-dashboard-futuristic');

  // 3. Prepare Document
  const doc = {
    _type: 'service',
    title: seoServiceData.title,
    slug: seoServiceData.slug,
    shortDescription: seoServiceData.shortDescription,
    longDescription: seoServiceData.longDescription,
    overviewText: seoServiceData.overviewText,
    icon: seoServiceData.icon,
    heroButtonText: seoServiceData.heroButtonText,
    heroButtonLink: seoServiceData.heroButtonLink,
    mainImage: mainImageId ? { _type: 'image', asset: { _type: 'reference', _ref: mainImageId } } : undefined,
    
    problem: seoServiceData.problem,
    solution: seoServiceData.solution,
    
    featuresTitle: seoServiceData.featuresTitle,
    features: seoServiceData.features, // Schema matches object structure
    
    benefits: seoServiceData.benefits,
    
    processTitle: seoServiceData.processTitle,
    process: processWithImages,
    
    technologies: seoServiceData.technologies,
    
    impactSection: {
      title: seoServiceData.impactSection.title,
      cards: seoServiceData.impactSection.cards.map(card => ({
        ...card,
        // Assuming no image for impact cards for now to save time, or add placeholder logic if needed
        // schema expects imageUrl as image type? No, schema says `imageUrl` is `image` type in `impactSection`? 
        // Wait, schema says `defineField({ name: 'imageUrl', title: 'Imagen (Opcional)', type: 'image' })` inside cards.
        // Let's leave images undefined for cards for simplicity unless critical.
      }))
    },
    
    faqTitle: seoServiceData.faqTitle,
    faqs: seoServiceData.faqs
  };

  // 4. Update or Create
  // Check if exists by slug
  const existing = await client.fetch(`*[_type == "service" && slug.current == $slug][0]`, { slug: seoServiceData.slug.current });
  
  if (existing) {
    console.log(`Encontrado documento existente (${existing._id}). Actualizando...`);
    await client.patch(existing._id).set(doc).commit();
  } else {
    console.log('Creando nuevo documento...');
    await client.create(doc);
  }

  console.log('✅ Contenido SEO actualizado correctamente!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});