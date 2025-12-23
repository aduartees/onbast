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

const argSet = new Set(process.argv.slice(2));
const dryRun = !argSet.has('--yes');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset) {
  console.error('ERROR: Falta NEXT_PUBLIC_SANITY_PROJECT_ID o NEXT_PUBLIC_SANITY_DATASET en .env.local');
  process.exit(1);
}

if (!token) {
  console.error('ERROR: Falta SANITY_WRITE_TOKEN en .env.local');
  process.exit(1);
}

const sanity = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-07-26',
  useCdn: false,
});

const slugValue = (current) => ({
  _type: 'slug',
  current,
});

const geoPoint = (lat, lng) => ({
  _type: 'geopoint',
  lat,
  lng,
});

const ref = (id) => ({
  _type: 'reference',
  _ref: id,
});

const docs = {
  autonomousCommunities: [
    {
      _id: 'autonomousCommunity-cantabria',
      _type: 'autonomousCommunity',
      name: 'Cantabria',
      slug: slugValue('cantabria'),
      coordinates: geoPoint(43.1828, -3.9878),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Cantabria',
    },
    {
      _id: 'autonomousCommunity-comunidad-de-madrid',
      _type: 'autonomousCommunity',
      name: 'Comunidad de Madrid',
      slug: slugValue('comunidad-de-madrid'),
      coordinates: geoPoint(40.4168, -3.7038),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Comunidad_de_Madrid',
    },
    {
      _id: 'autonomousCommunity-andalucia',
      _type: 'autonomousCommunity',
      name: 'Andalucía',
      slug: slugValue('andalucia'),
      coordinates: geoPoint(37.5443, -4.7278),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Andaluc%C3%ADa',
    },
  ],
  provinces: [
    {
      _id: 'province-cantabria',
      _type: 'province',
      name: 'Cantabria',
      slug: slugValue('cantabria'),
      coordinates: geoPoint(43.1828, -3.9878),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Cantabria',
    },
    {
      _id: 'province-madrid',
      _type: 'province',
      name: 'Madrid',
      slug: slugValue('madrid'),
      coordinates: geoPoint(40.4168, -3.7038),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Provincia_de_Madrid',
    },
    {
      _id: 'province-sevilla',
      _type: 'province',
      name: 'Sevilla',
      slug: slugValue('sevilla'),
      coordinates: geoPoint(37.3891, -5.9845),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Provincia_de_Sevilla',
    },
  ],
  locations: [
    {
      _id: 'location-santander',
      _type: 'location',
      name: 'Santander',
      slug: slugValue('santander'),
      type: 'city',
      province: ref('province-cantabria'),
      autonomousCommunity: ref('autonomousCommunity-cantabria'),
      coordinates: geoPoint(43.4623, -3.80998),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Santander',
    },
    {
      _id: 'location-torrelavega',
      _type: 'location',
      name: 'Torrelavega',
      slug: slugValue('torrelavega'),
      type: 'town',
      province: ref('province-cantabria'),
      autonomousCommunity: ref('autonomousCommunity-cantabria'),
      coordinates: geoPoint(43.3516, -4.0470),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Torrelavega',
    },
    {
      _id: 'location-castro-urdiales',
      _type: 'location',
      name: 'Castro-Urdiales',
      slug: slugValue('castro-urdiales'),
      type: 'town',
      province: ref('province-cantabria'),
      autonomousCommunity: ref('autonomousCommunity-cantabria'),
      coordinates: geoPoint(43.3828, -3.2196),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Castro-Urdiales',
    },
    {
      _id: 'location-laredo',
      _type: 'location',
      name: 'Laredo',
      slug: slugValue('laredo'),
      type: 'town',
      province: ref('province-cantabria'),
      autonomousCommunity: ref('autonomousCommunity-cantabria'),
      coordinates: geoPoint(43.4092, -3.4141),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Laredo_(Cantabria)',
    },
    {
      _id: 'location-santona',
      _type: 'location',
      name: 'Santoña',
      slug: slugValue('santona'),
      type: 'town',
      province: ref('province-cantabria'),
      autonomousCommunity: ref('autonomousCommunity-cantabria'),
      coordinates: geoPoint(43.4422, -3.4577),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Santo%C3%B1a',
    },

    {
      _id: 'location-madrid',
      _type: 'location',
      name: 'Madrid',
      slug: slugValue('madrid'),
      type: 'city',
      province: ref('province-madrid'),
      autonomousCommunity: ref('autonomousCommunity-comunidad-de-madrid'),
      coordinates: geoPoint(40.4168, -3.7038),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Madrid',
    },
    {
      _id: 'location-getafe',
      _type: 'location',
      name: 'Getafe',
      slug: slugValue('getafe'),
      type: 'town',
      parent: ref('location-madrid'),
      province: ref('province-madrid'),
      autonomousCommunity: ref('autonomousCommunity-comunidad-de-madrid'),
      coordinates: geoPoint(40.3083, -3.7327),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Getafe',
    },
    {
      _id: 'location-leganes',
      _type: 'location',
      name: 'Leganés',
      slug: slugValue('leganes'),
      type: 'town',
      parent: ref('location-madrid'),
      province: ref('province-madrid'),
      autonomousCommunity: ref('autonomousCommunity-comunidad-de-madrid'),
      coordinates: geoPoint(40.3272, -3.7635),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Legan%C3%A9s',
    },
    {
      _id: 'location-alcorcon',
      _type: 'location',
      name: 'Alcorcón',
      slug: slugValue('alcorcon'),
      type: 'town',
      parent: ref('location-madrid'),
      province: ref('province-madrid'),
      autonomousCommunity: ref('autonomousCommunity-comunidad-de-madrid'),
      coordinates: geoPoint(40.3468, -3.8278),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Alcorc%C3%B3n',
    },
    {
      _id: 'location-mostoles',
      _type: 'location',
      name: 'Móstoles',
      slug: slugValue('mostoles'),
      type: 'town',
      parent: ref('location-madrid'),
      province: ref('province-madrid'),
      autonomousCommunity: ref('autonomousCommunity-comunidad-de-madrid'),
      coordinates: geoPoint(40.3223, -3.8649),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/M%C3%B3stoles',
    },
    {
      _id: 'location-alcala-de-henares',
      _type: 'location',
      name: 'Alcalá de Henares',
      slug: slugValue('alcala-de-henares'),
      type: 'town',
      parent: ref('location-madrid'),
      province: ref('province-madrid'),
      autonomousCommunity: ref('autonomousCommunity-comunidad-de-madrid'),
      coordinates: geoPoint(40.48198, -3.36354),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Alcal%C3%A1_de_Henares',
    },

    {
      _id: 'location-sevilla',
      _type: 'location',
      name: 'Sevilla',
      slug: slugValue('sevilla'),
      type: 'city',
      province: ref('province-sevilla'),
      autonomousCommunity: ref('autonomousCommunity-andalucia'),
      coordinates: geoPoint(37.3891, -5.9845),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Sevilla',
    },
    {
      _id: 'location-dos-hermanas',
      _type: 'location',
      name: 'Dos Hermanas',
      slug: slugValue('dos-hermanas'),
      type: 'town',
      parent: ref('location-sevilla'),
      province: ref('province-sevilla'),
      autonomousCommunity: ref('autonomousCommunity-andalucia'),
      coordinates: geoPoint(37.2866, -5.9243),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Dos_Hermanas',
    },
    {
      _id: 'location-alcala-de-guadaira',
      _type: 'location',
      name: 'Alcalá de Guadaíra',
      slug: slugValue('alcala-de-guadaira'),
      type: 'town',
      parent: ref('location-sevilla'),
      province: ref('province-sevilla'),
      autonomousCommunity: ref('autonomousCommunity-andalucia'),
      coordinates: geoPoint(37.3380, -5.8440),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Alcal%C3%A1_de_Guada%C3%ADra',
    },
    {
      _id: 'location-utrera',
      _type: 'location',
      name: 'Utrera',
      slug: slugValue('utrera'),
      type: 'town',
      parent: ref('location-sevilla'),
      province: ref('province-sevilla'),
      autonomousCommunity: ref('autonomousCommunity-andalucia'),
      coordinates: geoPoint(37.1856, -5.7813),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Utrera',
    },
    {
      _id: 'location-ecija',
      _type: 'location',
      name: 'Écija',
      slug: slugValue('ecija'),
      type: 'town',
      province: ref('province-sevilla'),
      autonomousCommunity: ref('autonomousCommunity-andalucia'),
      coordinates: geoPoint(37.5435, -5.0826),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/%C3%89cija',
    },
    {
      _id: 'location-la-rinconada',
      _type: 'location',
      name: 'La Rinconada',
      slug: slugValue('la-rinconada'),
      type: 'town',
      parent: ref('location-sevilla'),
      province: ref('province-sevilla'),
      autonomousCommunity: ref('autonomousCommunity-andalucia'),
      coordinates: geoPoint(37.4872, -5.9806),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/La_Rinconada',
    },
  ],
};

