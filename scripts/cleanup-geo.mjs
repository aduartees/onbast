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
    mode: String(arg('--mode') || process.env.GEO_CLEANUP_MODE || 'delete').trim().toLowerCase(),
    serviceSlugs: parseCsv(arg('--service-slugs') || process.env.SERVICE_SLUGS),
    locationSlugs: parseCsv(arg('--location-slugs') || process.env.LOCATION_SLUGS),
  };
};

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const collectNonArrayObjectKeyPaths = (value, path = '', isArrayItemObject = false, out = new Set()) => {
  if (!value || typeof value !== 'object') return out;

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const base = path || '';
      const hasStableKey = isPlainObject(item) && typeof item._key === 'string' && item._key.length;
      const nextPath = hasStableKey ? `${base}[_key=="${item._key}"]` : `${base}[${index}]`;
      collectNonArrayObjectKeyPaths(item, nextPath, true, out);
    });
    return out;
  }

  if (!isArrayItemObject && Object.prototype.hasOwnProperty.call(value, '_key')) {
    out.add(path ? `${path}._key` : '_key');
  }

  Object.keys(value).forEach((k) => {
    collectNonArrayObjectKeyPaths(value[k], path ? `${path}.${k}` : k, false, out);
  });

  return out;
};

async function cleanup() {
  const { yes, mode, serviceSlugs, locationSlugs } = parseArgs(process.argv.slice(2));

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
    console.log(`ℹ️ Dry-run: usa --yes para ejecutar (modo: ${mode}).`);
    return;
  }

  if (!Array.isArray(docs) || docs.length === 0) {
    console.log('ℹ️ Nada que borrar.');
    return;
  }

  if (mode === 'strip') {
    const allowedRootFields = new Set([
      'service',
      'location',
      'seoTitle',
      'seoDescription',
      'heroHeadline',
      'heroText',
      'heroButtonText',
      'heroButtonLink',
      'heroSecondaryButtonText',
      'heroSecondaryButtonLink',
      'longDescription',
      'overviewText',
      'featuresTitle',
      'featuresHighlight',
      'featuresDescription',
      'benefits',
      'processTitle',
      'processHighlight',
      'processDescription',
      'techTitle',
      'techHighlight',
      'techDescription',
      'technologies',
      'impactSection',
      'pricingTitle',
      'pricingSubtitle',
      'pricingTrustedCompaniesTitle',
      'pricingSchemaAdditionalProperty',
      'teamTitle',
      'teamHighlight',
      'teamDescription',
      'testimonialsTitle',
      'testimonialsHighlight',
      'testimonialsDescription',
      'relatedProjectsTitle',
      'relatedProjectsHighlight',
      'relatedProjectsDescription',
      'faqTitle',
      'faqHighlight',
      'faqDescription',
      'localContentBlock',
      'customFeatures',
      'customProcess',
      'customFaqs',
      'customTestimonials',
      'customProjects',
      'ctaSection',
    ]);

    let patched = 0;
    for (const d of docs) {
      const doc = await client.getDocument(d._id);
      if (!doc) continue;

      const rootUnknown = Object.keys(doc)
        .filter((k) => {
          if (k === '_key') return true;
          if (k.startsWith('_')) return false;
          return !allowedRootFields.has(k);
        })
        .map((k) => k);

      const nonArrayKeyPaths = Array.from(collectNonArrayObjectKeyPaths(doc));
      const unsetPaths = Array.from(new Set([...rootUnknown, ...nonArrayKeyPaths])).filter(Boolean);

      if (unsetPaths.length === 0) continue;

      console.log(`🧽 Limpiando: ${d._id} (${unsetPaths.length} unsets)`);

      for (const group of chunk(unsetPaths, 50)) {
        await client.patch(d._id).unset(group).commit();
      }
      patched += 1;
    }

    console.log(`✅ Limpieza completada. Documentos parchados: ${patched}`);
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
