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

async function cleanup() {
  console.log('🗑️  INICIANDO LIMPIEZA DE DATOS INCORRECTOS...');

  // 1. Borrar Services
  console.log('   - Borrando Servicios antiguos...');
  await client.delete({query: '*[_type == "service"]'});
  
  // 2. Borrar Pricing Plans
  console.log('   - Borrando Planes de Precio antiguos...');
  await client.delete({query: '*[_type == "pricingPlan"]'});

  // 3. Borrar Pricing Addons
  console.log('   - Borrando Add-ons antiguos...');
  await client.delete({query: '*[_type == "pricingAddon"]'});

  // 4. Borrar Service Locations (Landings generadas con datos malos)
  console.log('   - Borrando Landings GEO generadas...');
  await client.delete({query: '*[_type == "serviceLocation"]'});

  console.log('✨ LIMPIEZA COMPLETADA. La base de datos está lista para los datos correctos.');
}

cleanup().catch(console.error);
