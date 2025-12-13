import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const env = {};
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        env[key] = value;
      }
    });
    return env;
  } catch (error) {
    console.error('Error reading .env.local:', error);
    return {};
  }
}

const env = loadEnv();

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-07-26',
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const services = [
  {
    title: 'AI-First Development',
    description: 'We integrate Generative AI into the core of your product, automating complex workflows and creating personalized experiences.',
    icon: 'Bot',
    colSpan: 2,
    imageKeyword: 'artificial-intelligence'
  },
  {
    title: 'Hyper-Performance',
    description: 'Zero-latency interfaces powered by Edge Computing and Rust-based tooling. We optimize for Core Web Vitals.',
    icon: 'Zap',
    colSpan: 1,
    imageKeyword: 'speed'
  },
  {
    title: 'Scalable Architecture',
    description: 'Systems designed to handle millions of requests. Microservices, Serverless, and Event-Driven patterns.',
    icon: 'Layers',
    colSpan: 1,
    imageKeyword: 'server'
  },
  {
    title: 'Radical UX/UI',
    description: 'Award-winning aesthetics that capture attention. Motion design, 3D elements, and intuitive interactions.',
    icon: 'Palette',
    colSpan: 1,
    imageKeyword: 'design'
  }
];

async function uploadImage(keyword) {
  try {
    const url = `https://picsum.photos/seed/${keyword}/600/400`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    const buffer = await res.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: `service-${keyword}-${Date.now()}.jpg`
    });
    return asset._id;
  } catch (error) {
    console.error('Image upload failed:', error);
    return null;
  }
}

async function seed() {
  console.log('🌱 Starting Services seed...');

  if (!env.SANITY_WRITE_TOKEN) {
    console.error('❌ SANITY_WRITE_TOKEN not found in .env.local');
    process.exit(1);
  }

  for (const service of services) {
    console.log(`Processing: ${service.title}`);
    
    // Check if exists
    const existing = await client.fetch(`*[_type == "service" && title == $title][0]`, { title: service.title });
    if (existing) {
      console.log(`  - Already exists, skipping.`);
      continue;
    }

    // Upload random image
    const imageAssetId = await uploadImage(service.imageKeyword);

    const doc = {
      _type: 'service',
      title: service.title,
      description: service.description,
      icon: service.icon,
      colSpan: service.colSpan,
      image: imageAssetId ? {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAssetId
        }
      } : undefined
    };

    await client.create(doc);
    console.log(`  ✅ Created: ${service.title}`);
  }

  console.log('✨ Services Seed complete!');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
