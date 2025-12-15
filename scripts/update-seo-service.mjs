import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

// Helper to load env
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local')
    const envFile = fs.readFileSync(envPath, 'utf8')
    const env = {}
    envFile.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        env[key.trim()] = value.trim()
      }
    })
    return env
  } catch (e) {
    console.error('Error loading .env.local', e)
    return {}
  }
}

const env = loadEnv()

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rfqphjqe',
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: env.SANITY_WRITE_TOKEN, // Use the token from env file
  useCdn: false,
})

console.log('Using Project ID:', client.config().projectId)
console.log('Using Dataset:', client.config().dataset)
console.log('Token starts with:', client.config().token ? client.config().token.substring(0, 5) + '...' : 'NO TOKEN')


const seoService = {
  _id: 'service-seo',
  _type: 'service',
  title: 'Posicionamiento SEO & GEO',
  slug: { _type: 'slug', current: 'posicionamiento-seo' },
  shortDescription: 'Dominamos Google y la nueva era de la IA (ChatGPT, Perplexity). Tu marca, omnipresente y con autoridad absoluta.',
  heroButtonText: 'Solicitar Auditoría SEO',
  heroButtonLink: '/contacto',
  icon: 'Search',
  
  // SEO Metadata
  seoTitle: 'Agencia SEO & GEO | Posicionamiento Web Avanzado 2025',
  seoDescription: 'Expertos en Posicionamiento SEO y GEO (Generative Engine Optimization). Hacemos que tu negocio destaque en Google y en respuestas de Inteligencia Artificial.',

  // Main Content
  longDescription: 'El SEO ha evolucionado. Ya no se trata solo de palabras clave y backlinks. En la era de la Inteligencia Artificial, tu marca debe ser la "entidad" de referencia. Fusionamos SEO Técnico de vanguardia, Estrategia de Contenidos Semántica y GEO (Generative Engine Optimization) para garantizar que seas la respuesta número uno, ya sea que te busquen en Google o te pregunten en ChatGPT.',
  
  overviewText: 'No buscamos simples clics. Buscamos dominar la intención de búsqueda transaccional. Nuestra metodología convierte tu web en una autoridad inquebrantable.',

  problem: 'Tu web es invisible. Estás quemando presupuesto en publicidad pagada (PPC) con un ROAS decreciente. Mientras tanto, tu competencia orgánica se lleva el tráfico cualificado gratis y, peor aún, las IAs como ChatGPT recomiendan a otros porque no entienden quién eres.',
  
  solution: 'Implementamos una arquitectura de "Data-First". Estructuramos tus datos para que sean perfectamente legibles por máquinas (JSON-LD Schemas avanzados). Creamos contenido que satisface la "E-E-A-T" (Experiencia, Autoridad, Confianza) de Google y optimizamos tu presencia para ser citada por los LLMs.',

  // Impact Section
  impactSection: {
    title: 'Resultados que Transforman Negocios',
    cards: [
      {
        _key: 'card1',
        title: '+450% Tráfico Orgánico',
        description: 'Crecimiento sostenido en 12 meses para cliente SaaS B2B mediante SEO programático.',
        colSpan: 2,
        minHeight: 400,
        color: 'indigo'
      },
      {
        _key: 'card2',
        title: 'Top 3 en "Agencia SEO"',
        description: 'Posicionamiento en keywords de alta competencia y CPC > $20.',
        colSpan: 1,
        minHeight: 400,
        color: 'blue'
      },
      {
        _key: 'card3',
        title: 'Dominio GEO',
        description: 'Logramos que Perplexity y ChatGPT citen a nuestros clientes como fuente primaria.',
        colSpan: 3,
        minHeight: 300,
        color: 'pink'
      }
    ]
  },

  // Features (Bento Grid)
  features: [
    {
      _key: 'feat1',
      title: 'SEO Técnico Extremo',
      description: 'Optimización de Crawl Budget, Core Web Vitals y renderizado JS. Tu web volará.',
      icon: 'Code'
    },
    {
      _key: 'feat2',
      title: 'GEO (Generative Optimization)',
      description: 'Estrategias para aparecer en las respuestas de ChatGPT, Claude y Gemini.',
      icon: 'Bot'
    },
    {
      _key: 'feat3',
      title: 'Link Building PR',
      description: 'Enlaces de medios de alta autoridad, no granjas de enlaces. Reputación real.',
      icon: 'Globe'
    },
    {
      _key: 'feat4',
      title: 'Contenido Programático',
      description: 'Generación de miles de landing pages transaccionales únicas para capturar long-tail.',
      icon: 'Layers'
    }
  ],

  // Benefits
  benefits: [
    'Reducción drástica del CAC (Coste de Adquisición)',
    'Activo digital que se revaloriza con el tiempo',
    'Visibilidad en el nuevo paradigma de búsqueda (IA)',
    'Tráfico cualificado con alta intención de compra'
  ],

  // Process
  process: [
    {
      _key: 'step1',
      title: '1. Auditoría Forense',
      description: 'Analizamos cada línea de código, log de servidor y perfil de enlaces. Encontramos los frenos ocultos.'
    },
    {
      _key: 'step2',
      title: '2. Arquitectura Semántica',
      description: 'Rediseñamos la estructura de la información basada en entidades y clústeres temáticos.'
    },
    {
      _key: 'step3',
      title: '3. Ejecución de Contenidos',
      description: 'Producción de contenido de autoridad optimizado para NLP (Procesamiento de Lenguaje Natural).'
    },
    {
      _key: 'step4',
      title: '4. Autoridad & Amplificación',
      description: 'Campaña de Digital PR para conseguir menciones y enlaces que validen tu autoridad.'
    }
  ],

  // Technologies
  technologies: [
    'Google Search Console', 'Ahrefs', 'Semrush', 'Screaming Frog', 
    'Surfer SEO', 'Schema.org', 'Python', 'OpenAI'
  ],

  // FAQs
  faqs: [
    {
      _key: 'faq1',
      question: '¿Cuánto tiempo tarda en verse resultados?',
      answer: 'El SEO es una estrategia a medio-largo plazo. Generalmente, se ven mejoras técnicas en el primer mes, y tracción de tráfico significativa a partir del mes 3-6, dependiendo de la competencia y el estado inicial.'
    },
    {
      _key: 'faq2',
      question: '¿Qué es GEO y por qué me importa?',
      answer: 'GEO (Generative Engine Optimization) es la optimización para motores de búsqueda basados en IA como ChatGPT. Es vital porque cada vez más usuarios buscan respuestas directas en IAs en lugar de listas de enlaces azules.'
    },
    {
      _key: 'faq3',
      question: '¿Hacéis SEO para e-commerce?',
      answer: 'Sí, somos especialistas en SEO para Shopify, Magento y Woocommerce, optimizando miles de fichas de producto y categorías automáticamente.'
    }
  ]
}

async function run() {
  try {
    console.log('Iniciando actualización de servicio SEO...')
    
    // Create or Replace the document
    const result = await client.createOrReplace(seoService)
    
    console.log('✅ Servicio SEO actualizado correctamente:', result._id)
  } catch (err) {
    console.error('❌ Error actualizando servicio:', err)
  }
}

run()
