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

const teamMember = {
  _id: 'team-seo-lead',
  _type: 'teamMember',
  name: 'Alex Rivera',
  role: 'Head of SEO & GEO Strategy',
  // No image for now, or use a placeholder URL if I could upload it, but for now we skip image asset upload logic to avoid complexity
  social: {
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  }
}

const testimonial = {
  _id: 'testimonial-seo-1',
  _type: 'testimonial',
  name: 'Carlos Mendez',
  role: 'CEO @ TechStart',
  quote: 'Increíble. Pasamos de la página 5 a la 1 en 3 meses. El tráfico cualificado se ha triplicado y el ROI es indiscutible.',
}

async function run() {
  try {
    console.log('Creando Team Member y Testimonial...')
    await client.createOrReplace(teamMember)
    await client.createOrReplace(testimonial)
    
    console.log('Vinculando a Servicio SEO con _keys...')
    await client.patch('service-seo')
      .set({
        team: [{ _type: 'reference', _ref: teamMember._id, _key: 'rel-team-seo-1' }],
        testimonials: [{ _type: 'reference', _ref: testimonial._id, _key: 'rel-testimonial-seo-1' }]
      })
      .commit()

    console.log('✅ Relaciones actualizadas correctamente.')
  } catch (err) {
    console.error('❌ Error actualizando relaciones:', err)
  }
}

run()
