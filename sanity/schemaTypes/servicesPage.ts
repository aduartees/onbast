import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'servicesPage',
  title: 'Página de Servicios',
  type: 'document',
  fields: [
    // Hero Section
    defineField({
      name: 'hero',
      title: 'Sección Hero',
      type: 'object',
      fields: [
        defineField({ name: 'pill', title: 'Pill (Etiqueta)', type: 'string', initialValue: 'Servicios' }),
        defineField({ name: 'title', title: 'Título Principal', type: 'string', initialValue: 'Soluciones Digitales 360º.' }),
        defineField({ name: 'highlight', title: 'Palabra Destacada (Cursiva)', type: 'string', initialValue: '360º.' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3, initialValue: 'Transformamos ideas complejas en experiencias digitales de alto rendimiento. Desde el código hasta el posicionamiento.' }),
      ]
    }),

    // Catalog Section
    defineField({
      name: 'catalog',
      title: 'Sección Catálogo',
      type: 'object',
      fields: [
        defineField({ name: 'subtitle', title: 'Subtítulo (Pill)', type: 'string', initialValue: 'Expertise' }),
        defineField({ name: 'title', title: 'Título', type: 'string', initialValue: 'Nuestro Catálogo' }),
        defineField({ name: 'highlight', title: 'Palabra Destacada (Cursiva)', type: 'string', initialValue: 'Catálogo' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2, initialValue: 'Selecciona un servicio para ver cómo podemos ayudarte a escalar.' }),
      ]
    }),

    // Tech Section
    defineField({
      name: 'tech',
      title: 'Sección Tecnología',
      type: 'object',
      fields: [
        defineField({ name: 'pill', title: 'Pill (Etiqueta)', type: 'string', initialValue: 'Stack' }),
        defineField({ name: 'title', title: 'Título', type: 'string', initialValue: 'Tecnología de Vanguardia' }),
        defineField({ name: 'highlight', title: 'Palabra Destacada (Cursiva)', type: 'string', initialValue: 'Vanguardia' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2, initialValue: 'Utilizamos las herramientas más avanzadas del mercado para garantizar velocidad, seguridad y escalabilidad.' }),
      ]
    }),

    // CTA Section
    defineField({
      name: 'cta',
      title: 'Sección CTA',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string', initialValue: '¿No encuentras lo que buscas?' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2, initialValue: 'Ofrecemos soluciones personalizadas adaptadas a tus necesidades específicas. Hablemos de tu proyecto.' }),
        defineField({ name: 'buttonText', title: 'Texto Botón', type: 'string', initialValue: 'Contáctanos' }),
        defineField({ name: 'buttonLink', title: 'Enlace Botón', type: 'string', initialValue: '/contacto' }),
      ]
    }),

    // SEO
    defineField({
        name: 'seoTitle',
        title: 'Título SEO (Meta Title)',
        type: 'string',
        group: 'seo'
    }),
    defineField({
        name: 'seoDescription',
        title: 'Descripción SEO (Meta Description)',
        type: 'text',
        rows: 3,
        group: 'seo'
    }),
  ],
  groups: [
      { name: 'seo', title: 'SEO & Metadatos' }
  ],
  preview: {
    select: {
      title: 'hero.title'
    },
    prepare({ title }) {
      return {
        title: title || 'Página de Servicios'
      }
    }
  }
})
