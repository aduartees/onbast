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

const SERVICES = [
  {
    title: 'Desarrollo Web',
    slug: 'desarrollo-web',
    shortDescription: 'Sitios web de alto rendimiento construidos con Next.js y tecnologías modernas.',
    heroHeadline: 'Tu Negocio, en la Cima Digital',
    heroHighlight: 'Cima',
    heroIntroduction: 'Creamos experiencias web ultrarrápidas que convierten visitantes en clientes.',
    imageKeyword: 'code',
    benefits: ['Velocidad Extrema', 'SEO Nativo', 'Diseño Responsivo']
  },
  {
    title: 'Posicionamiento SEO',
    slug: 'posicionamiento-seo',
    shortDescription: 'Estrategias de posicionamiento orgánico para dominar los resultados de búsqueda.',
    heroHeadline: 'Domina los Resultados de Búsqueda',
    heroHighlight: 'Domina',
    heroIntroduction: 'Auditoría técnica, estrategia de contenidos y autoridad de dominio.',
    imageKeyword: 'analytics',
    benefits: ['Tráfico Cualificado', 'Autoridad de Marca', 'Resultados Duraderos']
  },
  {
    title: 'Diseño UI/UX',
    slug: 'diseno-ui-ux',
    shortDescription: 'Interfaces intuitivas y atractivas que enamoran a tus usuarios.',
    heroHeadline: 'Diseño que Enamora y Convierte',
    heroHighlight: 'Enamora',
    heroIntroduction: 'Prototipado, sistemas de diseño y pruebas de usabilidad.',
    imageKeyword: 'design',
    benefits: ['Mejor Retención', 'Identidad Visual', 'Usabilidad']
  }
];

async function seed() {
  console.log('🌱 Iniciando Seed de Servicios (Avanzado)...');

  // 1. Obtener Planes de Precios para vincular
  const plans = await client.fetch(`*[_type == "pricingPlan"]{_id, buttonLinkID}`);
  const planRefs = plans.map(p => ({ _type: 'reference', _ref: p._id, _key: p._id }));

  console.log(`💰 Encontrados ${plans.length} planes de precios para vincular.`);

  for (const service of SERVICES) {
    console.log(`Processing: ${service.title}`);
    
    // Check if exists
    const exists = await client.fetch(`count(*[_type == "service" && slug.current == $slug])`, { slug: service.slug });
    
    if (exists > 0) {
      console.log(`⏩ Saltando (Ya existe): ${service.title}`);
      continue;
    }

    // Image Placeholder (Picsum)
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
        title: 'Planes Flexibles',
        subtitle: 'Elige la opción que mejor se adapte a tu crecimiento.',
        plans: planRefs // Vinculamos TODOS los planes disponibles por defecto
      }
    };

    await client.create(doc);
    console.log(`✅ Creado: ${service.title}`);
  }

  console.log('🏁 Seed de Servicios Completado.');
}

seed().catch(console.error);
