import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Configuración Global',
  type: 'document',
  preview: {
    prepare() {
      return {
        title: 'Configuración Global'
      }
    }
  },
  fields: [
    defineField({
      name: 'agencyInfo',
      title: 'Información de la Agencia (SEO Global)',
      type: 'object',
      // group: 'content', // Removing group to fix error
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
    }),
    defineField({
      name: 'header',
      title: 'Configuración del Header',
      type: 'object',
      // group: 'content',
      fields: [
        defineField({ 
          name: 'logoText', 
          title: 'Texto del Logo', 
          type: 'string', 
          initialValue: 'onbast.',
          description: 'Texto que aparece en el logo (si no hay imagen).' 
        }),
        defineField({
          name: 'menuItems',
          title: 'Elementos del Menú',
          type: 'array',
          of: [{
            type: 'object',
            title: 'Enlace',
            fields: [
              {name: 'label', title: 'Texto del Enlace', type: 'string'},
              {name: 'url', title: 'URL', type: 'string'},
              {
                name: 'submenu',
                title: 'Submenú (Opcional)',
                type: 'array',
                of: [{
                  type: 'object',
                  fields: [
                    {name: 'label', title: 'Texto del Enlace', type: 'string'},
                    {name: 'url', title: 'URL', type: 'string'},
                    {name: 'description', title: 'Descripción Corta', type: 'string', description: 'Pequeño texto debajo del enlace (para menús ricos)'}
                  ]
                }]
              }
            ]
          }]
        }),
        defineField({
          name: 'ctaButton',
          title: 'Botón CTA',
          type: 'object',
          fields: [
            {name: 'text', title: 'Texto', type: 'string', initialValue: 'Contacto'},
            {name: 'url', title: 'URL', type: 'string', initialValue: '#contact'}
          ]
        })
      ]
    }),
    defineField({
      name: 'footer',
      title: 'Configuración del Footer',
      type: 'object',
      // group: 'content',
      fields: [
        defineField({ 
          name: 'brandText', 
          title: 'Texto de Marca', 
          type: 'text', 
          rows: 3,
          description: 'Texto que aparece debajo del logo en el footer.' 
        }),
        defineField({
          name: 'socialLinks',
          title: 'Redes Sociales (Footer)',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {name: 'platform', title: 'Plataforma', type: 'string', options: {list: ['Twitter', 'LinkedIn', 'GitHub', 'Instagram', 'Facebook', 'YouTube']}},
              {name: 'url', title: 'URL', type: 'url'}
            ]
          }]
        }),
        defineField({
          name: 'columns',
          title: 'Columnas de Navegación',
          type: 'array',
          of: [{
            type: 'object',
            title: 'Columna',
            fields: [
              {name: 'title', title: 'Título de Columna', type: 'string'},
              {
                name: 'links', 
                title: 'Enlaces', 
                type: 'array', 
                of: [{
                  type: 'object', 
                  fields: [
                    {name: 'label', title: 'Texto del Enlace', type: 'string'},
                    {name: 'url', title: 'URL (ej: /services o #contact)', type: 'string'}
                  ]
                }]
              }
            ]
          }]
        }),
        defineField({ 
          name: 'copyrightText', 
          title: 'Texto Copyright', 
          type: 'string',
          description: 'Ej: ONBAST Agency. Todos los derechos reservados. (El año se actualiza solo)'
        })
      ]
    })
  ],
  preview: {
    prepare() {
      return {
        title: 'Configuración Global del Sitio'
      }
    }
  }
})
