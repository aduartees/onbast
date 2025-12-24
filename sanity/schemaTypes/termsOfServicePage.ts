import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'termsOfServicePage',
  title: 'Condiciones del Servicio',
  type: 'document',
  preview: {
    prepare() {
      return {
        title: 'Condiciones del Servicio',
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      initialValue: 'Condiciones del Servicio',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Última actualización',
      type: 'datetime',
    }),
    defineField({
      name: 'content',
      title: 'Contenido',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt',
              type: 'string',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Meta Title',
          type: 'string',
          initialValue: 'Condiciones del Servicio | ONBAST',
        }),
        defineField({
          name: 'description',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
        }),
      ],
    }),
  ],
})

