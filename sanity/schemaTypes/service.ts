import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Servicio',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icono (Lucide)',
      type: 'string',
      description: 'Nombre del icono de Lucide React (ej: "Search", "Code", "Zap")',
    }),
    defineField({
      name: 'image',
      title: 'Imagen Header',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
        name: 'colSpan',
        title: 'Columnas (Grid)',
        type: 'number',
        initialValue: 1,
        description: '1 para normal, 2 para ancho doble (Bento Grid)',
    })
  ],
})
