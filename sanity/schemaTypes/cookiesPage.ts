import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cookiesPage',
  title: 'Política de Cookies',
  type: 'document',
  preview: {
    prepare() {
      return {
        title: 'Política de Cookies',
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      initialValue: 'Política de Cookies',
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
  ],
})
