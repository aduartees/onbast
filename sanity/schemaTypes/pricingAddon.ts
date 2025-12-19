import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pricingAddon',
  title: 'Add-on de Precios',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Precio (Display)',
      type: 'string',
      description: 'Ej: +300€/mes',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'id',
      title: 'ID Único (Slug)',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'price'
    }
  }
})