const flatten = () => [
  ...docs.autonomousCommunities,
  ...docs.provinces,
  ...docs.locations,
];

async function main() {
  const allDocs = flatten();

  console.log(`Sanity dataset: ${projectId}.${dataset}`);
  console.log(`Docs a crear/asegurar (createIfNotExists): ${allDocs.length}`);
  console.log(`Modo: ${dryRun ? 'DRY RUN' : 'WRITE'}`);

  if (dryRun) {
    const summary = {
      autonomousCommunity: docs.autonomousCommunities.map((d) => d.slug.current),
      province: docs.provinces.map((d) => d.slug.current),
      location: docs.locations.map((d) => d.slug.current),
    };
    console.log('Resumen slugs:', summary);
    console.log('Para escribir en Sanity ejecuta con: --yes');
    return;
  }

  const batchSize = 40;
  for (let i = 0; i < allDocs.length; i += batchSize) {
    const batch = allDocs.slice(i, i + batchSize);
    let tx = sanity.transaction();
    batch.forEach((doc) => {
      tx = tx.createIfNotExists(doc);
    });
    await tx.commit();
    console.log(`Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allDocs.length / batchSize)} OK`);
  }

  console.log('Seed completado.');
}

main().catch((err) => {
  console.error('ERROR:', err?.message || err);
  process.exit(1);
});

