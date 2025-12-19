import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Cargar variables de entorno manualmente sin dotenv
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../.env.local')

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8')
  envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '') // Remove quotes
    }
  })
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN, // Token con permisos de escritura
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Datos de Prueba (Seed Data) con Coordenadas y Wikipedia
const SEED_DATA = [
  // CASO 1: ESTÁNDAR (Capital -> Pueblos)
  {
    name: 'Madrid',
    slug: 'madrid',
    type: 'city',
    population: 3223000,
    gentilicio: 'Madrileños',
    geoContext: 'Madrid es el motor económico de España, sede de las principales multinacionales y startups tecnológicas.',
    coordinates: { _type: 'geopoint', lat: 40.4168, lng: -3.7038, alt: 657 },
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Madrid',
    children: [
      { 
        name: 'Getafe', slug: 'getafe', type: 'town', population: 185000, gentilicio: 'Getafenses',
        coordinates: { _type: 'geopoint', lat: 40.3083, lng: -3.7328, alt: 622 },
        wikipediaUrl: 'https://es.wikipedia.org/wiki/Getafe'
      },
      { 
        name: 'Leganés', slug: 'leganes', type: 'town', population: 191000, gentilicio: 'Pepineros',
        coordinates: { _type: 'geopoint', lat: 40.3280, lng: -3.7635, alt: 665 },
        wikipediaUrl: 'https://es.wikipedia.org/wiki/Legan%C3%A9s'
      },
      { 
        name: 'Alcobendas', slug: 'alcobendas', type: 'town', population: 117000, gentilicio: 'Alcobendenses',
        coordinates: { _type: 'geopoint', lat: 40.5475, lng: -3.6420, alt: 700 },
        wikipediaUrl: 'https://es.wikipedia.org/wiki/Alcobendas'
      }
    ]
  },
  // CASO 2: UNIPROVINCIAL (Región -> Capital + Pueblos)
  {
    name: 'Cantabria',
    slug: 'cantabria',
    type: 'city',
    population: 585000,
    gentilicio: 'Cántabros',
    geoContext: 'Cantabria combina industria pesada y turismo de alta calidad en el norte de España.',
    coordinates: { _type: 'geopoint', lat: 43.2000, lng: -4.0333, alt: 15 },
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Cantabria',
    children: [
      { 
        name: 'Santander', slug: 'santander', type: 'town', population: 172000, gentilicio: 'Santanderinos',
        coordinates: { _type: 'geopoint', lat: 43.4623, lng: -3.8099, alt: 15 },
        wikipediaUrl: 'https://es.wikipedia.org/wiki/Santander_(Espa%C3%B1a)'
      },
      { 
        name: 'Torrelavega', slug: 'torrelavega', type: 'town', population: 51000, gentilicio: 'Torrelaveguenses',
        coordinates: { _type: 'geopoint', lat: 43.3494, lng: -4.0479, alt: 25 },
        wikipediaUrl: 'https://es.wikipedia.org/wiki/Torrelavega'
      }
    ]
  },
  // CASO 3: PROVINCIAL DIRECTO
  {
    name: 'Sevilla',
    slug: 'sevilla',
    type: 'city',
    population: 688000,
    gentilicio: 'Sevillanos',
    geoContext: 'Sevilla es el centro financiero y cultural del sur, con fuerte presencia en sector servicios y aeronáutico.',
    coordinates: { _type: 'geopoint', lat: 37.3891, lng: -5.9845, alt: 7 },
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Sevilla',
    children: [
      { 
        name: 'Dos Hermanas', slug: 'dos-hermanas', type: 'town', population: 135000, gentilicio: 'Nazarenos',
        coordinates: { _type: 'geopoint', lat: 37.2829, lng: -5.9209, alt: 42 },
        wikipediaUrl: 'https://es.wikipedia.org/wiki/Dos_Hermanas'
      }
    ]
  }
]

async function seedLocations() {
  console.log('🌱 Iniciando semillado de ubicaciones con datos GEO extendidos...')

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ Error: Falta SANITY_WRITE_TOKEN en .env.local')
    process.exit(1)
  }

  for (const parent of SEED_DATA) {
    console.log(`\n📍 Procesando Padre: ${parent.name}`)

    // 1. Crear/Actualizar Padre
    const parentDoc = {
      _type: 'location',
      _id: `location-${parent.slug}`,
      name: parent.name,
      slug: { _type: 'slug', current: parent.slug },
      type: parent.type,
      population: parent.population,
      gentilicio: parent.gentilicio,
      geoContext: parent.geoContext,
      coordinates: parent.coordinates,
      wikipediaUrl: parent.wikipediaUrl
    }

    const createdParent = await client.createOrReplace(parentDoc)
    console.log(`   ✅ Padre creado: ${createdParent.name} (Coords: ${createdParent.coordinates?.lat}, ${createdParent.coordinates?.lng})`)

    // 2. Crear/Actualizar Hijos
    if (parent.children && parent.children.length > 0) {
      for (const child of parent.children) {
        const childDoc = {
          _type: 'location',
          _id: `location-${child.slug}`,
          name: child.name,
          slug: { _type: 'slug', current: child.slug },
          type: child.type,
          parent: {
            _type: 'reference',
            _ref: createdParent._id
          },
          population: child.population,
          gentilicio: child.gentilicio,
          geoContext: `Economía local de ${child.name} vinculada a ${parent.name}.`,
          coordinates: child.coordinates,
          wikipediaUrl: child.wikipediaUrl
        }

        const createdChild = await client.createOrReplace(childDoc)
        console.log(`      ↳ 🏘️ Hijo creado: ${child.name} (Coords: ${createdChild.coordinates?.lat}, ${createdChild.coordinates?.lng})`)
      }
    }
  }

  console.log('\n✨ Semillado completado con éxito.')
}

seedLocations().catch((err) => {
  console.error('❌ Error en el semillado:', err)
  process.exit(1)
})
