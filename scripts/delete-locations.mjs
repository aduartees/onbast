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
const includeServiceLocation = !argSet.has('--skip-service-location');
const includeAdmin = argSet.has('--include-admin');
const onlyServiceLocations = argSet.has('--only-service-locations');

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

const chunk = (items, size) => {
  const result = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
};

const uniq = (items) => Array.from(new Set(items));

async function main() {
  if (onlyServiceLocations) {
    const serviceLocationDocs = await sanity.fetch(`*[_type == "serviceLocation"]{ _id }`);
    const ids = uniq(serviceLocationDocs.map((d) => d?._id).filter(Boolean));

    console.log(`Sanity dataset: ${projectId}.${dataset}`);
    console.log(`ServiceLocation encontradas: ${ids.length}`);

    if (!ids.length) return;

    if (dryRun) {
      console.log('Modo DRY RUN. Para borrar de verdad ejecuta con: --yes');
      console.log('Opciones:');
      console.log('  --only-service-locations  Borra SOLO docs _type == "serviceLocation"');
      return;
    }

    const batches = chunk(ids, 100);
    for (let i = 0; i < batches.length; i += 1) {
      const batchIds = batches[i];
      let tx = sanity.transaction();
      batchIds.forEach((id) => {
        tx = tx.delete(id);
      });
      await tx.commit();
      console.log(`Borrado batch ${i + 1}/${batches.length} (${batchIds.length} docs)`);
    }

    console.log('Borrado completado.');
    return;
  }

  const locations = await sanity.fetch(
    `*[_type == "location"] | order(_createdAt desc) { _id, name, "slug": slug.current }`
  );

  const locationIds = locations.map((l) => l?._id).filter(Boolean);

  const docsToDelete = [];
  docsToDelete.push(...locationIds);

  let serviceLocationIds = [];
  if (includeServiceLocation && locationIds.length) {
    serviceLocationIds = await sanity.fetch(
      `*[_type == "serviceLocation" && location._ref in $locationIds]{ _id }`,
      { locationIds }
    );
    docsToDelete.push(
      ...serviceLocationIds.map((d) => d?._id).filter(Boolean)
    );
  }

  let provinceIds = [];
  let autonomousCommunityIds = [];
  if (includeAdmin) {
    const provinces = await sanity.fetch(`*[_type == "province"]{ _id }`);
    const autonomousCommunities = await sanity.fetch(`*[_type == "autonomousCommunity"]{ _id }`);
    provinceIds = provinces.map((d) => d?._id).filter(Boolean);
    autonomousCommunityIds = autonomousCommunities.map((d) => d?._id).filter(Boolean);
    docsToDelete.push(...provinceIds, ...autonomousCommunityIds);
  }

  const finalIds = uniq(docsToDelete).filter(Boolean);

  console.log(`Sanity dataset: ${projectId}.${dataset}`);
  console.log(`Locations encontradas: ${locationIds.length}`);
  if (includeServiceLocation) console.log(`ServiceLocation a borrar: ${serviceLocationIds.length}`);
  if (includeAdmin) {
    console.log(`Province a borrar: ${provinceIds.length}`);
    console.log(`AutonomousCommunity a borrar: ${autonomousCommunityIds.length}`);
  }
  console.log(`Total docs a borrar: ${finalIds.length}`);

  if (!finalIds.length) return;

  const sample = locations.slice(0, 10).map((l) => ({ _id: l._id, name: l.name, slug: l.slug }));
  console.log('Muestra (hasta 10):', sample);

  if (dryRun) {
    console.log('Modo DRY RUN. Para borrar de verdad ejecuta con: --yes');
    console.log('Opciones:');
    console.log('  --only-service-locations  Borra SOLO docs _type == "serviceLocation"');
    console.log('  --skip-service-location   No borra docs _type == "serviceLocation" relacionados');
    console.log('  --include-admin           También borra docs _type == "province" y "autonomousCommunity"');
    return;
  }

  const batches = chunk(finalIds, 100);
  for (let i = 0; i < batches.length; i += 1) {
    const ids = batches[i];
    let tx = sanity.transaction();
    ids.forEach((id) => {
      tx = tx.delete(id);
    });
    await tx.commit();
    console.log(`Borrado batch ${i + 1}/${batches.length} (${ids.length} docs)`);
  }

  console.log('Borrado completado.');
}

main().catch((err) => {
  console.error('ERROR:', err?.message || err);
  process.exit(1);
});
