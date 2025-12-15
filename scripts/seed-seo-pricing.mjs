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
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const pricingData = {
  title: "Planes de Dominio Digital",
  subtitle: "Estrategias flexibles que crecen contigo. Sin permanencia forzosa.",
  badge: "Plazas Limitadas",
  price: "1.850€",
  period: "/mes",
  description: "Todo lo que necesitas para escalar tu tráfico orgánico y autoridad de marca.",
  buttonText: "Solicitar Plaza",
  buttonLink: "/contacto",
  secondaryButtonText: "Ver Casos de Éxito",
  secondaryButtonLink: "/proyectos",
  features: [
    "Auditoría Técnica Profunda (Crawl Budget, JS)",
    "Estrategia GEO (Generative Engine Optimization)",
    "4 Power Pages Mensuales (Contenido 10x)",
    "Linkbuilding de Autoridad (DR 60+)",
    "Optimización Google Business Profile",
    "Dashboard en Tiempo Real (Looker Studio)",
    "Soporte Prioritario Slack"
  ],
  addon: {
    title: "Pack Expansión Internacional",
    price: "+950€",
    active: false
  }
}

async function run() {
  try {
    console.log('Searching for "posicionamiento-seo" service...')
    const query = `*[_type == "service" && slug.current == "posicionamiento-seo"][0]._id`
    const docId = await client.fetch(query)

    if (!docId) {
      console.error('Service not found!')
      return
    }

    console.log(`Found service ID: ${docId}. Updating pricing...`)

    await client
      .patch(docId)
      .set({ pricing: pricingData })
      .commit()

    console.log('Pricing updated successfully!')
  } catch (err) {
    console.error('Error updating pricing:', err.message)
  }
}

run()
