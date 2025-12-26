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
    if (process.env[key] === undefined) {
      process.env[key] = value.replace(/^["']|["']$/g, '');
    }
  });
}

if (!process.env.SANITY_WRITE_TOKEN) {
  console.error('❌ ERROR: SANITY_WRITE_TOKEN no encontrada en .env.local');
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.error('❌ ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID y/o NEXT_PUBLIC_SANITY_DATASET no encontrados en .env.local');
  process.exit(1);
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

  return {
    yes: has('--yes'),
    reset: has('--reset'),
    file: arg('--file'),
    limit: arg('--limit'),
  };
};

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const slugify = (input) =>
  String(input || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const safeJsonParse = (input) => {
  const trimmed = String(input || '').trim();
  if (!trimmed.length) return null;
  return JSON.parse(trimmed);
};

const DEFAULT_PROVINCES = {
  madrid: {
    name: 'Madrid',
    slug: 'madrid',
    coordinates: { lat: 40.4168, lng: -3.7038 },
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Provincia_de_Madrid',
  },
  sevilla: {
    name: 'Sevilla',
    slug: 'sevilla',
    coordinates: { lat: 37.3891, lng: -5.9845 },
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Provincia_de_Sevilla',
  },
  malaga: {
    name: 'Málaga',
    slug: 'malaga',
    coordinates: { lat: 36.7213, lng: -4.4214 },
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Provincia_de_M%C3%A1laga',
  },
  cantabria: {
    name: 'Cantabria',
    slug: 'cantabria',
    coordinates: { lat: 43.4623, lng: -3.81 },
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Cantabria',
  },
  asturias: {
    name: 'Asturias',
    slug: 'asturias',
    coordinates: { lat: 43.3614, lng: -5.8494 },
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Asturias',
  },
};

const DEFAULT_AUTONOMOUS_COMMUNITIES = {
  'comunidad-de-madrid': {
    name: 'Comunidad de Madrid',
    slug: 'comunidad-de-madrid',
    coordinates: { lat: 40.4168, lng: -3.7038 },
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Comunidad_de_Madrid',
  },
  andalucia: {
    name: 'Andalucía',
    slug: 'andalucia',
    coordinates: { lat: 37.3891, lng: -5.9845 },
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Andaluc%C3%ADa',
  },
  cantabria: {
    name: 'Cantabria',
    slug: 'cantabria',
    coordinates: { lat: 43.4623, lng: -3.81 },
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Cantabria',
  },
  'principado-de-asturias': {
    name: 'Principado de Asturias',
    slug: 'principado-de-asturias',
    coordinates: { lat: 43.3614, lng: -5.8494 },
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Asturias',
  },
};

const defaultLocations = [
  {
    name: 'Madrid',
    type: 'city',
    coordinates: { lat: 40.4168, lng: -3.7038 },
    altitude: 667,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Madrid',
    gentilicio: 'madrileño',
    provinceSlug: 'madrid',
    autonomousCommunitySlug: 'comunidad-de-madrid',
    geoContext:
      'Capital de España y principal motor económico del país, con alta competencia en servicios digitales y empresas orientadas a crecimiento.',
  },
  {
    name: 'Sevilla',
    type: 'city',
    coordinates: { lat: 37.3891, lng: -5.9845 },
    altitude: 7,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Sevilla',
    gentilicio: 'sevillano',
    provinceSlug: 'sevilla',
    autonomousCommunitySlug: 'andalucia',
    geoContext:
      'Centro económico del sur con tejido pyme y servicios; gran potencial para escalar captación local y presencia en IA.',
  },
  {
    name: 'Málaga',
    type: 'city',
    coordinates: { lat: 36.7213, lng: -4.4214 },
    altitude: 11,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/M%C3%A1laga',
    gentilicio: 'malagueño',
    provinceSlug: 'malaga',
    autonomousCommunitySlug: 'andalucia',
    geoContext:
      'Creciente polo tecnológico y turístico; gran competencia digital y oportunidades en conversión y visibilidad geolocalizada.',
  },
  {
    name: 'Cantabria',
    type: 'city',
    coordinates: { lat: 43.4623, lng: -3.81 },
    altitude: 17,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Cantabria',
    gentilicio: 'cántabro',
    provinceSlug: 'cantabria',
    autonomousCommunitySlug: 'cantabria',
    geoContext:
      'Comunidad del norte con economía mixta (servicios, industria y comercio) y alta oportunidad en SEO local y captación en mercados regionales.',
  },
  {
    name: 'Asturias',
    type: 'city',
    coordinates: { lat: 43.3614, lng: -5.8494 },
    altitude: 231,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Asturias',
    gentilicio: 'asturiano',
    provinceSlug: 'asturias',
    autonomousCommunitySlug: 'principado-de-asturias',
    geoContext:
      'Región con fuerte presencia de servicios e industria; empresas locales compiten por visibilidad geográfica y confianza en entornos B2C y B2B.',
  },
  {
    name: 'Getafe',
    type: 'town',
    parentSlug: 'madrid',
    coordinates: { lat: 40.3083, lng: -3.7327 },
    altitude: 620,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Getafe',
    gentilicio: 'getafense',
    provinceSlug: 'madrid',
    autonomousCommunitySlug: 'comunidad-de-madrid',
    geoContext:
      'Municipio del área metropolitana de Madrid con actividad industrial y comercial; demanda de captación local y performance.',
  },
  {
    name: 'Leganés',
    type: 'town',
    parentSlug: 'madrid',
    coordinates: { lat: 40.3272, lng: -3.7635 },
    altitude: 666,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Legan%C3%A9s',
    gentilicio: 'leganense',
    provinceSlug: 'madrid',
    autonomousCommunitySlug: 'comunidad-de-madrid',
    geoContext:
      'Municipio del sur de Madrid con alta densidad de negocios locales; foco en SEO local y conversión.',
  },
  {
    name: 'Alcorcón',
    type: 'town',
    parentSlug: 'madrid',
    coordinates: { lat: 40.3459, lng: -3.8249 },
    altitude: 718,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Alcorc%C3%B3n',
    gentilicio: 'alcorconero',
    provinceSlug: 'madrid',
    autonomousCommunitySlug: 'comunidad-de-madrid',
    geoContext:
      'Municipio del área metropolitana con tejido pyme y comercio; oportunidad en posicionamiento local y mejora de conversión web.',
  },
  {
    name: 'Móstoles',
    type: 'town',
    parentSlug: 'madrid',
    coordinates: { lat: 40.3223, lng: -3.865 },
    altitude: 660,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/M%C3%B3stoles',
    gentilicio: 'mostoleño',
    provinceSlug: 'madrid',
    autonomousCommunitySlug: 'comunidad-de-madrid',
    geoContext:
      'Zona con alta densidad residencial y empresarial; importancia de visibilidad local, reputación y webs rápidas orientadas a leads.',
  },
  {
    name: 'Osuna',
    type: 'town',
    parentSlug: 'sevilla',
    coordinates: { lat: 37.2376, lng: -5.1031 },
    altitude: 335,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Osuna',
    gentilicio: 'osunense',
    provinceSlug: 'sevilla',
    autonomousCommunitySlug: 'andalucia',
    geoContext:
      'Municipio con actividad de servicios y comercio local; estrategia de captación orgánica y presencia en IA para demanda cercana.',
  },
  {
    name: 'Écija',
    type: 'town',
    parentSlug: 'sevilla',
    coordinates: { lat: 37.5422, lng: -5.0826 },
    altitude: 111,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/%C3%89cija',
    gentilicio: 'ecijano',
    provinceSlug: 'sevilla',
    autonomousCommunitySlug: 'andalucia',
    geoContext:
      'Municipio con tejido comercial y servicios; oportunidad en SEO local y optimización técnica para competir en búsquedas regionales.',
  },
  {
    name: 'Utrera',
    type: 'town',
    parentSlug: 'sevilla',
    coordinates: { lat: 37.185, lng: -5.7809 },
    altitude: 41,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Utrera',
    gentilicio: 'utrerano',
    provinceSlug: 'sevilla',
    autonomousCommunitySlug: 'andalucia',
    geoContext:
      'Municipio con economía local diversificada; demanda de visibilidad y conversión para empresas de servicios y comercios.',
  },
  {
    name: 'Carmona',
    type: 'town',
    parentSlug: 'sevilla',
    coordinates: { lat: 37.4711, lng: -5.6467 },
    altitude: 235,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Carmona',
    gentilicio: 'carmonense',
    provinceSlug: 'sevilla',
    autonomousCommunitySlug: 'andalucia',
    geoContext:
      'Municipio con actividad empresarial y turística; relevancia de SEO local, reputación y performance web.',
  },
  {
    name: 'Santander',
    type: 'town',
    parentSlug: 'cantabria',
    coordinates: { lat: 43.4623, lng: -3.81 },
    altitude: 17,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Santander',
    gentilicio: 'santanderino',
    provinceSlug: 'cantabria',
    autonomousCommunitySlug: 'cantabria',
    geoContext:
      'Capital regional con fuerte presencia de servicios; mercado competitivo en captación y posicionamiento local.',
  },
  {
    name: 'Torrelavega',
    type: 'town',
    parentSlug: 'cantabria',
    coordinates: { lat: 43.3494, lng: -4.047 },
    altitude: 35,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Torrelavega',
    gentilicio: 'torrelaveguense',
    provinceSlug: 'cantabria',
    autonomousCommunitySlug: 'cantabria',
    geoContext:
      'Núcleo industrial y comercial; foco en captación de demanda local y SEO técnico para leads cualificados.',
  },
  {
    name: 'Castro Urdiales',
    type: 'town',
    parentSlug: 'cantabria',
    coordinates: { lat: 43.3828, lng: -3.215 },
    altitude: 8,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Castro-Urdiales',
    gentilicio: 'castreño',
    provinceSlug: 'cantabria',
    autonomousCommunitySlug: 'cantabria',
    geoContext:
      'Municipio con servicios y actividad comercial; oportunidad en visibilidad geolocalizada y reputación digital.',
  },
  {
    name: 'Reinosa',
    type: 'town',
    parentSlug: 'cantabria',
    coordinates: { lat: 43.0007, lng: -4.1388 },
    altitude: 851,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Reinosa',
    gentilicio: 'reinoseño',
    provinceSlug: 'cantabria',
    autonomousCommunitySlug: 'cantabria',
    geoContext:
      'Municipio con actividad regional y servicios; estrategia local para captación orgánica y mejora de presencia en IA.',
  },
  {
    name: 'Oviedo',
    type: 'town',
    parentSlug: 'asturias',
    coordinates: { lat: 43.3614, lng: -5.8494 },
    altitude: 231,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Oviedo',
    gentilicio: 'ovetense',
    provinceSlug: 'asturias',
    autonomousCommunitySlug: 'principado-de-asturias',
    geoContext:
      'Capital regional con servicios profesionales y empresas locales; competitividad alta en búsquedas locales y conversión.',
  },
  {
    name: 'Gijón',
    type: 'town',
    parentSlug: 'asturias',
    coordinates: { lat: 43.5322, lng: -5.6611 },
    altitude: 3,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Gij%C3%B3n',
    gentilicio: 'gijonés',
    provinceSlug: 'asturias',
    autonomousCommunitySlug: 'principado-de-asturias',
    geoContext:
      'Ciudad costera con industria y servicios; oportunidad en captación local y posicionamiento orgánico de alto rendimiento.',
  },
  {
    name: 'Avilés',
    type: 'town',
    parentSlug: 'asturias',
    coordinates: { lat: 43.5563, lng: -5.9248 },
    altitude: 5,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Avil%C3%A9s',
    gentilicio: 'avilesino',
    provinceSlug: 'asturias',
    autonomousCommunitySlug: 'principado-de-asturias',
    geoContext:
      'Área industrial y de servicios; demanda de SEO local y optimización técnica orientada a leads y reputación.',
  },
  {
    name: 'Langreo',
    type: 'town',
    parentSlug: 'asturias',
    coordinates: { lat: 43.2964, lng: -5.682 },
    altitude: 200,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Langreo',
    gentilicio: 'langreano',
    provinceSlug: 'asturias',
    autonomousCommunitySlug: 'principado-de-asturias',
    geoContext:
      'Concejo con tejido empresarial local; enfoque en captación geolocalizada y performance web.',
  },
  {
    name: 'Marbella',
    type: 'town',
    parentSlug: 'malaga',
    coordinates: { lat: 36.5099, lng: -4.8864 },
    altitude: 27,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Marbella',
    gentilicio: 'marbellí',
    provinceSlug: 'malaga',
    autonomousCommunitySlug: 'andalucia',
    geoContext:
      'Zona con alta concentración de servicios y turismo premium; exige performance web, marca y SEO local competitivo.',
  },
  {
    name: 'Fuengirola',
    type: 'town',
    parentSlug: 'malaga',
    coordinates: { lat: 36.539, lng: -4.6244 },
    altitude: 4,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Fuengirola',
    gentilicio: 'fuengiroleño',
    provinceSlug: 'malaga',
    autonomousCommunitySlug: 'andalucia',
    geoContext:
      'Municipio turístico con comercio y servicios; alta demanda estacional y necesidad de captación local constante.',
  },
  {
    name: 'Estepona',
    type: 'town',
    parentSlug: 'malaga',
    coordinates: { lat: 36.4268, lng: -5.1459 },
    altitude: 15,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Estepona',
    gentilicio: 'esteponero',
    provinceSlug: 'malaga',
    autonomousCommunitySlug: 'andalucia',
    geoContext:
      'Municipio en crecimiento con servicios y construcción; oportunidad en SEO local y conversión orientada a leads.',
  },
  {
    name: 'Benalmádena',
    type: 'town',
    parentSlug: 'malaga',
    coordinates: { lat: 36.598, lng: -4.516 },
    altitude: 280,
    wikipediaUrl: 'https://es.wikipedia.org/wiki/Benalm%C3%A1dena',
    gentilicio: 'benalmadense',
    provinceSlug: 'malaga',
    autonomousCommunitySlug: 'andalucia',
    geoContext:
      'Municipio con turismo y servicios; relevancia de visibilidad geolocalizada, reputación y velocidad web.',
  },
];

async function seed() {
  const { yes, reset, file, limit } = parseArgs(process.argv.slice(2));

  let locations = defaultLocations;
  if (typeof file === 'string' && file.trim().length) {
    const abs = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file);
    if (!fs.existsSync(abs)) {
      throw new Error(`No existe el fichero: ${abs}`);
    }
    const raw = fs.readFileSync(abs, 'utf8');
    const parsed = safeJsonParse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('El fichero debe ser un JSON Array de objetos de ubicación.');
    }
    locations = parsed;
  }

  const coerceNumber = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim().length) {
      const n = Number(value.trim());
      if (Number.isFinite(n)) return n;
    }
    return undefined;
  };

  const coerceCoordinates = (input) => {
    if (!input || typeof input !== 'object') return undefined;
    const lat = coerceNumber(input.lat);
    const lng = coerceNumber(input.lng);
    if (typeof lat !== 'number' || typeof lng !== 'number') return undefined;
    return { lat, lng };
  };

  const coerceUrl = (value) => {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    if (!trimmed.length) return undefined;
    return trimmed;
  };

  const normalized = (Array.isArray(locations) ? locations : [])
    .map((l) => {
      const name = typeof l?.name === 'string' ? l.name.trim() : '';
      const type = l?.type === 'town' ? 'town' : 'city';
      const slug = typeof l?.slug === 'string' && l.slug.trim().length ? l.slug.trim() : slugify(name);
      const geoContext = typeof l?.geoContext === 'string' ? l.geoContext.trim() : '';
      const parentSlug = typeof l?.parentSlug === 'string' ? l.parentSlug.trim() : undefined;

      const coordinates = coerceCoordinates(l?.coordinates) || (typeof l?.lat !== 'undefined' && typeof l?.lng !== 'undefined'
        ? coerceCoordinates({ lat: l.lat, lng: l.lng })
        : undefined);
      const altitude = coerceNumber(l?.altitude);

      const wikipediaUrl = coerceUrl(l?.wikipediaUrl);
      const gentilicio = typeof l?.gentilicio === 'string' && l.gentilicio.trim().length ? l.gentilicio.trim() : undefined;

      const provinceSlug =
        (typeof l?.provinceSlug === 'string' && l.provinceSlug.trim().length ? l.provinceSlug.trim() : undefined) ||
        (typeof l?.province?.slug === 'string' && l.province.slug.trim().length ? l.province.slug.trim() : undefined) ||
        (typeof l?.provinceName === 'string' && l.provinceName.trim().length ? slugify(l.provinceName) : undefined) ||
        (typeof l?.province?.name === 'string' && l.province.name.trim().length ? slugify(l.province.name) : undefined);

      const provinceName =
        (typeof l?.provinceName === 'string' && l.provinceName.trim().length ? l.provinceName.trim() : undefined) ||
        (typeof l?.province?.name === 'string' && l.province.name.trim().length ? l.province.name.trim() : undefined);

      const provinceWikipediaUrl =
        coerceUrl(l?.provinceWikipediaUrl) ||
        coerceUrl(l?.province?.wikipediaUrl);

      const provinceCoordinates = coerceCoordinates(l?.provinceCoordinates) || coerceCoordinates(l?.province?.coordinates);

      const autonomousCommunitySlug =
        (typeof l?.autonomousCommunitySlug === 'string' && l.autonomousCommunitySlug.trim().length
          ? l.autonomousCommunitySlug.trim()
          : undefined) ||
        (typeof l?.autonomousCommunity?.slug === 'string' && l.autonomousCommunity.slug.trim().length
          ? l.autonomousCommunity.slug.trim()
          : undefined) ||
        (typeof l?.autonomousCommunityName === 'string' && l.autonomousCommunityName.trim().length
          ? slugify(l.autonomousCommunityName)
          : undefined) ||
        (typeof l?.autonomousCommunity?.name === 'string' && l.autonomousCommunity.name.trim().length
          ? slugify(l.autonomousCommunity.name)
          : undefined);

      const autonomousCommunityName =
        (typeof l?.autonomousCommunityName === 'string' && l.autonomousCommunityName.trim().length
          ? l.autonomousCommunityName.trim()
          : undefined) ||
        (typeof l?.autonomousCommunity?.name === 'string' && l.autonomousCommunity.name.trim().length
          ? l.autonomousCommunity.name.trim()
          : undefined);

      const autonomousCommunityWikipediaUrl =
        coerceUrl(l?.autonomousCommunityWikipediaUrl) ||
        coerceUrl(l?.autonomousCommunity?.wikipediaUrl);

      const autonomousCommunityCoordinates =
        coerceCoordinates(l?.autonomousCommunityCoordinates) || coerceCoordinates(l?.autonomousCommunity?.coordinates);

      if (!name.length || !slug.length) return null;
      return {
        name,
        type,
        slug,
        geoContext: geoContext.length ? geoContext : undefined,
        parentSlug,
        coordinates,
        altitude,
        wikipediaUrl,
        gentilicio,
        provinceSlug,
        provinceName,
        provinceWikipediaUrl,
        provinceCoordinates,
        autonomousCommunitySlug,
        autonomousCommunityName,
        autonomousCommunityWikipediaUrl,
        autonomousCommunityCoordinates,
      };
    })
    .filter(Boolean);

  const normalizedBySlug = new Map(normalized.map((l) => [l.slug, l]));
  normalized.forEach((l) => {
    if (l.type !== 'town' || !l.parentSlug) return;
    const parent = normalizedBySlug.get(l.parentSlug);
    if (!parent) return;
    if (!l.provinceSlug && parent.provinceSlug) l.provinceSlug = parent.provinceSlug;
    if (!l.autonomousCommunitySlug && parent.autonomousCommunitySlug) l.autonomousCommunitySlug = parent.autonomousCommunitySlug;
    if (!l.coordinates && parent.coordinates) l.coordinates = parent.coordinates;
  });

  const limited = Number.isFinite(Number(limit)) && Number(limit) > 0 ? normalized.slice(0, Number(limit)) : normalized;

  if (!limited.length) {
    console.log('ℹ️ No hay ubicaciones para sembrar.');
    return;
  }

  console.log(`📍 Ubicaciones a sembrar: ${limited.length}${file ? ` (source: ${file})` : ' (source: default)'}`);

