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

// Helper to generate unique keys for Sanity arrays
const generateKey = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

async function uploadImage(keyword) {
  try {
    // Using a more reliable source for "stock" like images or just consistent seeds
    const url = `https://picsum.photos/seed/${keyword}/800/800`; // Square for profiles
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

const teamMembers = [
  {
    name: 'Elena Rodríguez',
    role: 'Senior SEO Strategist',
    imageKeyword: 'professional-woman-portrait',
    social: { linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' }
  },
  {
    name: 'Marc Torres',
    role: 'Lead Developer & Performance',
    imageKeyword: 'tech-guy-portrait',
    social: { linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' }
  },
  {
    name: 'Sarah López',
    role: 'Content & AI Director',
    imageKeyword: 'creative-woman-portrait',
    social: { linkedin: 'https://linkedin.com' }
  }
];

const testimonials = [
  {
    name: 'Carlos Mendoza',
    role: 'CEO @ TechStart',
    quote: 'El impacto en nuestro tráfico orgánico fue inmediato. Pasamos de ser invisibles a dominar las respuestas en Perplexity y Google. El ROI ha sido del 400% en 6 meses.',
    imageKeyword: 'ceo-portrait'
  },
  {
    name: 'Laura García',
    role: 'Marketing Dir. @ GlobalCorp',
    quote: 'Buscábamos una agencia que entendiera la IA, no solo keywords. ONBAST nos ha posicionado como líderes de pensamiento en nuestro sector. Su tecnología es otro nivel.',
    imageKeyword: 'marketing-director'
  },
  {
    name: 'David Pérez',
    role: 'Founder @ E-Shop',
    quote: 'La velocidad de carga de nuestra web ahora es instantánea. Las conversiones subieron un 25% solo por la mejora en performance. Son verdaderos ingenieros del crecimiento.',
    imageKeyword: 'entrepreneur-portrait'
  }
];

const seoServiceData = {
  title: 'Posicionamiento SEO & GEO',
  slug: { current: 'posicionamiento-seo' },
  shortDescription: 'Domina los resultados de búsqueda tradicionales (Google) y las respuestas de la Inteligencia Artificial (ChatGPT, Perplexity, Gemini).',
  longDescription: 'El SEO ha evolucionado. Ya no basta con aparecer en Google. Tu marca debe ser la respuesta recomendada por los motores de Inteligencia Artificial. Fusionamos SEO técnico avanzado con estrategias de GEO (Generative Engine Optimization) para garantizar tu visibilidad en la nueva era digital.',
  overviewText: 'En un mundo donde el 40% de las búsquedas ya se realizan en interfaces conversacionales, optimizar solo para palabras clave es obsoleto. Optimizamos para entidades, contextos y respuestas directas, asegurando que tu negocio sea la referencia autorizada.',
  icon: 'Search',
  heroButtonText: 'Auditoría SEO Gratuita',
  heroButtonLink: '/contacto',
  
  problem: 'Las agencias tradicionales siguen aplicando técnicas de 2020. Ignoran que los usuarios ahora preguntan a IAs, no solo buscan keywords. Si tu marca no es entendida por los LLMs, eres invisible en el futuro inmediato.',
  solution: 'Implementamos un grafo de conocimiento estructurado y datos semánticos que "enseñan" a las IAs quién eres y por qué eres la mejor opción, asegurando tu presencia en la "Posición Cero" y en las recomendaciones generativas.',

  featuresTitle: 'Estrategia Integral',
  features: [
    { _key: generateKey(), title: 'GEO (Generative Engine Optimization)', description: 'Adaptación de contenidos para ser citados como fuente primaria por IAs como ChatGPT y Perplexity.', icon: 'Bot' },
    { _key: generateKey(), title: 'SEO Técnico Avanzado', description: 'Arquitectura web, Core Web Vitals, renderizado JS y optimización de rastreo para máxima eficiencia.', icon: 'Cpu' },
    { _key: generateKey(), title: 'Estrategia Semántica', description: 'Creación de Topic Clusters y grafos de conocimiento que establecen tu autoridad temática.', icon: 'Network' },
    { _key: generateKey(), title: 'Link Building de Autoridad', description: 'Relaciones públicas digitales (Digital PR) para conseguir menciones de alta calidad.', icon: 'Link' }
  ],

  benefits: [
    'Visibilidad dual: Google + Motores de IA',
    'Aumento de tráfico cualificado y conversiones',
    'Autoridad de marca indiscutible en tu nicho',
    'Estrategia sostenible a largo plazo (Evergreen)',
    'Reducción del Coste de Adquisición (CAC)'
  ],

  processTitle: 'Metodología GEO',
  process: [
    { title: '1. Auditoría Técnica & Semántica', description: 'Analizamos tu huella digital actual, errores técnicos y cómo las IAs perciben tu marca actualmente.', imageKeyword: 'seo-audit-tech' },
    { title: '2. Diseño de Estrategia GEO', description: 'Definimos las entidades clave y las preguntas conversacionales que tu cliente ideal está haciendo.', imageKeyword: 'strategy-map-ai' },
    { title: '3. Optimización On-Page', description: 'Implementación masiva de Schema.org, mejora de velocidad y estructuración de datos.', imageKeyword: 'coding-seo-matrix' },
    { title: '4. Contenido de Autoridad', description: 'Creación de piezas "Power Page" diseñadas para responder exhaustivamente y ser citadas.', imageKeyword: 'content-writing-future' }
  ],

  technologies: ['Google Search Console', 'Ahrefs', 'Semrush', 'Screaming Frog', 'Schema.org', 'Python', 'OpenAI API'],

  impactSection: {
    title: 'Resultados Medibles',
    cards: [
      { _key: generateKey(), title: '+300% Tráfico Orgánico', description: 'Crecimiento promedio en 6 meses para clientes Enterprise.', colSpan: 2, color: 'indigo' },
      { _key: generateKey(), title: 'Top 3 en Perplexity', description: 'Visibilidad garantizada en búsquedas conversacionales de marca.', colSpan: 1, color: 'blue' },
      { _key: generateKey(), title: '10x ROI', description: 'Retorno de inversión sostenido gracias al tráfico gratuito.', colSpan: 3, color: 'neutral' }
    ]
  },

  faqTitle: 'Preguntas Frecuentes SEO',
  faqs: [
    { _key: generateKey(), question: '¿Qué es GEO y en qué se diferencia del SEO?', answer: 'GEO (Generative Engine Optimization) se enfoca en optimizar para motores de respuesta como ChatGPT o Perplexity, priorizando la citación y la autoridad semántica. El SEO tradicional se enfoca en el ranking de enlaces azules en Google.' },
    { _key: generateKey(), question: '¿Cuánto tiempo tarda en verse resultados?', answer: 'El SEO es una estrategia a medio-largo plazo. Generalmente, los resultados significativos comienzan a verse entre el mes 3 y 6, aunque las correcciones técnicas pueden tener impacto inmediato.' },
    { _key: generateKey(), question: '¿Necesito SEO si ya hago publicidad (SEM)?', answer: 'Sí. El SEO reduce tu dependencia del pago por clic y mejora la calidad de tu página, lo que a su vez reduce el coste de tus anuncios (Quality Score).' }
  ]
};

async function run() {
  console.log('🚀 Iniciando actualización completa de contenido...');

  // --- 1. PROCESS IMAGES ---
  const processWithImages = [];
  for (const step of seoServiceData.process) {
    console.log(`Uploading process image: ${step.title}...`);
    const imageId = await uploadImage(step.imageKeyword);
    processWithImages.push({
      _key: generateKey(),
      title: step.title,
      description: step.description,
      image: imageId ? { _type: 'image', asset: { _type: 'reference', _ref: imageId } } : undefined
    });
  }

  // --- 2. MAIN HERO IMAGE ---
  console.log('Uploading main hero image...');
  const mainImageId = await uploadImage('seo-dashboard-futuristic-v2');

  // --- 3. TEAM MEMBERS ---
  console.log('👥 Creating Team Members...');
  const teamRefs = [];
  for (const member of teamMembers) {
    console.log(`Processing member: ${member.name}`);
    const imageId = await uploadImage(member.imageKeyword);
    
    // Check if exists
    const existingMember = await client.fetch(`*[_type == "teamMember" && name == $name][0]`, { name: member.name });
    
    const doc = {
      _type: 'teamMember',
      name: member.name,
      role: member.role,
      image: imageId ? { _type: 'image', asset: { _type: 'reference', _ref: imageId }, alt: member.name } : undefined,
      social: member.social
    };

    if (existingMember) {
      await client.patch(existingMember._id).set(doc).commit();
      teamRefs.push({ _type: 'reference', _ref: existingMember._id, _key: existingMember._id });
    } else {
      const newMember = await client.create(doc);
      teamRefs.push({ _type: 'reference', _ref: newMember._id, _key: newMember._id });
    }
  }

  // --- 4. TESTIMONIALS ---
  console.log('⭐ Creating Testimonials...');
  const testimonialRefs = [];
  for (const t of testimonials) {
    console.log(`Processing testimonial: ${t.name}`);
    const imageId = await uploadImage(t.imageKeyword);
    
    const existingT = await client.fetch(`*[_type == "testimonial" && name == $name][0]`, { name: t.name });
    
    const doc = {
      _type: 'testimonial',
      name: t.name,
      role: t.role,
      quote: t.quote,
      image: imageId ? { _type: 'image', asset: { _type: 'reference', _ref: imageId } } : undefined
    };

    if (existingT) {
      await client.patch(existingT._id).set(doc).commit();
      testimonialRefs.push({ _type: 'reference', _ref: existingT._id, _key: existingT._id });
    } else {
      const newT = await client.create(doc);
      testimonialRefs.push({ _type: 'reference', _ref: newT._id, _key: newT._id });
    }
  }

  // --- 5. UPDATE SERVICE DOCUMENT ---
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
    features: seoServiceData.features,
    
    benefits: seoServiceData.benefits,
    
    processTitle: seoServiceData.processTitle,
    process: processWithImages,
    
    technologies: seoServiceData.technologies,
    
    impactSection: seoServiceData.impactSection,
    
    // Linked Content
    teamTitle: 'Equipo de Expertos',
    team: teamRefs,
    
    testimonialsTitle: 'Historias de Éxito',
    testimonials: testimonialRefs,
    
    faqTitle: seoServiceData.faqTitle,
    faqs: seoServiceData.faqs
  };

  const existing = await client.fetch(`*[_type == "service" && slug.current == $slug][0]`, { slug: seoServiceData.slug.current });
  
  if (existing) {
    console.log(`Encontrado servicio existente. Actualizando con nuevas referencias...`);
    await client.patch(existing._id).set(doc).commit();
  } else {
    console.log('Creando nuevo servicio...');
    await client.create(doc);
  }

  console.log('✅ TODO ACTUALIZADO CORRECTAMENTE!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});