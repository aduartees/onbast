import { createClient } from "@sanity/client";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env.local");

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split("\n").forEach((line) => {
    const [key, ...rest] = line.split("=");
    const value = rest.join("=");
    if (key && value && !process.env[key.trim()]) {
      process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
    }
  });
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
if (!dataset) throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET");
if (!token) throw new Error("Missing SANITY_WRITE_TOKEN");

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-07-26",
  useCdn: false,
});

const createSpan = (text) => ({
  _type: "span",
  _key: randomUUID(),
  text,
  marks: [],
});

const createBlock = (text, { style = "normal", listItem, level } = {}) => {
  const block = {
    _type: "block",
    _key: randomUUID(),
    style,
    children: [createSpan(text)],
    markDefs: [],
  };

  if (listItem) block.listItem = listItem;
  if (typeof level === "number") block.level = level;
  return block;
};

const h2 = (text) => createBlock(text, { style: "h2" });
const p = (text) => createBlock(text, { style: "normal" });
const li = (text) => createBlock(text, { style: "normal", listItem: "bullet", level: 1 });

const nowIso = new Date().toISOString();

const privacyPolicyContent = [
  p("En ONBAST nos tomamos muy en serio la privacidad. Esta política explica qué datos personales tratamos, con qué finalidad y cuáles son tus derechos."),
  h2("1. Responsable del tratamiento"),
  p("Marca: ONBAST."),
  p("Titular: Antonio Duarte (profesional autónomo)."),
  p("NIF/DNI: 17486834A."),
  p("Email de contacto (privacidad): info@onbast.com."),
  p("Teléfono de contacto: 601 636 187."),
  p("Domicilio: Avda Oviedo 20B, España."),
  p("Centro de trabajo: C. la Tesilla, 6, 39012 Santander, Cantabria (coworking en el CIE – Centro de Iniciativas Empresariales de Santander)."),
  h2("2. Datos que tratamos"),
  p("Tratamos los datos que nos facilitas al contactarnos a través de los formularios y canales de contacto disponibles."),
  li("Nombre"),
  li("Teléfono"),
  li("Email"),
  li("Plan o servicio de interés"),
  li("Mensaje"),
  h2("3. Cómo obtenemos tus datos"),
  li("Formularios del sitio web"),
  li("Contacto directo por email"),
  li("Contacto por teléfono o WhatsApp (si decides escribirnos o llamarnos)"),
  h2("4. Finalidades del tratamiento"),
  li("Responder a solicitudes de información y contacto"),
  li("Preparar propuestas y gestionar comunicaciones precontractuales"),
  li("Gestionar la relación profesional si contratas servicios"),
  li("Mejorar la seguridad y el funcionamiento del sitio"),
  h2("5. Base jurídica"),
  li("Consentimiento: cuando envías un formulario o nos escribes por canales de contacto"),
  li("Medidas precontractuales: cuando solicitas presupuesto o información para contratar"),
  li("Obligaciones legales: cuando sea necesario para cumplir normativa aplicable"),
  li("Interés legítimo: para proteger la seguridad del sitio y prevenir abusos"),
  h2("6. Destinatarios y encargados de tratamiento"),
  p("No vendemos tus datos. Para poder operar el servicio, utilizamos proveedores que pueden tratar datos en nuestro nombre:"),
  li("Google Workspace (Gmail): gestión de comunicaciones"),
  li("Vercel: alojamiento e infraestructura del sitio"),
  li("Sanity.io: sistema de gestión de contenidos (CMS)"),
  p("Estos proveedores pueden alojar o procesar datos fuera del Espacio Económico Europeo. En su caso, se aplican las garantías contractuales y mecanismos de transferencia previstos por la normativa."),
  h2("7. Plazos de conservación"),
  p("Conservaremos los datos el tiempo necesario para atender tu solicitud y, en su caso, gestionar la relación comercial o profesional."),
  li("Solicitudes y leads: hasta 12 meses desde la última interacción, salvo que solicites su supresión antes"),
  li("Relación contractual: durante la vigencia del servicio y los plazos legales posteriores aplicables"),
  h2("8. Derechos"),
  p("Puedes solicitar acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad. También puedes retirar tu consentimiento en cualquier momento."),
  p("Para ejercerlos, escribe a info@onbast.com indicando tu solicitud y un medio de verificación de identidad."),
  p("Si consideras que tus derechos no han sido atendidos, puedes reclamar ante la Agencia Española de Protección de Datos (AEPD): https://www.aepd.es/"),
  h2("9. Seguridad"),
  p("Aplicamos medidas técnicas y organizativas razonables para proteger la información frente a accesos no autorizados, pérdida o alteración."),
  h2("10. Cambios en esta política"),
  p("Podemos actualizar esta política para reflejar cambios legales o de funcionamiento. La fecha de última actualización se mostrará en esta página."),
];

