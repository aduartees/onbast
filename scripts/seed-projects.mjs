import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to read .env.local
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
        // Remove quotes if present
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

const projects = [
  {
    title: 'Neon Banking Interface',
    description: 'A futuristic banking dashboard with real-time crypto analytics and AI-driven insights. Built for high-frequency traders.',
    tags: ['Next.js', 'React', 'Tailwind', 'Web3'],
    link: 'https://example.com/project1'
  },
  {
    title: 'Aether Medical AI',
    description: 'AI-powered diagnostic assistant for radiology. Reduces analysis time by 40% using computer vision.',
    tags: ['Python', 'TensorFlow', 'React', 'FastAPI'],
    link: 'https://example.com/project2'
  },
  {
    title: 'Orbit Real Estate',
    description: 'Immersive 3D virtual tours for luxury penthouses. WebGL powered rendering with zero latency.',
    tags: ['Three.js', 'WebGL', 'Vue', 'GSAP'],
    link: 'https://example.com/project3'
  }
];

async function uploadImage(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    const buffer = await res.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: `placeholder-${Date.now()}.jpg`
    });
    return asset._id;
  } catch (error) {
    console.error('Image upload failed:', error);
    return null;
  }
}

async function seed() {
  console.log('🌱 Starting seed...');

  if (!env.SANITY_WRITE_TOKEN) {
    console.error('❌ SANITY_WRITE_TOKEN not found in .env.local');
    process.exit(1);
  }

  for (const project of projects) {
    console.log(`Processing: ${project.title}`);
    
    // Generate slug
    const slug = project.title.toLowerCase().replace(/\s+/g, '-').slice(0, 96);

    // Check if exists
    const existing = await client.fetch(`*[_type == "project" && slug.current == $slug][0]`, { slug });
    if (existing) {
      console.log(`  - Already exists, skipping.`);
      continue;
    }

    // Upload random image
    const imageUrl = `https://picsum.photos/seed/${slug}/800/600`;
    const imageAssetId = await uploadImage(imageUrl);

    if (!imageAssetId) {
      console.warn(`  - Failed to upload image for ${project.title}, skipping.`);
      continue;
    }

    const doc = {
      _type: 'project',
      title: project.title,
      slug: { _type: 'slug', current: slug },
      description: project.description,
      tags: project.tags,
      link: project.link,
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAssetId
        }
      }
    };

    await client.create(doc);
    console.log(`  ✅ Created: ${project.title}`);
  }

  console.log('✨ Seed complete!');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
