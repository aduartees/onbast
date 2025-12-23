import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'autonomousCommunity',
  title: 'Comunidad Autónoma (CCAA)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordenadas Geográficas',
      type: 'geopoint',
      description: 'Opcional. Útil para Schema.org (geo).',
    }),
    defineField({
      name: 'wikipediaUrl',
      title: 'Enlace Wikipedia (sameAs)',
      type: 'url',
      description: 'Recomendado para desambiguación de entidad en Schema.org.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})