const legalNoticeContent = [
  p("Este Aviso Legal regula el acceso y uso del sitio web asociado a la marca ONBAST."),
  h2("1. Titularidad"),
  p("Titular: Antonio Duarte (profesional autónomo)."),
  p("NIF/DNI: 17486834A."),
  p("Marca: ONBAST."),
  p("Email: info@onbast.com."),
  p("Teléfono: 601 636 187."),
  p("Domicilio: Avda Oviedo 20B, España."),
  p("Centro de trabajo: C. la Tesilla, 6, 39012 Santander, Cantabria (coworking en el CIE – Centro de Iniciativas Empresariales de Santander)."),
  h2("2. Condiciones de uso"),
  p("Al acceder a este sitio te comprometes a utilizarlo de forma lícita, sin causar daños, interferencias o accesos no autorizados."),
  h2("3. Propiedad intelectual e industrial"),
  p("Los contenidos, diseños, textos, imágenes, logotipos y código del sitio están protegidos por derechos de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución o transformación sin autorización."),
  h2("4. Enlaces"),
  p("Este sitio puede incluir enlaces a sitios de terceros. No nos responsabilizamos de sus contenidos, políticas o prácticas."),
  h2("5. Responsabilidad"),
  p("Trabajamos para mantener la información actualizada y el sitio disponible, pero no garantizamos la ausencia de errores, interrupciones o vulnerabilidades. En la medida permitida por la ley, no asumimos responsabilidad por daños derivados del uso del sitio."),
  h2("6. Legislación aplicable"),
  p("Estas condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa aplicable."),
];

const cookiesPolicyContent = [
  p("Esta política explica qué son las cookies, qué tipos utilizamos y cómo puedes gestionarlas."),
  h2("1. Qué son las cookies"),
  p("Las cookies son pequeños archivos que se almacenan en tu dispositivo cuando navegas por un sitio web. Permiten, entre otras cosas, recordar preferencias o medir el uso del sitio."),
  h2("2. Tipos de cookies"),
  li("Necesarias: imprescindibles para el funcionamiento básico del sitio"),
  li("Analíticas: ayudan a medir el rendimiento y uso del sitio"),
  li("Marketing: orientadas a publicidad personalizada (si se activan)"),
  h2("3. Cookies que utilizamos"),
  p("En ONBAST utilizamos cookies necesarias para gestionar tus preferencias de consentimiento, y opcionalmente herramientas de analítica para medir el rendimiento del sitio."),
  li("Cookie de consentimiento (onbast_cookie_consent): guarda tu elección sobre cookies"),
  li("Analítica y rendimiento: Vercel Analytics y Vercel Speed Insights (solo si aceptas la categoría de Analítica)"),
  p("Actualmente no usamos cookies de marketing por defecto. Si en el futuro se incorporan, se pedirá consentimiento previo."),
  h2("4. Cómo gestionar y revocar tu consentimiento"),
  p("Puedes aceptar, rechazar o configurar cookies desde el banner de cookies. También puedes cambiar tu elección en cualquier momento desde la opción \"Configurar cookies\" disponible en el sitio."),
  p("Además, puedes eliminar o bloquear cookies desde la configuración de tu navegador. Ten en cuenta que algunas funciones pueden dejar de estar disponibles si bloqueas cookies necesarias."),
  h2("5. Actualizaciones"),
  p("Podemos actualizar esta política para reflejar cambios en el uso de cookies o en requisitos legales. La fecha de última actualización se mostrará en esta página."),
];

