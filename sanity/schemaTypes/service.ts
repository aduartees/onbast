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
    defineField({
      name: 'heroButtonText',
      title: 'Texto Botón Hero',
      type: 'string',
      group: 'general',
      description: 'Ej: Solicitar Consultoría, Ver Planes',
      initialValue: 'Solicitar Consultoría'
    }),
    defineField({
      name: 'heroButtonLink',
      title: 'Enlace Botón Hero',
      type: 'string',
      group: 'general',
      description: 'Ej: /contacto, https://calendly.com/...',
      initialValue: '/contacto'
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
      name: 'overviewText',
      title: 'Texto de Visión General (Párrafo 2)',
      type: 'text',
      group: 'content',
      rows: 4,
      description: 'Texto adicional que aparece debajo de la descripción principal en la sección de Visión General.'
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
            }),
            defineField({
                name: 'cards',
                title: 'Tarjetas',
                type: 'array',
                of: [
                    {
                        type: 'object',
                        fields: [
                            defineField({ name: 'title', title: 'Título', type: 'string' }),
                            defineField({ name: 'description', title: 'Descripción', type: 'text' }),
                            defineField({ 
                                name: 'colSpan', 
                                title: 'Columnas (1, 2 o 3)', 
                                type: 'number',
                                initialValue: 1,
                                validation: Rule => Rule.min(1).max(3)
                            }),
                            defineField({
                                name: 'color',
                                title: 'Tinte de Color',
                                type: 'string',
                                options: {
                                    list: [
                                        { title: 'Neutro', value: 'neutral' },
                                        { title: 'Azul', value: 'blue' },
                                        { title: 'Rosa', value: 'pink' },
                                        { title: 'Indigo', value: 'indigo' },
                                    ]
                                }
                            }),
                            defineField({ name: 'imageUrl', title: 'Imagen (Opcional)', type: 'image' })
                        ]
                    }
                ]
            })
        ]
    }),
    defineField({
      name: 'teamTitle',
      title: 'Título Sección Equipo',
      type: 'string',
      group: 'content',
      initialValue: 'Equipo Asignado'
    }),
    defineField({
      name: 'team',
      title: 'Equipo Asignado',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'teamMember' }] }]
    }),
    defineField({
      name: 'testimonialsTitle',
      title: 'Título Sección Testimonios',
      type: 'string',
      group: 'content',
      initialValue: 'Testimonios Relacionados'
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonios Relacionados',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }]
    }),
    defineField({
        name: 'featuresTitle',
        title: 'Título Sección Características',
        type: 'string',
        group: 'content',
        initialValue: 'Características'
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
        name: 'processTitle',
        title: 'Título Sección Proceso',
        type: 'string',
        group: 'content',
        initialValue: 'Nuestro Proceso'
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
            // Eliminar lista fija para permitir cualquier entrada
        }
    }),
    defineField({
        name: 'faqTitle',
        title: 'Título Sección FAQ',
        type: 'string',
        group: 'content',
        initialValue: 'Preguntas Frecuentes'
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
