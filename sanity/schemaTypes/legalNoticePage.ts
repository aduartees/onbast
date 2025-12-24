import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'legalNoticePage',
  title: 'Aviso Legal',
  type: 'document',
  preview: {
    prepare() {
      return {
        title: 'Aviso Legal',
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      initialValue: 'Aviso Legal',
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
