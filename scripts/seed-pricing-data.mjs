import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const PLANS = [
  {
    _type: 'pricingPlan',
    title: 'Landing Page Express',
    price: '950',
    currency: 'EUR',
    period: 'Pago Único',
    description: 'Ideal para campañas de publicidad o validación de productos.',
    badge: 'Rápido',
    features: ['Diseño High-End (Aceternity UI)', 'Copywriting Persuasivo', 'Optimización Velocidad (90+)', 'Integración Analytics', 'Entrega en 1 Semana'],
    buttonText: 'Empezar Proyecto',
    buttonLinkID: { _type: 'slug', current: 'landing-express' }
  },
  {
    _type: 'pricingPlan',
    title: 'Web Corporativa Pro',
    price: '2.450',
    currency: 'EUR',
    period: 'Pago Único',
    description: 'Sitio web completo para empresas que buscan autoridad digital.',
    badge: 'Más Popular',
    features: ['Hasta 10 Páginas Internas', 'CMS Autogestionable (Sanity)', 'SEO On-Page Avanzado', 'Blog Corporativo', 'Integración CRM Básica', 'Formación de Uso'],
    buttonText: 'Solicitar Presupuesto',
    buttonLinkID: { _type: 'slug', current: 'web-corporativa' }
  },
  {
    _type: 'pricingPlan',
    title: 'E-commerce Scalable',
    price: '4.800',
    currency: 'EUR',
    period: 'Desde',
    description: 'Tienda online robusta preparada para escalar ventas.',
    badge: 'Ventas',
    features: ['Shopify o Next.js Commerce', 'Pasarelas de Pago Avanzadas', 'Sincronización de Stock', 'Filtros de Búsqueda Potentes', 'Recuperación de Carritos', 'Dashboard de Ventas'],
    buttonText: 'Consultar Alcance',
    buttonLinkID: { _type: 'slug', current: 'ecommerce' }
  }
];

const ADDONS = [
  {
    _type: 'pricingAddon',
    title: 'SEO Mensual (Growth)',
    price: '450€/mes',
    description: 'Estrategia de contenidos y linkbuilding recurrente.',
    id: { _type: 'slug', current: 'seo-mensual' }
  },
  {
    _type: 'pricingAddon',
    title: 'Mantenimiento Técnico',
    price: '120€/mes',
    description: 'Actualizaciones, copias de seguridad y monitorización 24/7.',
    id: { _type: 'slug', current: 'mantenimiento' }
  },
  {
    _type: 'pricingAddon',
    title: 'Pack Google Ads',
    price: '300€/mes',
    description: 'Gestión y optimización de campañas SEM (inversión aparte).',
    id: { _type: 'slug', current: 'google-ads' }
  },
  {
    _type: 'pricingAddon',
    title: 'Google My Business (Local)',
    price: '250€ (Único)',
    description: 'Optimización de ficha local y reputación.',
    id: { _type: 'slug', current: 'gmb-setup' }
  }
];

async function seed() {
  console.log('🌱 Iniciando Seed de Precios...');

  // 1. Crear Planes
  for (const plan of PLANS) {
    const exists = await client.fetch(`count(*[_type == "pricingPlan" && buttonLinkID.current == $slug])`, { slug: plan.buttonLinkID.current });
    if (exists === 0) {
      await client.create(plan);
      console.log(`✅ Plan creado: ${plan.title}`);
    } else {
      console.log(`⏩ Plan ya existe: ${plan.title}`);
    }
  }

  // 2. Crear Addons
  for (const addon of ADDONS) {
    const exists = await client.fetch(`count(*[_type == "pricingAddon" && id.current == $slug])`, { slug: addon.id.current });
    if (exists === 0) {
      await client.create(addon);
      console.log(`✅ Addon creado: ${addon.title}`);
    } else {
      console.log(`⏩ Addon ya existe: ${addon.title}`);
    }
  }

  console.log('🏁 Seed de Precios Completado.');
}

seed().catch(console.error);
