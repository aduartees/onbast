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
const purge = argSet.has('--purge');

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
      _id: 'autonomousCommunity-principado-de-asturias',
      _type: 'autonomousCommunity',
      name: 'Principado de Asturias',
      slug: slugValue('principado-de-asturias'),
      coordinates: geoPoint(43.3619, -5.8494),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Asturias',
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
      _id: 'province-asturias',
      _type: 'province',
      name: 'Asturias',
      slug: slugValue('asturias'),
      coordinates: geoPoint(43.3619, -5.8494),
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Asturias',
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
      _id: 'location-cantabria',
      _type: 'location',
      name: 'Cantabria',
      slug: slugValue('cantabria'),
      type: 'city',
      province: ref('province-cantabria'),
      autonomousCommunity: ref('autonomousCommunity-cantabria'),
      population: 585000,
      gentilicio: 'Cántabros',
      geoContext: 'Cantabria concentra actividad turística y servicios en la costa y un tejido industrial relevante en su eje central.',
      coordinates: geoPoint(43.1828, -3.9878),
      altitude: 15,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Cantabria',
      nearbyLocations: [ref('location-santander'), ref('location-torrelavega'), ref('location-castro-urdiales'), ref('location-reinosa')],
    },
    {
      _id: 'location-santander',
      _type: 'location',
      name: 'Santander',
      slug: slugValue('santander'),
      type: 'town',
      parent: ref('location-cantabria'),
      province: ref('province-cantabria'),
      autonomousCommunity: ref('autonomousCommunity-cantabria'),
      population: 172000,
      gentilicio: 'Santanderinos',
      geoContext: 'Santander es un hub de servicios, administración y economía costera con alta competencia digital local.',
      coordinates: geoPoint(43.4623, -3.80998),
      altitude: 15,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Santander',
      nearbyLocations: [ref('location-cantabria'), ref('location-torrelavega'), ref('location-castro-urdiales'), ref('location-reinosa')],
    },
    {
      _id: 'location-torrelavega',
      _type: 'location',
      name: 'Torrelavega',
      slug: slugValue('torrelavega'),
      type: 'town',
      parent: ref('location-cantabria'),
      province: ref('province-cantabria'),
      autonomousCommunity: ref('autonomousCommunity-cantabria'),
      population: 51000,
      gentilicio: 'Torrelaveguenses',
      geoContext: 'Torrelavega combina comercio local e industria, con demanda de captación digital en el área central de Cantabria.',
      coordinates: geoPoint(43.3516, -4.0470),
      altitude: 25,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Torrelavega',
      nearbyLocations: [ref('location-cantabria'), ref('location-santander'), ref('location-castro-urdiales'), ref('location-reinosa')],
    },
    {
      _id: 'location-castro-urdiales',
      _type: 'location',
      name: 'Castro Urdiales',
      slug: slugValue('castro-urdiales'),
      type: 'town',
      parent: ref('location-cantabria'),
      province: ref('province-cantabria'),
      autonomousCommunity: ref('autonomousCommunity-cantabria'),
      population: 32000,
      gentilicio: 'Castrenses',
      geoContext: 'Castro Urdiales tiene economía de servicios y turismo, con influencia del área metropolitana de Bilbao.',
      coordinates: geoPoint(43.3828, -3.2196),
      altitude: 10,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Castro-Urdiales',
      nearbyLocations: [ref('location-cantabria'), ref('location-santander'), ref('location-torrelavega'), ref('location-reinosa')],
    },
    {
      _id: 'location-reinosa',
      _type: 'location',
      name: 'Reinosa',
      slug: slugValue('reinosa'),
      type: 'town',
      parent: ref('location-cantabria'),
      province: ref('province-cantabria'),
      autonomousCommunity: ref('autonomousCommunity-cantabria'),
      population: 9000,
      gentilicio: 'Reinosanos',
      geoContext: 'Reinosa vertebra actividad comarcal en Campoo, con empresas industriales y servicios locales.',
      coordinates: geoPoint(43.0014, -4.1391),
      altitude: 850,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Reinosa',
      nearbyLocations: [ref('location-cantabria'), ref('location-santander'), ref('location-torrelavega'), ref('location-castro-urdiales')],
    },

    {
      _id: 'location-asturias',
      _type: 'location',
      name: 'Asturias',
      slug: slugValue('asturias'),
      type: 'city',
      province: ref('province-asturias'),
      autonomousCommunity: ref('autonomousCommunity-principado-de-asturias'),
      population: 1000000,
      gentilicio: 'Asturianos',
      geoContext: 'Asturias combina industria, servicios y turismo, con un mercado digital distribuido en varias ciudades medias.',
      coordinates: geoPoint(43.3619, -5.8494),
      altitude: 250,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Asturias',
      nearbyLocations: [],
    },

    {
      _id: 'location-madrid',
      _type: 'location',
      name: 'Madrid',
      slug: slugValue('madrid'),
      type: 'city',
      province: ref('province-madrid'),
      autonomousCommunity: ref('autonomousCommunity-comunidad-de-madrid'),
      population: 3223000,
      gentilicio: 'Madrileños',
      geoContext: 'Madrid es el motor económico de España, con fuerte competencia en captación orgánica y performance.',
      coordinates: geoPoint(40.4168, -3.7038),
      altitude: 657,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Madrid',
      nearbyLocations: [ref('location-getafe'), ref('location-leganes'), ref('location-alcorcon'), ref('location-mostoles')],
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
      population: 185000,
      gentilicio: 'Getafenses',
      geoContext: 'Getafe destaca por su tejido industrial y empresarial al sur de Madrid, con demanda de leads B2B y B2C.',
      coordinates: geoPoint(40.3083, -3.7327),
      altitude: 622,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Getafe',
      nearbyLocations: [ref('location-madrid'), ref('location-leganes'), ref('location-alcorcon'), ref('location-mostoles')],
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
      population: 191000,
      gentilicio: 'Pepineros',
      geoContext: 'Leganés tiene alta densidad residencial y comercio local, con oportunidades de SEO local y CRO.',
      coordinates: geoPoint(40.3272, -3.7635),
      altitude: 665,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Legan%C3%A9s',
      nearbyLocations: [ref('location-madrid'), ref('location-getafe'), ref('location-alcorcon'), ref('location-mostoles')],
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
      population: 170000,
      gentilicio: 'Alcorconeros',
      geoContext: 'Alcorcón compite en mercados locales de servicios; el SEO local y contenidos orientados a intención son clave.',
      coordinates: geoPoint(40.3468, -3.8278),
      altitude: 718,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Alcorc%C3%B3n',
      nearbyLocations: [ref('location-madrid'), ref('location-getafe'), ref('location-leganes'), ref('location-mostoles')],
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
      population: 210000,
      gentilicio: 'Mostoleños',
      geoContext: 'Móstoles es un gran núcleo residencial con negocios de proximidad; el posicionamiento local marca diferencia.',
      coordinates: geoPoint(40.3223, -3.8649),
      altitude: 667,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/M%C3%B3stoles',
      nearbyLocations: [ref('location-madrid'), ref('location-getafe'), ref('location-leganes'), ref('location-alcorcon')],
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
      population: 195000,
      gentilicio: 'Complutenses',
      geoContext: 'Alcalá de Henares combina patrimonio y economía de servicios; el SEO local y la autoridad temática son clave.',
      coordinates: geoPoint(40.48198, -3.36354),
      altitude: 588,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Alcal%C3%A1_de_Henares',
      nearbyLocations: [ref('location-madrid')],
    },

    {
      _id: 'location-sevilla',
      _type: 'location',
      name: 'Sevilla',
      slug: slugValue('sevilla'),
      type: 'city',
      province: ref('province-sevilla'),
      autonomousCommunity: ref('autonomousCommunity-andalucia'),
      population: 688000,
      gentilicio: 'Sevillanos',
      geoContext: 'Sevilla es un polo económico del sur con fuerte sector servicios, turismo y ecosistema empresarial creciente.',
      coordinates: geoPoint(37.3891, -5.9845),
      altitude: 7,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Sevilla',
      nearbyLocations: [ref('location-dos-hermanas'), ref('location-ecija'), ref('location-carmona'), ref('location-osuna')],
    },
    {
      _id: 'location-osuna',
      _type: 'location',
      name: 'Osuna',
      slug: slugValue('osuna'),
      type: 'town',
      parent: ref('location-sevilla'),
      province: ref('province-sevilla'),
      autonomousCommunity: ref('autonomousCommunity-andalucia'),
      population: 18000,
      gentilicio: 'Osunenses',
      geoContext: 'Osuna concentra servicios comarcales y actividad agrícola; la captación local se beneficia de SEO por intención.',
      coordinates: geoPoint(37.2376, -5.1026),
      altitude: 330,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Osuna',
      nearbyLocations: [ref('location-sevilla'), ref('location-ecija'), ref('location-carmona'), ref('location-dos-hermanas')],
    },
    {
      _id: 'location-ecija',
      _type: 'location',
      name: 'Écija',
      slug: slugValue('ecija'),
      type: 'town',
      parent: ref('location-sevilla'),
      province: ref('province-sevilla'),
      autonomousCommunity: ref('autonomousCommunity-andalucia'),
      population: 39000,
      gentilicio: 'Ecijanos',
      geoContext: 'Écija es un nodo comarcal con comercio y servicios; el SEO local ayuda a dominar búsquedas transaccionales.',
      coordinates: geoPoint(37.5435, -5.0826),
      altitude: 116,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/%C3%89cija',
      nearbyLocations: [ref('location-sevilla'), ref('location-osuna'), ref('location-carmona'), ref('location-dos-hermanas')],
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
      population: 135000,
      gentilicio: 'Nazarenos',
      geoContext: 'Dos Hermanas crece como área residencial e industrial del entorno de Sevilla; el SEO local es diferencial.',
      coordinates: geoPoint(37.2866, -5.9243),
      altitude: 42,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Dos_Hermanas',
      nearbyLocations: [ref('location-sevilla'), ref('location-carmona'), ref('location-ecija'), ref('location-osuna')],
    },
    {
      _id: 'location-carmona',
      _type: 'location',
      name: 'Carmona',
      slug: slugValue('carmona'),
      type: 'town',
      parent: ref('location-sevilla'),
      province: ref('province-sevilla'),
      autonomousCommunity: ref('autonomousCommunity-andalucia'),
      population: 28000,
      gentilicio: 'Carmoneses',
      geoContext: 'Carmona combina turismo, comercio y servicios; la visibilidad local se apalanca con contenidos orientados a barrio/sector.',
      coordinates: geoPoint(37.4710, -5.6477),
      altitude: 235,
      wikipediaUrl: 'https://es.wikipedia.org/wiki/Carmona',
      nearbyLocations: [ref('location-sevilla'), ref('location-dos-hermanas'), ref('location-ecija'), ref('location-osuna')],
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
  console.log(`Docs a crear/asegurar (createOrReplace): ${allDocs.length}`);
  console.log(`Modo: ${dryRun ? 'DRY RUN' : 'WRITE'}`);
  console.log(`Purge: ${purge ? 'ON' : 'OFF'}`);

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

  if (purge) {
    const ids = await sanity.fetch(
      `*[
        _type == "serviceLocation" ||
        (_type == "location" && _id match "location-*") ||
        (_type == "province" && _id match "province-*") ||
        (_type == "autonomousCommunity" && _id match "autonomousCommunity-*")
      ]._id`
    );

    const deleteIds = Array.isArray(ids) ? ids.filter((id) => typeof id === 'string' && id.length) : [];
    if (deleteIds.length) {
      console.log(`Purge: borrando ${deleteIds.length} docs...`);
      const batchSize = 50;
      for (let i = 0; i < deleteIds.length; i += batchSize) {
        const batch = deleteIds.slice(i, i + batchSize);
        let tx = sanity.transaction();
        batch.forEach((id) => {
          tx = tx.delete(id);
        });
        await tx.commit();
        console.log(`Purge batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(deleteIds.length / batchSize)} OK`);
      }
    } else {
      console.log('Purge: no se encontraron docs a borrar.');
    }
  }

  const batchSize = 40;
  for (let i = 0; i < allDocs.length; i += batchSize) {
    const batch = allDocs.slice(i, i + batchSize);
    let tx = sanity.transaction();
    batch.forEach((doc) => {
      tx = tx.createOrReplace(doc);
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
