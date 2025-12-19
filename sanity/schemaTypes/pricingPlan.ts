import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pricingPlan',
  title: 'Plan de Precios',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre del Plan',
      type: 'string',
      description: 'Ej: Suscripción Corporate, Sprint Dedicado',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Precio (Display)',
      type: 'string',
      description: 'Ej: 200€, 3.500€',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'currency',
      title: 'Moneda',
      type: 'string',
      options: {
        list: ['EUR', 'USD'],
      },
      initialValue: 'EUR',
    }),
    defineField({
      name: 'period',
      title: 'Periodicidad',
      type: 'string',
      description: 'Ej: /mes, /sprint, Pago Único',
    }),
    defineField({
      name: 'badge',
      title: 'Etiqueta Destacada (Badge)',
      type: 'string',
      description: 'Ej: Más Popular, Recomendado',
    }),
    defineField({
      name: 'description',
      title: 'Descripción Corta',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'features',
      title: 'Características (Lista)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'addon',
      title: 'Add-on Opcional (Switch)',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'Título Addon' },
        { name: 'price', type: 'string', title: 'Precio Addon' },
        { name: 'active', type: 'boolean', title: 'Activo por defecto', initialValue: false }
      ]
    }),
    defineField({
      name: 'buttonText',
      title: 'Texto del Botón',
      type: 'string',
      initialValue: 'Contratar Plan',
    }),
    defineField({
      name: 'buttonLinkID',
      title: 'ID de Enlace (Para Configurador)',
      type: 'slug',
      description: 'Identificador único para pre-seleccionar este plan en /planes. Ej: plan-corporate',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      period: 'period'
    },
    prepare({ title, price, period }) {
      return {
        title: title,
        subtitle: `${price} ${period || ''}`
      }
    }
  }
})
