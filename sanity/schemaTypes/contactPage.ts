import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Página de Contacto',
  type: 'document',
  preview: {
    prepare() {
      return {
        title: 'Página de Contacto'
      }
    }
  },
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título (Pill)', type: 'string', initialValue: 'Contacto' }),
        defineField({ name: 'headline', title: 'Frase Principal', type: 'text', rows: 2 }),
        defineField({ name: 'highlight', title: 'Palabra Destacada (Cursiva)', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
      ]
    }),
    defineField({
      name: 'contactInfo',
      title: 'Información de Contacto',
      type: 'object',
      fields: [
        defineField({ name: 'email', title: 'Email Visible', type: 'string' }),
        defineField({ name: 'phone', title: 'Teléfono Visible', type: 'string' }),
        defineField({ name: 'whatsapp', title: 'Número de WhatsApp', type: 'string', description: 'Número internacional sin espacios ni símbolos (ej: 34600000000)' }),
        defineField({ name: 'schedule', title: 'Horario de Atención', type: 'string' }),
        defineField({ name: 'location', title: 'Ubicación Corta', type: 'string', description: 'Ej: Madrid, España' }),
      ]
    }),
    defineField({
      name: 'formTopics',
      title: 'Temas del Formulario',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['Nuevo Proyecto', 'Consultoría', 'Carreras', 'Otro']
    }),
    defineField({
      name: 'faq',
      title: 'Preguntas Frecuentes',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'highlight', title: 'Palabra Destacada', type: 'string' }),
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
