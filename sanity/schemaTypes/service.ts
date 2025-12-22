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
      name: 'additionalType',
      title: 'Additional Type (Wikidata URL)',
      type: 'url',
      group: 'general',
      description: 'URL de Wikidata para el tipo de servicio (ej: https://www.wikidata.org/wiki/Q56062435)',
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
      title: 'Icono',
      type: 'iconPicker',
      group: 'general',
      options: {
        storeSvg: true
      }
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
    defineField({
      name: 'heroSecondaryButtonText',
      title: 'Texto Botón Secundario Hero',
      type: 'string',
      group: 'general',
      description: 'Ej: Ver Casos de Éxito',
      initialValue: 'Ver Casos de Éxito'
    }),
    defineField({
      name: 'heroSecondaryButtonLink',
      title: 'Enlace Botón Secundario Hero',
      type: 'string',
      group: 'general',
      description: 'Ej: /proyectos',
      initialValue: '/proyectos'
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Titular de Impacto (Hero)',
      type: 'string',
      group: 'general',
      description: 'Frase grande e impactante para el Hero. La palabra central se pondrá automáticamente en cursiva.',
    }),
    defineField({
      name: 'heroHighlight',
      title: 'Palabra Destacada Hero (Cursiva)',
      type: 'string',
      group: 'general',
      description: 'Palabra exacta dentro del titular que quieres en cursiva.',
    }),
    defineField({
      name: 'heroIntroduction',
      title: 'Introducción Pequeña (Hero)',
      type: 'text',
      rows: 2,
      group: 'general',
      description: 'Párrafo pequeño debajo del titular para dar contexto adicional.',
    }),
    // defineField({
    //   name: 'heroTrustedLogos',
    //   title: 'Logos de Confianza (Hero)',
    //   description: 'OBSOLETO: Se usan los logos de Configuración Global.',
    //   type: 'array',
    //   group: 'general',
    //   readOnly: true,
    //   hidden: true,
    //   of: [{type: 'string'}] 
    // }),


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
        name: 'impactSection',
        title: 'Sección de Impacto (Estadísticas)',
        type: 'object',
        group: 'content',
        fields: [
            defineField({
                name: 'title',
                title: 'Título de la Sección',
                type: 'string',
                initialValue: 'Resultados Medibles'
            }),
            defineField({ name: 'highlight', title: 'Palabra Destacada (Cursiva)', type: 'string' }),
            defineField({
                name: 'subtitle',
                title: 'Subtítulo',
                type: 'string',
                initialValue: 'Nuestros números hablan por sí mismos'
            }),
            defineField({
                name: 'stats',
                title: 'Estadísticas',
                type: 'array',
                of: [
                    {
                        type: 'object',
                        fields: [
                            defineField({ name: 'value', title: 'Valor Numérico', type: 'number', validation: Rule => Rule.required() }),
                            defineField({ name: 'prefix', title: 'Prefijo (ej: $)', type: 'string' }),
                            defineField({ name: 'suffix', title: 'Sufijo (ej: %, +)', type: 'string' }),
                            defineField({ name: 'label', title: 'Etiqueta Principal', type: 'string', validation: Rule => Rule.required() }),
                            defineField({ name: 'description', title: 'Descripción Corta', type: 'text', rows: 2 }),
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
    defineField({ name: 'teamHighlight', title: 'Palabra Destacada Equipo (Cursiva)', type: 'string', group: 'content' }),
    defineField({
      name: 'teamDescription',
      title: 'Descripción Sección Equipo',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'team',
      title: 'Equipo Asignado',
      type: 'array',
      group: 'content',
      description: 'Selecciona los miembros del equipo para este servicio. Si se deja vacío, se mostrarán todos los miembros del equipo.',
      of: [{ type: 'reference', to: [{ type: 'teamMember' }] }]
    }),
    defineField({
      name: 'testimonialsTitle',
      title: 'Título Sección Testimonios',
      type: 'string',
      group: 'content',
      initialValue: 'Testimonios Relacionados'
    }),
    defineField({ name: 'testimonialsHighlight', title: 'Palabra Destacada Testimonios (Cursiva)', type: 'string', group: 'content' }),
    defineField({
      name: 'testimonialsDescription',
      title: 'Descripción Sección Testimonios',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonios Relacionados',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }]
    }),
    defineField({
      name: 'relatedProjectsTitle',
      title: 'Título Proyectos Relacionados',
      type: 'string',
      group: 'content',
      initialValue: 'Proyectos Relacionados'
    }),
    defineField({ name: 'relatedProjectsHighlight', title: 'Palabra Destacada Proyectos (Cursiva)', type: 'string', group: 'content' }),
    defineField({
      name: 'relatedProjectsDescription',
      title: 'Descripción Proyectos Relacionados',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Proyectos Relacionados',
      type: 'array',
      group: 'content',
      description: 'Selecciona proyectos que se mostrarán en la landing de este servicio. Si se deja vacío, se mostrarán automáticamente los 3 últimos proyectos.',
      of: [{ type: 'reference', to: [{ type: 'project' }] }]
    }),
    defineField({
      name: 'featuresTitle',
      title: 'Título de Características',
      type: 'string',
      group: 'content',
      initialValue: 'Características'
    }),
    defineField({ name: 'featuresHighlight', title: 'Palabra Destacada Características (Cursiva)', type: 'string', group: 'content' }),
    defineField({
        name: 'featuresDescription',
        title: 'Descripción Sección Características',
        type: 'text',
        rows: 2,
        group: 'content',
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
    defineField({ name: 'processHighlight', title: 'Palabra Destacada Proceso (Cursiva)', type: 'string', group: 'content' }),
    defineField({
        name: 'processDescription',
        title: 'Descripción Sección Proceso',
        type: 'text',
        rows: 2,
        group: 'content',
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
            ]
        }]
    }),
    defineField({
        name: 'techTitle',
        title: 'Título Stack Tecnológico',
        type: 'string',
        group: 'content',
        initialValue: 'Stack Tecnológico'
    }),
    defineField({ name: 'techHighlight', title: 'Palabra Destacada Tech (Cursiva)', type: 'string', group: 'content' }),
    defineField({
        name: 'techDescription',
        title: 'Descripción Stack Tecnológico',
        type: 'text',
        rows: 2,
        group: 'content',
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
        name: 'pricing',
        title: 'Sección de Precios',
        type: 'object',
        group: 'content',
        fields: [
            defineField({ name: 'title', title: 'Título Principal', type: 'string', initialValue: "Pricing that's so simple." }),
            defineField({ name: 'subtitle', title: 'Subtítulo', type: 'string', initialValue: "We like to keep things simple with one, limitless plan." }),
            
            // Reemplazamos los campos inline por una referencia a los planes
            defineField({
                name: 'plans',
                title: 'Planes de Precios',
                description: 'Selecciona los planes que se mostrarán en esta página (Máx 3 recomendados).',
                type: 'array',
                of: [{ type: 'reference', to: [{ type: 'pricingPlan' }] }]
            }),

            defineField({ name: 'trustedCompaniesTitle', title: 'Título Sección Logos', type: 'string', initialValue: "Designs trusted by companies like:" }),
            defineField({
                name: 'trustedLogos',
                title: 'Logos de Confianza (Sección Precios)',
                type: 'array',
                of: [
                    {
                        type: 'object',
                        fields: [
                            defineField({ name: 'image', title: 'Logo', type: 'image' }),
                            defineField({ name: 'name', title: 'Nombre Empresa (Alt)', type: 'string' })
                        ],
                        preview: {
                            select: {
                                title: 'name',
                                media: 'image'
                            }
                        }
                    }
                ]
            })
        ]
    }),
    defineField({
        name: 'faqTitle',
        title: 'Título Sección FAQ',
        type: 'string',
        group: 'content',
        initialValue: 'Preguntas Frecuentes'
    }),
    defineField({ name: 'faqHighlight', title: 'Palabra Destacada FAQ (Cursiva)', type: 'string', group: 'content' }),
    defineField({
        name: 'faqDescription',
        title: 'Descripción Sección FAQ',
        type: 'text',
        rows: 2,
        group: 'content',
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

    defineField({
        name: 'ctaSection',
        title: 'Sección CTA Final',
        type: 'object',
        group: 'content',
        fields: [
            defineField({ name: 'title', title: 'Título', type: 'string', initialValue: '¿Listo para comenzar?' }),
            defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2, initialValue: 'Agenda una llamada estratégica con nuestro equipo y descubre cómo podemos transformar tu negocio.' }),
            defineField({ name: 'buttonText', title: 'Texto Botón Principal', type: 'string', initialValue: 'Agendar Llamada' }),
            defineField({ name: 'buttonLink', title: 'Enlace Botón Principal', type: 'string' }),
            defineField({ name: 'secondaryButtonText', title: 'Texto Botón Secundario', type: 'string', initialValue: 'Ver Portfolio' }),
            defineField({ name: 'secondaryButtonLink', title: 'Enlace Botón Secundario', type: 'string' }),
        ]
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
    defineField({
      name: 'seoImage',
      title: 'SEO Image (OG / Twitter)',
      type: 'image',
      group: 'seo',
      description: 'Imagen específica para compartir en redes sociales (1200x630). Si se deja vacío, usa la imagen principal del servicio.'
    }),
  ],
})