const termsOfServiceContent = [
  p("Estas Condiciones del Servicio regulan la contratación y uso de los servicios prestados por ONBAST. El detalle final de alcance, plazos, entregables y precios constará en el contrato y presupuesto firmados."),
  h2("1. Identificación del prestador"),
  p("Marca comercial: ONBAST."),
  p("Titular: Antonio Duarte (profesional autónomo)."),
  p("NIF/DNI: 17486834A."),
  p("Teléfono: 601 636 187."),
  p("Email: info@onbast.com."),
  p("Domicilio: Avda Oviedo 20B 3A, 39710 Solares, Cantabria, España."),
  p("Actividad: ONBAST opera como startup y presta servicios desde el CIE (Centro de Iniciativas Empresariales de Santander) como centro de trabajo."),
  h2("2. Contratación"),
  li("La contratación se realiza tras contactar, mantener una reunión y aceptar presupuesto y contrato por escrito."),
  li("El alcance y condiciones específicas prevalecen según el contrato/presupuesto firmado en caso de conflicto con estas Condiciones."),
  h2("3. Servicios"),
  p("Ofrecemos servicios de desarrollo y diseño web, posicionamiento SEO y GEO, desarrollo de aplicaciones web y MVP, y gestión del perfil de Google. Las características, plazos y entregables se describen en las páginas de cada servicio y se concretan en el contrato."),
  h2("4. Precios y permanencias"),
  p("Salvo que se indique lo contrario en el contrato, los siguientes precios son orientativos y se entienden sin IVA (IVA aparte):"),
  li("Web as a Service (WaaS) – desarrollo y diseño web: 249 €/mes, permanencia 18 meses."),
  li("SEO: 149 €/mes, permanencia 12 meses."),
  li("GEO: 299 €/mes, permanencia 12 meses."),
  li("Desarrollo de aplicaciones web y MVP: 2.499 € por sprint de 2 semanas."),
  li("Gestión del perfil de Google: 149 €/mes, permanencia 6 meses."),
  h2("5. Impuestos"),
  p("Todos los importes se indican sin IVA, salvo que se especifique lo contrario. El IVA se añadirá en factura conforme a la normativa vigente."),
  h2("6. Forma de pago y facturación"),
  li("Los pagos se realizan por transferencia bancaria según lo acordado en el contrato/presupuesto."),
  li("En servicios recurrentes, la facturación será mensual salvo pacto distinto."),
  li("El impago faculta a suspender el servicio y/o accesos asociados hasta regularización, sin perjuicio de las acciones que correspondan."),
  h2("7. Permanencia, baja y resolución anticipada"),
  p("Determinados servicios incluyen permanencia. La cancelación antes de finalizar la permanencia puede implicar el pago de importes pendientes. Salvo que el contrato disponga otra cosa, la resolución anticipada por parte del cliente conllevará, además, una compensación equivalente al 50% de las cuotas mensuales restantes hasta completar la permanencia, sin perjuicio de reclamaciones por daños adicionales si los hubiera."),
  h2("8. Obligaciones del cliente"),
  li("Facilitar a tiempo contenidos, accesos y la información necesaria para ejecutar el servicio."),
  li("Revisar y aprobar entregables en los plazos indicados para evitar bloqueos en el calendario."),
  li("Garantizar que dispone de derechos sobre los materiales que aporta (textos, imágenes, marcas, etc.)."),
  h2("9. Propiedad intelectual y uso en portfolio"),
  p("La titularidad y licencias sobre entregables, código y diseños se regirán por lo pactado en el contrato."),
  p("Salvo acuerdo en contra, ONBAST podrá mostrar los proyectos realizados (incluyendo capturas y descripción general) en su portfolio y materiales comerciales como caso de estudio, sin revelar información confidencial ni credenciales."),
  h2("10. Herramientas y terceros"),
  p("Podemos apoyarnos en proveedores y herramientas de terceros (por ejemplo, hosting, analítica, CMS). Los costes de terceros no incluidos en el presupuesto se asumirán por el cliente salvo pacto distinto. El uso de herramientas de terceros queda sujeto a sus propios términos y licencias."),
  h2("11. Limitación de responsabilidad"),
  p("Trabajamos con estándares profesionales, pero no garantizamos resultados concretos en buscadores (posiciones, tráfico o ventas) al depender de factores externos. En la medida permitida por la ley, no asumimos responsabilidad por daños indirectos, lucro cesante o pérdida de datos causada por terceros o por uso indebido del cliente."),
  h2("12. Legislación aplicable"),
  p("Estas condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa aplicable."),
];

const docs = [
  {
    _id: "privacyPolicyPage",
    _type: "privacyPolicyPage",
    title: "Política de Privacidad",
    updatedAt: nowIso,
    content: privacyPolicyContent,
  },
  {
    _id: "legalNoticePage",
    _type: "legalNoticePage",
    title: "Aviso Legal",
    updatedAt: nowIso,
    content: legalNoticeContent,
  },
  {
    _id: "cookiesPage",
    _type: "cookiesPage",
    title: "Política de Cookies",
    updatedAt: nowIso,
    content: cookiesPolicyContent,
  },
  {
    _id: "termsOfServicePage",
    _type: "termsOfServicePage",
    title: "Condiciones del Servicio",
    updatedAt: nowIso,
    content: termsOfServiceContent,
  },
];

const run = async () => {
  const results = [];
  for (const doc of docs) {
    results.push(await client.createOrReplace(doc));
  }
  return results;
};

run().then((results) => {
  process.stdout.write(
    JSON.stringify(
      {
        success: true,
        documents: results.map((d) => ({ _id: d._id, _type: d._type, _rev: d._rev })),
      },
      null,
      2
    ) + "\n"
  );
});
