import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

async function check() {
  const count = await client.fetch(`count(*[_type == "serviceLocation"])`);
  console.log(`📊 Total Service Locations found: ${count}`);
  
  const items = await client.fetch(`*[_type == "serviceLocation"]{ 
    "serviceName": service->title, 
    "locationName": location->name 
  }`);
  
  items.forEach(item => {
    console.log(`- ${item.serviceName} en ${item.locationName}`);
  });
}

check().catch(console.error);
