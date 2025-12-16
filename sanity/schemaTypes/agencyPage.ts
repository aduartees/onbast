
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'agencyPage',
  title: 'Página Agencia (About)',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título (Pill / H1)', type: 'string', description: 'Ej: Agencia, Nosotros' }),
        defineField({ name: 'headline', title: 'Frase Principal (Large Text)', type: 'text', rows: 2, description: 'La frase grande de impacto. Ej: Más que una agencia.' }),
        defineField({ name: 'highlight', title: 'Palabra Destacada (Cursiva)', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción Corta (Párrafo)', type: 'text', rows: 3, description: 'El párrafo introductorio bajo la frase.' }),
        defineField({ name: 'image', title: 'Imagen Hero', type: 'image', options: { hotspot: true } }),
      ]
    }),
    defineField({
      name: 'history',
      title: 'Nuestra Historia',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'highlight', title: 'Palabra en Cursiva (Highlight)', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text' }),
        defineField({ name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true } }),
      ]
    }),
    defineField({
      name: 'methodology',
      title: 'Metodología',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'highlight', title: 'Palabra en Cursiva (Highlight)', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text' }),
        defineField({
          name: 'steps',
          title: 'Pasos',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'title', title: 'Título del Paso', type: 'string' }),
              defineField({ name: 'description', title: 'Descripción', type: 'text' }),
            ]
          }]
        })
      ]
    }),
    defineField({
      name: 'teamSection',
      title: 'Equipo',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'highlight', title: 'Palabra en Cursiva (Highlight)', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text' }),
        defineField({
          name: 'members',
          title: 'Miembros Destacados',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'teamMember' }] }]
        })
      ]
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'highlight', title: 'Palabra en Cursiva (Highlight)', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text' }),
        defineField({ name: 'image', title: 'Imagen de la Oficina/Mapa', type: 'image' }),
        defineField({ name: 'address', title: 'Dirección Texto', type: 'string' }),
        defineField({ name: 'coordinates', title: 'Coordenadas (Lat, Lng)', type: 'string' }),
        defineField({ name: 'googleMapsUrl', title: 'Enlace Google Maps', type: 'url' }),
      ]
    }),
    defineField({
      name: 'projects',
      title: 'Proyectos Destacados',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'highlight', title: 'Palabra Destacada (Cursiva)', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text' }),
        defineField({
          name: 'selectedProjects',
          title: 'Seleccionar Proyectos',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'project' }] }]
        })
      ]
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonios',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'highlight', title: 'Palabra en Cursiva (Highlight)', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text' }),
        defineField({
          name: 'selectedTestimonials',
          title: 'Seleccionar Testimonios',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'testimonial' }] }]
        })
      ]
    }),
    defineField({
      name: 'cta',
      title: 'CTA Final',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text' }),
        defineField({ name: 'buttonText', title: 'Texto Botón', type: 'string' }),
        defineField({ name: 'buttonLink', title: 'Enlace Botón', type: 'string' }),
      ]
    }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO Metadata',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'description', title: 'Meta Description', type: 'text' }),
        defineField({ name: 'image', title: 'Share Image', type: 'image' }),
      ]
    })
  ]
})
