import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'projectsPage',
  title: 'Página de Proyectos',
  type: 'document',
  preview: {
    prepare() {
      return {
        title: 'Página de Proyectos'
      }
    }
  },
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título (Pill)', type: 'string', initialValue: 'Portafolio' }),
        defineField({ name: 'headline', title: 'Frase Principal', type: 'text', rows: 2 }),
        defineField({ name: 'highlight', title: 'Palabra Destacada (Cursiva)', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
      ]
    }),
    defineField({
      name: 'clients',
      title: 'Clientes / Trust',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'highlight', title: 'Palabra Destacada (Cursiva)', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text' }),
        defineField({
            name: 'logos',
            title: 'Logos de Clientes',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    defineField({ name: 'name', title: 'Nombre', type: 'string' }),
                    defineField({ name: 'logo', title: 'Logo', type: 'image' })
                ]
            }]
        })
      ]
    }),
    defineField({
        name: 'impact',
        title: 'Impacto / Estadísticas',
        type: 'object',
        fields: [
            defineField({ name: 'title', title: 'Título', type: 'string' }),
            defineField({ name: 'highlight', title: 'Palabra Destacada (Cursiva)', type: 'string' }),
            defineField({ name: 'description', title: 'Descripción', type: 'text' }),
            defineField({
                name: 'stats',
                title: 'Estadísticas',
                type: 'array',
                of: [{
                    type: 'object',
                    fields: [
                        defineField({ name: 'value', title: 'Valor (Número)', type: 'string' }),
                        defineField({ name: 'label', title: 'Etiqueta', type: 'string' }),
                        defineField({ name: 'suffix', title: 'Sufijo (+, %)', type: 'string' })
                    ]
                }]
            })
        ]
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de Proyectos',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string', initialValue: 'Nuestros Trabajos' }),
        defineField({ name: 'subtitle', title: 'Subtítulo', type: 'string', initialValue: 'Galería' }),
        defineField({ name: 'highlight', title: 'Palabra Destacada (Cursiva)', type: 'string', initialValue: 'Destacados' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text' }),
      ]
    }),
    defineField({
      name: 'process',
      title: 'Proceso de Trabajo',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'highlight', title: 'Palabra Destacada (Cursiva)', type: 'string' }),
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
      name: 'faq',
      title: 'Preguntas Frecuentes',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'highlight', title: 'Palabra Destacada (Cursiva)', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text' }),
        defineField({
            name: 'questions',
            title: 'Preguntas',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    defineField({ name: 'question', title: 'Pregunta', type: 'string' }),
                    defineField({ name: 'answer', title: 'Respuesta', type: 'text' })
                ]
            }]
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
