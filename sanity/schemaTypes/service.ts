import { defineField, defineType, defineArrayMember } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Servicio',
  type: 'document',
  groups: [
    { name: 'general', title: 'General' },
    { name: 'content', title: 'Contenido Detallado' },
    { name: 'seo', title: 'SEO & Metadatos' },
  ],
  fields: [
    // --- General ---
    defineField({
      name: 'title',
      title: 'Título del Servicio',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'general',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descripción Corta (Para Cards)',
      type: 'text',
      rows: 3,
      group: 'general',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'icon',
      title: 'Icono (Lucide)',
      type: 'string',
      group: 'general',
      description: 'Nombre del icono de Lucide React (ej: "Search", "Code", "Zap")',
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen Principal / Hero',
      type: 'image',
      group: 'general',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto Alternativo',
        }
      ]
    }),

    // --- Contenido Detallado ---
    defineField({
      name: 'longDescription',
      title: 'Descripción Larga (Hero)',
      type: 'text',
      group: 'content',
      rows: 4,
    }),
    defineField({
        name: 'problem',
        title: 'El Problema (Pain Points)',
        type: 'text',
        rows: 3,
        group: 'content',
        description: 'Describe el problema principal que este servicio resuelve.'
    }),
    defineField({
        name: 'solution',
        title: 'La Solución (Value Prop)',
        type: 'text',
        rows: 3,
        group: 'content',
        description: 'Describe cómo solucionamos ese problema.'
    }),
    defineField({
        name: 'impactSection',
        title: 'Sección de Impacto (Wobble Cards)',
        type: 'object',
        group: 'content',
        fields: [
            defineField({
                name: 'title',
                title: 'Título de la Sección',
                type: 'string',
                initialValue: 'Resultados que hablan por sí mismos.'
            }),
            defineField({
                name: 'cards',
                title: 'Tarjetas de Impacto',
                type: 'array',
                of: [
                    defineArrayMember({
                        type: 'object',
                        fields: [
                            defineField({ name: 'title', type: 'string', title: 'Título' }),
                            defineField({ name: 'description', type: 'text', title: 'Descripción' }),
                            defineField({ name: 'colSpan', type: 'number', title: 'Column Span (1-3)', initialValue: 1 }),
                            defineField({ name: 'minHeight', type: 'number', title: 'Min Height (px)', initialValue: 300 }),
                            defineField({ name: 'backgroundImage', type: 'image', title: 'Imagen de Fondo (Opcional)', options: { hotspot: true }, fields: [
                                defineField({
                                    name: 'alt',
                                    type: 'string',
                                    title: 'Alternative Text',
                                }),
                            ]}),
                            defineField({ name: 'color', type: 'string', title: 'Color de Fondo (Tailwind Class)', description: 'ej: bg-pink-800, bg-blue-900', initialValue: 'bg-neutral-900' }),
                        ]
                    })
                ]
            })
        ]
    }),
    defineField({
        name: 'features',
        title: 'Características Clave (Bento Grid)',
        type: 'array',
        group: 'content',
        of: [{
            type: 'object',
            fields: [
                {name: 'title', type: 'string', title: 'Título'},
                {name: 'description', type: 'text', title: 'Descripción'},
                {name: 'icon', type: 'string', title: 'Icono (Lucide)'},
            ]
        }]
    }),
    defineField({
        name: 'benefits',
        title: 'Beneficios (Lista)',
        type: 'array',
        group: 'content',
        of: [{type: 'string'}]
    }),
    defineField({
        name: 'process',
        title: 'Proceso de Trabajo (Tracing Beam)',
        type: 'array',
        group: 'content',
        of: [{
            type: 'object',
            fields: [
                {name: 'title', type: 'string', title: 'Título del Paso'},
                {name: 'description', type: 'text', title: 'Descripción Detallada'},
                {name: 'image', type: 'image', title: 'Imagen del Paso'},
            ]
        }]
    }),
    defineField({
        name: 'technologies',
        title: 'Stack Tecnológico',
        type: 'array',
        group: 'content',
        of: [{type: 'string'}],
        options: {
            list: [
                {title: 'Next.js', value: 'Next.js'},
                {title: 'React', value: 'React'},
                {title: 'TypeScript', value: 'TypeScript'},
                {title: 'Sanity', value: 'Sanity'},
                {title: 'Node.js', value: 'Node.js'},
                {title: 'Tailwind CSS', value: 'Tailwind CSS'},
                {title: 'Vercel', value: 'Vercel'},
                {title: 'OpenAI', value: 'OpenAI'},
                {title: 'Shopify', value: 'Shopify'},
                {title: 'Stripe', value: 'Stripe'},
                {title: 'Supabase', value: 'Supabase'},
            ]
        }
    }),
    defineField({
        name: 'faqs',
        title: 'Preguntas Frecuentes (SEO FAQ Schema)',
        type: 'array',
        group: 'content',
        of: [{
            type: 'object',
            fields: [
                {name: 'question', type: 'string', title: 'Pregunta'},
                {name: 'answer', type: 'text', title: 'Respuesta'},
            ]
        }]
    }),

    // --- SEO ---
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (Meta)',
      type: 'string',
      group: 'seo',
      description: 'Si se deja vacío, usa el Título del Servicio.'
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description (Meta)',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Si se deja vacío, usa la Descripción Corta.'
    }),
  ],
})
