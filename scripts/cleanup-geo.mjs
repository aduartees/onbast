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

const parseArgs = (argv) => {
  const arg = (name) => {
    const hit = argv.find((a) => a === name || a.startsWith(`${name}=`));
    if (!hit) return undefined;
    const idx = hit.indexOf('=');
    return idx === -1 ? '' : hit.slice(idx + 1);
  };
  const has = (name) => argv.includes(name);
  const parseCsv = (value) =>
    String(value || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  return {
    yes: has('--yes'),
    serviceSlugs: parseCsv(arg('--service-slugs') || process.env.SERVICE_SLUGS),
    locationSlugs: parseCsv(arg('--location-slugs') || process.env.LOCATION_SLUGS),
  };
};

async function cleanup() {
  const { yes, serviceSlugs, locationSlugs } = parseArgs(process.argv.slice(2));

  const hasServiceFilter = serviceSlugs.length > 0;
  const hasLocationFilter = locationSlugs.length > 0;
  const query =
    '*[_type == "serviceLocation"'
    + (hasServiceFilter ? ' && service->slug.current in $serviceSlugs' : '')
    + (hasLocationFilter ? ' && location->slug.current in $locationSlugs' : '')
    + ']{ _id, "serviceSlug": service->slug.current, "locationSlug": location->slug.current, "serviceTitle": service->title, "locationName": location->name }';

  const docs = await client.fetch(query, {
    serviceSlugs,
    locationSlugs,
  });

  console.log(`🧹 serviceLocation candidatas: ${Array.isArray(docs) ? docs.length : 0}`);
  if (Array.isArray(docs) && docs.length) {
    docs.slice(0, 20).forEach((d) => {
      console.log(`- ${d._id} | ${d.serviceTitle} (${d.serviceSlug}) — ${d.locationName} (${d.locationSlug})`);
    });
    if (docs.length > 20) console.log(`… (+${docs.length - 20} más)`);
  }

  if (!yes) {
    console.log('ℹ️ Dry-run: usa --yes para borrar.');
    return;
  }

  if (!Array.isArray(docs) || docs.length === 0) {
    console.log('ℹ️ Nada que borrar.');
    return;
  }

  const deleteQuery =
    '*[_type == "serviceLocation"'
    + (hasServiceFilter ? ' && service->slug.current in $serviceSlugs' : '')
    + (hasLocationFilter ? ' && location->slug.current in $locationSlugs' : '')
    + ']';

  await client.delete({
    query: deleteQuery,
    params: {
      serviceSlugs,
      locationSlugs,
    },
  });

  console.log('✅ Eliminación completada.');
}

cleanup().catch((err) => {
  console.error('❌ Error:', err?.message || err);
  process.exitCode = 1;
});
