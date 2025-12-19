import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'location',
  title: 'Ubicación (Ciudad/Pueblo)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      description: 'Ej: Madrid, Getafe, Alcobendas',
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
      name: 'type',
      title: 'Tipo de Ubicación',
      type: 'string',
      options: {
        list: [
          { title: 'Ciudad Principal (Capital/Metrópolis)', value: 'city' },
          { title: 'Pueblo / Municipio', value: 'town' },
        ],
        layout: 'radio'
      },
      initialValue: 'city',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Pertenece a (Ciudad Padre)',
      type: 'reference',
      to: [{ type: 'location' }],
      description: 'Solo para Pueblos. Ej: Getafe pertenece a Madrid.',
      hidden: ({ document }) => document?.type === 'city',
    }),
    defineField({
      name: 'population',
      title: 'Población Aproximada',
      type: 'number',
      description: 'Sirve para priorizar en sitemaps y estrategias.',
    }),
    defineField({
      name: 'gentilicio',
      title: 'Gentilicio',
      type: 'string',
      description: 'Ej: Madrileños, Getafenses. Útil para copy natural.',
    }),
    defineField({
      name: 'geoContext',
      title: 'Contexto Económico/Local (IA)',
      type: 'text',
      rows: 4,
      description: 'Resumen del tejido empresarial generado por IA. Ej: "Getafe es el corazón industrial del sur de Madrid..."',
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordenadas Geográficas',
      type: 'geopoint',
      description: 'Para mapas y Schema Local.',
    }),
    defineField({
      name: 'wikipediaUrl',
      title: 'Enlace Wikipedia / Wikidata (sameAs)',
      type: 'url',
      description: 'Crítico para desambiguación de entidades en Schema.org.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'type',
      parent: 'parent.name'
    },
    prepare({ title, subtitle, parent }) {
      const typeLabel = subtitle === 'city' ? '🏙️ Ciudad' : '🏘️ Pueblo';
      const context = parent ? ` (de ${parent})` : '';
      return {
        title: title,
        subtitle: `${typeLabel}${context}`
      }
    }
  }
})