const fetchIdBySlug = async (slugs) => {
  if (!Array.isArray(slugs) || slugs.length === 0) return new Map();
  const existing = await client.fetch(
      `*[_type == "location" && defined(slug.current) && slug.current in $slugs]{ _id, "slug": slug.current }`,
      { slugs }
    );
  return new Map(
      Array.isArray(existing)
        ? existing
            .filter((d) => typeof d?.slug === 'string' && typeof d?._id === 'string')
            .map((d) => [d.slug, d._id])
        : []
    );
  };

  const titleFromSlug = (slug) =>
    String(slug || '')
      .split('-')
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');

  const toGeoPoint = (coords) => {
    if (!coords || typeof coords !== 'object') return undefined;
    const { lat, lng } = coords;
    if (typeof lat !== 'number' || typeof lng !== 'number') return undefined;
    return { _type: 'geopoint', lat, lng };
  };

  const fetchIdsBySlugForType = async (typeName, slugs) => {
    if (!Array.isArray(slugs) || slugs.length === 0) return new Map();
    const existing = await client.fetch(
      `*[_type == $typeName && defined(slug.current) && slug.current in $slugs]{ _id, "slug": slug.current }`,
      { typeName, slugs }
    );
    return new Map(
      Array.isArray(existing)
        ? existing
            .filter((d) => typeof d?.slug === 'string' && typeof d?._id === 'string')
            .map((d) => [d.slug, d._id])
        : []
    );
  };

  const upsertDocsBySlug = async (typeName, defs) => {
    const slugs = Array.from(defs.keys());
    const existingBySlug = await fetchIdsBySlugForType(typeName, slugs);

    const ops = slugs.map((slug) => {
      const def = defs.get(slug);
      if (!def) return null;
      const doc = {
        _type: typeName,
        name: def.name,
        slug: { _type: 'slug', current: def.slug },
        ...(def.wikipediaUrl ? { wikipediaUrl: def.wikipediaUrl } : {}),
        ...(def.coordinates ? { coordinates: toGeoPoint(def.coordinates) } : {}),
      };
      const existingId = existingBySlug.get(slug);
      return existingId ? { type: 'patch', id: existingId, doc } : { type: 'create', doc };
    }).filter(Boolean);

    let created = 0;
    let updated = 0;
    for (const group of chunk(ops, 50)) {
      let tx = client.transaction();
      group.forEach((o) => {
        if (o.type === 'create') {
          tx = tx.create(o.doc);
          created += 1;
        } else {
          tx = tx.patch(o.id, (p) => p.set(o.doc));
          updated += 1;
        }
      });
      await tx.commit();
    }

    const refreshedBySlug = await fetchIdsBySlugForType(typeName, slugs);
    return { created, updated, idBySlug: refreshedBySlug };
  };

  const fetchLocationDeleteGraph = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return [];
    const rows = await client.fetch(
      `*[_type == "location" && _id in $ids]{ _id, type, "parentId": parent._ref }`,
      { ids }
    );
    return Array.isArray(rows) ? rows : [];
  };

  const fetchChildLocationIds = async (parentIds) => {
    if (!Array.isArray(parentIds) || parentIds.length === 0) return [];
    const rows = await client.fetch(
      `*[_type == "location" && parent._ref in $parentIds]{ _id }`,
      { parentIds }
    );
    return Array.isArray(rows) ? rows.map((r) => r?._id).filter((id) => typeof id === 'string') : [];
  };

  const collectCascadeLocationIds = async (seedIds) => {
    const out = new Set((Array.isArray(seedIds) ? seedIds : []).filter((id) => typeof id === 'string'));
    let frontier = Array.from(out);
    while (frontier.length) {
      const next = [];
      for (const group of chunk(frontier, 200)) {
        const children = await fetchChildLocationIds(group);
        children.forEach((id) => {
          if (!out.has(id)) {
            out.add(id);
            next.push(id);
          }
        });
      }
      frontier = next;
    }
    return Array.from(out);
  };

  const deleteServiceLocationsByLocationIds = async (locationIds) => {
    if (!Array.isArray(locationIds) || locationIds.length === 0) return 0;
    let deleted = 0;
    for (const group of chunk(locationIds, 200)) {
      await client.delete({
        query: '*[_type == "serviceLocation" && location._ref in $ids]',
        params: { ids: group },
      });
      deleted += 1;
    }
    return deleted;
  };

  const unlinkNearbyLocationRefs = async (locationIds) => {
    if (!Array.isArray(locationIds) || locationIds.length === 0) return 0;

    const refDocs = await client.fetch(
      `*[_type == "location" && count(nearbyLocations[@._ref in $ids]) > 0]{ _id, "refs": nearbyLocations[@._ref in $ids]._ref }`,
      { ids: locationIds }
    );

    const list = Array.isArray(refDocs) ? refDocs : [];
    let patched = 0;
    for (const d of list) {
      const refs = Array.isArray(d?.refs)
        ? d.refs.filter((r) => typeof r === 'string' && r.length)
        : [];
      if (!refs.length || typeof d?._id !== 'string') continue;
      const unsets = refs.map((ref) => `nearbyLocations[_ref=="${ref}"]`);
      for (const group of chunk(unsets, 50)) {
        await client.patch(d._id).unset(group).commit();
      }
      patched += 1;
    }
    return patched;
  };

  const assertNoExternalReferences = async (locationIds) => {
    if (!Array.isArray(locationIds) || locationIds.length === 0) return;
    const refs = await client.fetch(
      `*[_id != null && references($ids) && !(_id in $ids) && _type != "serviceLocation"]{ _id, _type }`,
      { ids: locationIds }
    );
    const list = Array.isArray(refs) ? refs : [];
    if (list.length) {
      const sample = list
        .slice(0, 20)
        .map((d) => `${d?._type}:${d?._id}`)
        .filter(Boolean)
        .join(', ');
      throw new Error(
        `No se pueden borrar ubicaciones: hay referencias externas (${list.length}). Ejemplos: ${sample}`
      );
    }
  };

  const deleteLocationsInDepthOrder = async (locationIds) => {
    const graph = await fetchLocationDeleteGraph(locationIds);
    const byId = new Map(graph.map((n) => [n._id, n]));
    const memo = new Map();

    const depthOf = (id) => {
      if (memo.has(id)) return memo.get(id);
      const node = byId.get(id);
      const parentId = node?.parentId;
      const d = parentId && byId.has(parentId) ? depthOf(parentId) + 1 : 0;
      memo.set(id, d);
      return d;
    };

    const ids = Array.from(byId.keys());
    const depthGroups = new Map();
    ids.forEach((id) => {
      const d = depthOf(id);
      const arr = depthGroups.get(d) || [];
      arr.push(id);
      depthGroups.set(d, arr);
    });

    const depths = Array.from(depthGroups.keys()).sort((a, b) => b - a);
    let deleted = 0;

    for (const d of depths) {
      const groupIds = depthGroups.get(d) || [];
      for (const group of chunk(groupIds, 50)) {
        let tx = client.transaction();
        group.forEach((id) => {
          tx = tx.delete(id);
          deleted += 1;
        });
        await tx.commit();
      }
    }

    return deleted;
  };

  const slugs = Array.from(new Set(limited.map((l) => l.slug)));
  let existingBySlug = await fetchIdBySlug(slugs);

  if (reset) {
    const rootCitySlugs = limited.filter((l) => l.type === 'city').map((l) => l.slug);
    const townParentSlugs = limited
      .filter((l) => l.type === 'town')
      .map((l) => l.parentSlug)
      .filter((s) => typeof s === 'string' && s.length);
    const rootSlugs = Array.from(new Set([...rootCitySlugs, ...townParentSlugs]));

    const rootIds = Array.from((await fetchIdBySlug(rootSlugs)).values());
    const cascadeIds = await collectCascadeLocationIds(rootIds);
    const idsToDelete = Array.from(new Set([...Array.from(existingBySlug.values()), ...cascadeIds]));

    console.log(`⚠️ Reset activado: borrará ${idsToDelete.length} ubicaciones (incluye dependencias).`);
    if (!yes) {
      console.log('ℹ️ Dry-run: añade --yes para ejecutar.');
      return;
    }

    await deleteServiceLocationsByLocationIds(idsToDelete);
    await unlinkNearbyLocationRefs(idsToDelete);
    await assertNoExternalReferences(idsToDelete);
    await deleteLocationsInDepthOrder(idsToDelete);

    console.log('✅ Reset completado.');
    existingBySlug = new Map();
  }

  const provinceDefBySlug = new Map();
  const autonomousCommunityDefBySlug = new Map();

  for (const l of limited) {
    if (typeof l?.provinceSlug === 'string' && l.provinceSlug.length) {
      const base = DEFAULT_PROVINCES[l.provinceSlug] || {};
      const prev = provinceDefBySlug.get(l.provinceSlug) || {};
      provinceDefBySlug.set(l.provinceSlug, {
        slug: l.provinceSlug,
        name: l.provinceName || prev.name || base.name || titleFromSlug(l.provinceSlug),
        wikipediaUrl: l.provinceWikipediaUrl || prev.wikipediaUrl || base.wikipediaUrl,
        coordinates: l.provinceCoordinates || prev.coordinates || base.coordinates,
      });
    }

    if (typeof l?.autonomousCommunitySlug === 'string' && l.autonomousCommunitySlug.length) {
      const base = DEFAULT_AUTONOMOUS_COMMUNITIES[l.autonomousCommunitySlug] || {};
      const prev = autonomousCommunityDefBySlug.get(l.autonomousCommunitySlug) || {};
      autonomousCommunityDefBySlug.set(l.autonomousCommunitySlug, {
        slug: l.autonomousCommunitySlug,
        name:
          l.autonomousCommunityName || prev.name || base.name || titleFromSlug(l.autonomousCommunitySlug),
        wikipediaUrl: l.autonomousCommunityWikipediaUrl || prev.wikipediaUrl || base.wikipediaUrl,
        coordinates: l.autonomousCommunityCoordinates || prev.coordinates || base.coordinates,
      });
    }
  }

  const provinceSlugs = Array.from(provinceDefBySlug.keys());
  const autonomousCommunitySlugs = Array.from(autonomousCommunityDefBySlug.keys());

  const existingProvinceBySlug = await fetchIdsBySlugForType('province', provinceSlugs);
  const existingAutonomousCommunityBySlug = await fetchIdsBySlugForType('autonomousCommunity', autonomousCommunitySlugs);

  const provinceCreates = provinceSlugs.filter((s) => !existingProvinceBySlug.get(s)).length;
  const provincePatches = provinceSlugs.length - provinceCreates;
  const autonomousCommunityCreates = autonomousCommunitySlugs.filter((s) => !existingAutonomousCommunityBySlug.get(s)).length;
  const autonomousCommunityPatches = autonomousCommunitySlugs.length - autonomousCommunityCreates;

  const locationCreates = limited.filter((l) => !existingBySlug.get(l.slug)).length;
  const locationPatches = limited.length - locationCreates;

  console.log(
    `🧾 Operaciones (estimación): `
      + `${provinceCreates} province creates, ${provincePatches} province patches | `
      + `${autonomousCommunityCreates} CCAA creates, ${autonomousCommunityPatches} CCAA patches | `
      + `${locationCreates} location creates, ${locationPatches} location patches`
  );

  if (!yes) {
    console.log('ℹ️ Dry-run: añade --yes para ejecutar.');
    return;
  }

  const provinceUpsert = await upsertDocsBySlug('province', provinceDefBySlug);
  const autonomousCommunityUpsert = await upsertDocsBySlug('autonomousCommunity', autonomousCommunityDefBySlug);

  const provinceIdBySlug = provinceUpsert.idBySlug;
  const autonomousCommunityIdBySlug = autonomousCommunityUpsert.idBySlug;

  const buildDoc = (l, parentRef) => ({
    _type: 'location',
    name: l.name,
    slug: { _type: 'slug', current: l.slug },
    type: l.type,
    ...(l.coordinates ? { coordinates: toGeoPoint(l.coordinates) } : {}),
    ...(typeof l.altitude === 'number' ? { altitude: l.altitude } : {}),
    ...(l.wikipediaUrl ? { wikipediaUrl: l.wikipediaUrl } : {}),
    ...(l.gentilicio ? { gentilicio: l.gentilicio } : {}),
    ...(l.geoContext ? { geoContext: l.geoContext } : {}),
    ...(l.provinceSlug && provinceIdBySlug.get(l.provinceSlug)
      ? { province: { _type: 'reference', _ref: provinceIdBySlug.get(l.provinceSlug) } }
      : {}),
    ...(l.autonomousCommunitySlug && autonomousCommunityIdBySlug.get(l.autonomousCommunitySlug)
      ? { autonomousCommunity: { _type: 'reference', _ref: autonomousCommunityIdBySlug.get(l.autonomousCommunitySlug) } }
      : {}),
    ...(parentRef ? { parent: parentRef } : {}),
  });

  const buildOps = (items, idBySlug, parentIdBySlug) =>
    items.map((l) => {
      const parentId = l.type === 'town' && l.parentSlug ? parentIdBySlug?.get(l.parentSlug) : undefined;
      if (l.type === 'town' && l.parentSlug && !parentId) {
        throw new Error(`No se pudo resolver parentSlug "${l.parentSlug}" para "${l.slug}".`);
      }

      const doc = buildDoc(
        l,
        parentId ? { _type: 'reference', _ref: parentId } : undefined
      );

      const existingId = idBySlug.get(l.slug);
      return existingId ? { type: 'patch', id: existingId, doc } : { type: 'create', doc };
    });

  const commitOps = async (ops) => {
    let created = 0;
    let updated = 0;
    for (const group of chunk(ops, 50)) {
      let tx = client.transaction();
      group.forEach((o) => {
        if (o.type === 'create') {
          tx = tx.create(o.doc);
          created += 1;
        } else {
          tx = tx.patch(o.id, (p) => p.set(o.doc));
          updated += 1;
        }
      });
      await tx.commit();
    }
    return { created, updated };
  };

  const cityItems = limited.filter((l) => l.type === 'city');
  const townItems = limited.filter((l) => l.type === 'town');

  const cityOps = buildOps(cityItems, existingBySlug, new Map());
  const townSlugs = Array.from(
    new Set(townItems.map((l) => l.parentSlug).filter((s) => typeof s === 'string' && s.length > 0))
  );

  const cityResult = await commitOps(cityOps);

  const updatedIdBySlug = await fetchIdBySlug(Array.from(new Set([...slugs, ...townSlugs])));
  const townParentIdBySlug = updatedIdBySlug;

  const townOps = buildOps(townItems, updatedIdBySlug, townParentIdBySlug);
  const townResult = await commitOps(townOps);

  console.log(
    `✅ Seed completado. Creadas: ${cityResult.created + townResult.created} | Actualizadas: ${cityResult.updated + townResult.updated}`
  );
}

seed().catch((err) => {
  console.error('❌ Error:', err?.message || err);
  process.exitCode = 1;
});
