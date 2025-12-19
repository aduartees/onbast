import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURACIÓN DE ENTORNO ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
    }
  });
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// DATOS REALES BASADOS EN "Servicios y precios ejemplo.md"

const SERVICES = [
  {
    title: 'Desarrollo y Diseño Web',
    slug: 'desarrollo-diseno-web',
    shortDescription: 'Sitios web vivos bajo modelo de suscripción (WaaS). No compres una web que envejece.',
    heroHeadline: 'Tu Plataforma Digital Viva',
    heroHighlight: 'Viva',
    heroIntroduction: 'Olvídate de webs estáticas. Suscríbete a una tecnología que evoluciona mes a mes con tu negocio.',
    imageKeyword: 'web-design',
    benefits: ['Tecnología Next.js 15', 'Sin desembolso inicial grande', 'Mantenimiento Incluido'],
    planSlug: 'suscripcion-corporate',
    // Detailed Sections
    features: [
      { title: 'Velocidad Extrema', description: 'Carga en menos de 100ms gracias a Edge Computing y optimización de imágenes.' },
      { title: 'Diseño Awwwards', description: 'Estética de clase mundial que diferencia tu marca de la competencia.' },
      { title: 'CMS Headless', description: 'Gestiona tu contenido fácilmente sin romper el diseño.' }
    ],
    process: [
      { title: 'Auditoría & Estrategia', description: 'Analizamos tu situación actual y definimos objetivos claros.' },
      { title: 'Diseño UX/UI', description: 'Prototipado de alta fidelidad centrado en conversión.' },
      { title: 'Desarrollo & Lanzamiento', description: 'Codificación limpia y despliegue en infraestructura global.' }
    ],
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'Sanity', 'Vercel'],
    faqs: [
      { question: '¿Qué incluye el mantenimiento?', answer: 'Actualizaciones de seguridad, cambios de contenido menores y optimización mensual.' },
      { question: '¿Es la web de mi propiedad?', answer: 'Sí, tras 12 meses de suscripción el código pasa a ser tuyo si decides cancelar.' }
    ]
  },
  {
    title: 'Desarrollo MVP / Apps',
    slug: 'desarrollo-mvp-apps',
    shortDescription: 'Ingeniería de software pesada on-demand. Tu equipo de élite por sprints.',
    heroHeadline: 'Ingeniería de Élite On-Demand',
    heroHighlight: 'Élite',
    heroIntroduction: 'Construimos tu MVP o SaaS complejo con código en propiedad y garantía de funcionalidad.',
    imageKeyword: 'coding',
    benefits: ['Código en Propiedad', 'React Native / Node', 'Entrega Garantizada'],
    planSlug: 'sprint-dedicado',
    // Detailed Sections
    features: [
      { title: 'Arquitectura Escalable', description: 'Preparado para soportar miles de usuarios desde el día 1.' },
      { title: 'Código Limpio', description: 'Estándares estrictos de TypeScript y testing automatizado.' },
      { title: 'Seguridad Bancaria', description: 'Encriptación de datos y cumplimiento GDPR por diseño.' }
    ],
    process: [
      { title: 'Product Scoping', description: 'Definición del alcance técnico y funcional del MVP.' },
      { title: 'Sprints Ágiles', description: 'Entregas funcionales cada 2 semanas para feedback rápido.' },
      { title: 'QA & Despliegue', description: 'Pruebas exhaustivas y puesta en producción automatizada.' }
    ],
    technologies: ['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'React Native'],
    faqs: [
      { question: '¿Cuánto tarda un MVP?', answer: 'Típicamente entre 4 y 8 semanas dependiendo de la complejidad.' },
      { question: '¿Incluye aplicación móvil?', answer: 'Sí, podemos desarrollar apps nativas o híbridas según necesidad.' }
    ]
  },
  {
    title: 'Posicionamiento SEO & GEO',
    slug: 'posicionamiento-seo-geo',
    shortDescription: 'Visibilidad Total: Desde Google Search hasta la recomendación en ChatGPT.',
    heroHeadline: 'Domina Google y la IA',
    heroHighlight: 'Domina',
    heroIntroduction: 'Fusionamos el SEO técnico clásico con la nueva optimización para Motores Generativos (GEO).',
    imageKeyword: 'ai-network',
    benefits: ['Tráfico de Buscadores', 'Recomendación en IAs', 'Estrategia Programática'],
    planSlugs: ['seo-base', 'ai-dominance'],
    // Detailed Sections
    features: [
      { title: 'GEO (Generative Engine Optimization)', description: 'Optimizamos para que ChatGPT y Perplexity te recomienden.' },
      { title: 'SEO Programático', description: 'Generación de miles de landings locales de alta calidad.' },
      { title: 'Autoridad de Dominio', description: 'Estrategias de Link Building ético y de alto impacto.' }
    ],
    process: [
      { title: 'Auditoría Técnica', description: 'Análisis profundo de indexabilidad y arquitectura web.' },
      { title: 'Keyword Research IA', description: 'Identificación de oportunidades de baja competencia y alto valor.' },
      { title: 'Ejecución Mensual', description: 'Creación de contenido, optimización técnica y enlaces.' }
    ],
    technologies: ['Ahrefs', 'Semrush', 'Google Search Console', 'Python', 'OpenAI API'],
    faqs: [
      { question: '¿Cuándo veré resultados?', answer: 'El SEO es a medio plazo, pero las mejoras técnicas se notan en semanas.' },
      { question: '¿Garantizáis la primera posición?', answer: 'Nadie puede garantizarlo, pero garantizamos trabajo profesional y transparente.' }
    ]
  },
  {
    title: 'Gestión Perfil Google',
    slug: 'gestion-perfil-google',
    shortDescription: 'Optimización local pura para negocios físicos. Aparece en el mapa.',
    heroHeadline: 'Lidera tu Zona Local',
    heroHighlight: 'Lidera',
    heroIntroduction: 'Gestión integral de tu reputación, reseñas y visibilidad en Google Maps.',
    imageKeyword: 'map-location',
    benefits: ['Visibilidad en Mapa', 'Gestión de Reseñas', 'Anti-Spam'],
    planSlug: 'local-reputation',
    // Detailed Sections
    features: [
      { title: 'Optimización GMB', description: 'Ficha de Google Business Profile completa y optimizada.' },
      { title: 'Gestión de Reseñas', description: 'Estrategias para conseguir más y mejores valoraciones.' },
      { title: 'Protección Anti-Spam', description: 'Eliminación de perfiles falsos y reseñas maliciosas.' }
    ],
    process: [
      { title: 'Verificación', description: 'Aseguramos la propiedad y control total de tu ficha.' },
      { title: 'Optimización Inicial', description: 'Relleno exhaustivo de todos los campos y categorías.' },
      { title: 'Mantenimiento Activo', description: 'Publicaciones semanales y respuesta a reseñas.' }
    ],
    technologies: ['Google Maps', 'Google Business Profile', 'Local Falcon', 'BrightLocal'],
    faqs: [
      { question: '¿Sirve si no tengo local físico?', answer: 'Sí, podemos configurar áreas de servicio para ocultar tu dirección.' },
      { question: '¿Cómo conseguís reseñas?', answer: 'Implementamos sistemas automatizados vía email/SMS post-venta.' }
    ]
  }
];

