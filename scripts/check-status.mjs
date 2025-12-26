import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((rawLine) => {
    const line = String(rawLine || '').trim();
    if (!line.length || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!key.length) return;
    process.env[key] = value.replace(/^["']|["']$/g, '');
  });
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function check() {
  const [servicesCount, locationsCount, serviceLocationsCount] = await Promise.all([
    client.fetch(`count(*[_type == "service" && defined(slug.current)])`),
    client.fetch(`count(*[_type == "location" && defined(slug.current)])`),
    client.fetch(`count(*[_type == "serviceLocation"])`),
  ]);

  console.log(`📊 Servicios con slug: ${servicesCount}`);
  console.log(`📍 Ubicaciones con slug: ${locationsCount}`);
  console.log(`🧩 Total Service Locations: ${serviceLocationsCount}`);

  const [services, locations] = await Promise.all([
    client.fetch(`*[_type == "service" && defined(slug.current)]|order(title asc){title, "slug": slug.current}`),
    client.fetch(`*[_type == "location" && defined(slug.current)]|order(name asc){name, "slug": slug.current}`),
  ]);

  console.log('🧾 Service slugs:', services.map((s) => s.slug).join(', '));
  console.log('🗺️ Location slugs:', locations.map((l) => l.slug).join(', '));
  
  const items = await client.fetch(`*[_type == "serviceLocation"]{ 
    "serviceName": service->title, 
    "locationName": location->name,
    "serviceSlug": service->slug.current,
    "locationSlug": location->slug.current
  } | order(serviceName asc, locationName asc)`);
  
  items.forEach((item) => {
    const url = item.serviceSlug && item.locationSlug ? `/${item.serviceSlug}/${item.locationSlug}` : '(sin slugs)';
    console.log(`- ${item.serviceName} en ${item.locationName} -> ${url}`);
  });
}

check().catch(console.error);
