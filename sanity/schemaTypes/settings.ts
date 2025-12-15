import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Configuración Global',
  type: 'document',
  fields: [
    defineField({
      name: 'agencyInfo',
      title: 'Información de la Agencia (SEO Global)',
      type: 'object',
      description: 'Datos utilizados para generar el Schema.org global de la organización.',
      fields: [
        defineField({ name: 'name', title: 'Nombre de la Agencia', type: 'string', initialValue: 'ONBAST' }),
        defineField({ name: 'url', title: 'URL del Sitio Web', type: 'url', initialValue: 'https://onbast.com' }),
        defineField({ name: 'description', title: 'Descripción de la Agencia', type: 'text', rows: 3 }),
        defineField({ name: 'logo', title: 'Logo Principal (SEO)', type: 'image' }),
        defineField({ name: 'email', title: 'Email de Contacto', type: 'string' }),
        defineField({ name: 'phone', title: 'Teléfono de Contacto', type: 'string' }),
        defineField({
            name: 'address',
            title: 'Dirección Física',
            type: 'object',
            fields: [
                {name: 'street', title: 'Calle y Número', type: 'string'},
                {name: 'city', title: 'Ciudad', type: 'string'},
                {name: 'region', title: 'Estado/Provincia', type: 'string'},
                {name: 'postalCode', title: 'Código Postal', type: 'string'},
                {name: 'country', title: 'País', type: 'string', initialValue: 'ES'},
            ]
        }),
        defineField({
            name: 'socialProfiles',
            title: 'Perfiles Sociales (SameAs)',
            type: 'array',
            of: [{type: 'url'}]
        })
      ]
    }),
    defineField({
      name: 'trustedLogos',
      title: 'Logos de Confianza (Globales)',
      description: 'Estos logos aparecerán en todas las landing pages.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', title: 'Nombre de la Empresa' }),
            defineField({ 
              name: 'logo', 
              type: 'image', 
              title: 'Logo',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  type: 'string',
                  title: 'Texto Alternativo (Alt Text)',
                  description: 'Importante para SEO y accesibilidad',
                  validation: Rule => Rule.required()
                })
              ]
            })
          ]
        }
      ]
    })
  ]
})
