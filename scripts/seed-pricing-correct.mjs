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

// DATOS REALES BASADOS EN "Servicios y precios ejemplo.md"

const PLANS = [
  // A. Desarrollo Web
  {
    _type: 'pricingPlan',
    title: 'Suscripción Corporate',
    price: '200',
    currency: 'EUR',
    period: '/mes',
    description: 'No compres una web que envejece. Suscríbete a una plataforma viva.',
    badge: 'Website as a Service',
    features: [
      'Arquitectura Next.js 15 (Ultra-rápida)',
      'Diseño UI Premium (Sistema Propio)',
      'CMS Sanity Autogestionable',
      'Hosting Vercel + Mantenimiento Incluido',
      '2 Cambios de diseño al mes',
      'SEO Técnico On-page básico'
    ],
    buttonText: 'Suscribirme',
    buttonLinkID: { _type: 'slug', current: 'suscripcion-corporate' }
  },
  // B. Apps Web
  {
    _type: 'pricingPlan',
    title: 'Sprint Dedicado',
    price: '3.500',
    currency: 'EUR',
    period: '/Sprint (2 semanas)',
    description: 'Tu equipo de ingeniería de élite, on-demand. Para MVPs y Software.',
    badge: 'Ingeniería Pesada',
    features: [
      'Equipo Completo Dedicado',
      'Código en Propiedad (GitHub)',
      'Stack: React Native / Supabase / Node',
      'Garantía de Entrega Funcional',
      'Semana de Consultoría Gratis'
    ],
    buttonText: 'Reservar Sprint',
    buttonLinkID: { _type: 'slug', current: 'sprint-dedicado' }
  },
  // C. SEO (Nivel 1)
  {
    _type: 'pricingPlan',
    title: 'Posicionamiento SEO',
    price: '150',
    currency: 'EUR',
    period: '/mes',
    description: 'Para quien quiere aparecer en Google hoy. La base sólida.',
    badge: 'Visibilidad Base',
    features: [
      'Auditoría Técnica',
      'Keyword Research Clásico',
      '4 Artículos de Blog Mensuales',
      '1 Landing Page Mensual',
      'Linkbuilding Básico'
    ],
    buttonText: 'Empezar SEO',
    buttonLinkID: { _type: 'slug', current: 'seo-base' }
  },
  // C. SEO (Nivel 2)
  {
    _type: 'pricingPlan',
    title: 'AI Dominance',
    price: '300',
    currency: 'EUR',
    period: '/mes',
    description: 'Para quien quiere aparecer en Google, ChatGPT y Perplexity mañana.',
    badge: 'RECOMENDADO',
    features: [
      'Todo lo del Plan Base',
      'Estrategia GEO (IA Optimization)',
      '10 Landings Locales/mes (Programática)',
      'Inyección Semántica para LLMs',
      'Consistencia NAP en Directorios'
    ],
    buttonText: 'Dominar Mercado',
    buttonLinkID: { _type: 'slug', current: 'ai-dominance' }
  },
  // D. Gestión Local
  {
    _type: 'pricingPlan',
    title: 'Local Reputation',
    price: '150',
    currency: 'EUR',
    period: '/mes',
    description: 'Gestión pura de Google Business Profile. Ideal negocios físicos.',
    badge: 'Local',
    features: [
      'Optimización Perfil Google',
      '2 Ofertas Manuales al mes',
      'Respuesta a Reseñas',
      'Google Posts cada 3 días',
      'Defensa Anti-Spam'
    ],
    buttonText: 'Gestionar Local',
    buttonLinkID: { _type: 'slug', current: 'local-reputation' }
  }
];

const ADDONS = [
  {
    _type: 'pricingAddon',
    title: 'Migración Contenido Complejo',
    price: 'Consultar',
    description: 'Pago único. Depende del volumen de datos a migrar.',
    id: { _type: 'slug', current: 'migracion-contenido' }
  },
  {
    _type: 'pricingAddon',
    title: 'Gestión Perfil Google (Addon)',
    price: '+150€/mes',
    description: 'Añade gestión local a tu plan web o SEO.',
    id: { _type: 'slug', current: 'addon-gmb' }
  }
];

async function seed() {
  console.log('🌱 Iniciando Seed de Precios CORRECTOS (Servicios y precios ejemplo.md)...');

  // 1. Crear Planes
  for (const plan of PLANS) {
    // Usamos createOrReplace para asegurar que si existe, se actualice con lo correcto
    const id = `plan-${plan.buttonLinkID.current}`;
    await client.createOrReplace({ ...plan, _id: id });
    console.log(`✅ Plan creado/actualizado: ${plan.title}`);
  }

  // 2. Crear Addons
  for (const addon of ADDONS) {
    const id = `addon-${addon.id.current}`;
    await client.createOrReplace({ ...addon, _id: id });
    console.log(`✅ Addon creado/actualizado: ${addon.title}`);
  }

  console.log('🏁 Seed de Precios Completado.');
}

seed().catch(console.error);