async function seed() {
  console.log('🌱 Iniciando Seed de Servicios CORRECTOS (Servicios y precios ejemplo.md)...');

  for (const service of SERVICES) {
    console.log(`Processing: ${service.title}`);

    // Buscar planes relacionados
    let planRefs = [];
    if (service.planSlug) {
      const plan = await client.fetch(`*[_type == "pricingPlan" && buttonLinkID.current == $slug][0]`, { slug: service.planSlug });
      if (plan) planRefs.push({ _type: 'reference', _ref: plan._id, _key: plan._id });
    } else if (service.planSlugs) {
      for (const slug of service.planSlugs) {
        const plan = await client.fetch(`*[_type == "pricingPlan" && buttonLinkID.current == $slug][0]`, { slug: slug });
        if (plan) planRefs.push({ _type: 'reference', _ref: plan._id, _key: plan._id });
      }
    }

    // Image Placeholder
    let imageAssetId = null;
    try {
      const res = await fetch(`https://picsum.photos/seed/${service.slug}/1200/800`);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const asset = await client.assets.upload('image', Buffer.from(buffer), { filename: `${service.slug}.jpg` });
        imageAssetId = asset._id;
      }
    } catch (e) {
      console.error('Error uploading image:', e.message);
    }

    const doc = {
      _id: `service-${service.slug}`,
      _type: 'service',
      title: service.title,
      slug: { _type: 'slug', current: service.slug },
      shortDescription: service.shortDescription,
      heroHeadline: service.heroHeadline,
      heroHighlight: service.heroHighlight,
      heroIntroduction: service.heroIntroduction,
      benefits: service.benefits,
      mainImage: imageAssetId ? {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageAssetId },
        alt: service.title
      } : undefined,
      pricing: {
        title: 'Planes Transparentes',
        subtitle: 'Elige la velocidad a la que quieres crecer.',
        plans: planRefs
      },
      // NEW SECTIONS
      features: service.features,
      featuresTitle: 'Características Premium',
      featuresHighlight: 'Premium',
      featuresDescription: 'Lo que nos diferencia del resto.',
      
      process: service.process,
      processTitle: 'Nuestro Proceso',
      processHighlight: 'Proceso',
      processDescription: 'Metodología probada para resultados consistentes.',
      
      technologies: service.technologies,
      techTitle: 'Stack Tecnológico',
      techHighlight: 'Tech',
      techDescription: 'Herramientas de última generación.',
      
      faqs: service.faqs,
      faqTitle: 'Preguntas Frecuentes',
      faqHighlight: 'Dudas',
      faqDescription: 'Resolvemos tus inquietudes antes de empezar.'
    };

    await client.createOrReplace(doc);
    console.log(`✅ Creado/Actualizado: ${service.title}`);
  }

  console.log('🏁 Seed de Servicios Completado.');
}

seed().catch(console.error);
