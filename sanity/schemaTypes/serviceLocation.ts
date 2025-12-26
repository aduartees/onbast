import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'serviceLocation',
  title: 'Landing Local (Override)',
  type: 'document',
  fields: [
    // --- RELACIONES CLAVE ---
    defineField({
      name: 'service',
      title: 'Servicio Base',
      type: 'reference',
      to: [{ type: 'service' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'reference',
      to: [{ type: 'location' }],
      validation: (Rule) => Rule.required(),
    }),

    // --- SEO OVERRIDES ---
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (Optimizado Local)',
      type: 'string',
      group: 'seo',
      description: 'Ej: Diseño Web en Getafe | Agencias Expertas...',
      validation: (Rule) => Rule.required().max(70).warning('Lo ideal es menos de 60 caracteres'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.required().max(160).warning('Lo ideal es menos de 160 caracteres'),
    }),

    // --- CONTENT OVERRIDES (HERO & INTRO) ---
    defineField({
      name: 'heroHeadline',
      title: 'H1 Localizado',
      type: 'string',
      group: 'content',
      description: 'Titular H1 específico. Ej: "Tu Socio Tecnológico en Getafe"',
    }),
    defineField({
      name: 'heroText',
      title: 'Intro Localizada',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Bajada del H1 adaptada.',
    }),

    defineField({
      name: 'heroButtonText',
      title: 'Hero Button Text (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heroButtonLink',
      title: 'Hero Button Link (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heroSecondaryButtonText',
      title: 'Hero Secondary Button Text (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heroSecondaryButtonLink',
      title: 'Hero Secondary Button Link (Override)',
      type: 'string',
      group: 'content',
    }),

    defineField({
      name: 'longDescription',
      title: 'Long Description (Override)',
      type: 'text',
      rows: 6,
      group: 'content',
    }),
    defineField({
      name: 'overviewText',
      title: 'Overview Text (Override)',
      type: 'text',
      rows: 4,
      group: 'content',
    }),

    defineField({
      name: 'featuresTitle',
      title: 'Features Title (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'featuresHighlight',
      title: 'Features Highlight (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'featuresDescription',
      title: 'Features Description (Override)',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits (Override)',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
    }),

    defineField({
      name: 'processTitle',
      title: 'Process Title (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'processHighlight',
      title: 'Process Highlight (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'processDescription',
      title: 'Process Description (Override)',
      type: 'text',
      rows: 3,
      group: 'content',
    }),

    defineField({
      name: 'techTitle',
      title: 'Tech Title (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'techHighlight',
      title: 'Tech Highlight (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'techDescription',
      title: 'Tech Description (Override)',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies (Override)',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
    }),

    defineField({
      name: 'impactSection',
      title: 'Impact Section (Override)',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'highlight', title: 'Highlight', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtítulo', type: 'text', rows: 2 }),
        defineField({
          name: 'stats',
          title: 'Stats',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'value', title: 'Value', type: 'number' }),
                defineField({ name: 'prefix', title: 'Prefix', type: 'string' }),
                defineField({ name: 'suffix', title: 'Suffix', type: 'string' }),
                defineField({ name: 'label', title: 'Label', type: 'string' }),
                defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
              ],
            },
          ],
        }),
      ],
    }),

    defineField({
      name: 'pricingTitle',
      title: 'Pricing Title (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'pricingSubtitle',
      title: 'Pricing Subtitle (Override)',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'pricingTrustedCompaniesTitle',
      title: 'Pricing Trusted Companies Title (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'pricingSchemaAdditionalProperty',
      title: 'Pricing Schema additionalProperty (Override)',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'value', title: 'Value', type: 'text', rows: 3 }),
          ],
        },
      ],
    }),

    defineField({
      name: 'teamTitle',
      title: 'Team Title (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'teamHighlight',
      title: 'Team Highlight (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'teamDescription',
      title: 'Team Description (Override)',
      type: 'text',
      rows: 3,
      group: 'content',
    }),

    defineField({
      name: 'testimonialsTitle',
      title: 'Testimonials Title (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'testimonialsHighlight',
      title: 'Testimonials Highlight (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'testimonialsDescription',
      title: 'Testimonials Description (Override)',
      type: 'text',
      rows: 3,
      group: 'content',
    }),

    defineField({
      name: 'relatedProjectsTitle',
      title: 'Related Projects Title (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'relatedProjectsHighlight',
      title: 'Related Projects Highlight (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'relatedProjectsDescription',
      title: 'Related Projects Description (Override)',
      type: 'text',
      rows: 3,
      group: 'content',
    }),

    defineField({
      name: 'faqTitle',
      title: 'FAQ Title (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'faqHighlight',
      title: 'FAQ Highlight (Override)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'faqDescription',
      title: 'FAQ Description (Override)',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    
    // --- BLOQUE DE CONTENIDO SEO DENSO ---
    defineField({
      name: 'localContentBlock',
      title: 'Contenido SEO Local (Denso)',
      type: 'array',
      group: 'content',
      description: 'Texto rico generado por IA sobre la economía local y el servicio.',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt',
              type: 'string',
            }),
          ],
        }
      ]
    }),

    // --- SECCIONES LOCALIZADAS (GENERADAS POR IA) ---
    defineField({
      name: 'customFeatures',
      title: 'Features Localizadas',
      type: 'array',
      group: 'content',
      description: 'Adaptación local de las características.',
      of: [{ 
        type: 'object',
        fields: [
          { name: 'title', type: 'string', title: 'Título' },
          { name: 'description', type: 'text', rows: 2, title: 'Descripción' },
          { name: 'icon', type: 'string', title: 'Icono (Lucide)' }
        ]
      }]
    }),
    defineField({
      name: 'customProcess',
      title: 'Proceso Localizado',
      type: 'array',
      group: 'content',
      description: 'Adaptación local del proceso.',
      of: [{ 
        type: 'object',
        fields: [
          { name: 'title', type: 'string', title: 'Título' },
          { name: 'description', type: 'text', rows: 2, title: 'Descripción' }
        ]
      }]
    }),
    defineField({
      name: 'customFaqs',
      title: 'FAQs Localizadas',
      type: 'array',
      group: 'content',
      description: 'Preguntas frecuentes adaptadas a la zona.',
      of: [{ 
        type: 'object',
        fields: [
          { name: 'question', type: 'string', title: 'Pregunta' },
          { name: 'answer', type: 'text', rows: 3, title: 'Respuesta' }
        ]
      }]
    }),

    // --- RELACIONES LOCALES ---
    defineField({
      name: 'customTestimonials',
      title: 'Testimonios Locales (Opcional)',
      type: 'array',
      group: 'content',
      description: 'Si se deja vacío, se usarán los del servicio padre con lógica de adaptación.',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }]
    }),
    defineField({
      name: 'customProjects',
      title: 'Proyectos Destacados (Opcional)',
      type: 'array',
      group: 'content',
      description: 'Si se deja vacío, se mostrarán automáticamente los últimos 3 proyectos del servicio.',
      of: [{ type: 'reference', to: [{ type: 'project' }] }]
    }),

    defineField({
      name: 'ctaSection',
      title: 'CTA Local (Override)',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
        defineField({ name: 'buttonText', title: 'Texto Botón', type: 'string' }),
        defineField({ name: 'buttonLink', title: 'Enlace Botón', type: 'string' }),
        defineField({ name: 'secondaryButtonText', title: 'Texto Botón Secundario', type: 'string' }),
        defineField({ name: 'secondaryButtonLink', title: 'Enlace Botón Secundario', type: 'string' }),
      ],
    })
  ],
  groups: [
    { name: 'content', title: 'Contenido Local' },
    { name: 'seo', title: 'SEO Local' },
  ],
  preview: {
    select: {
      service: 'service.title',
      location: 'location.name',
      type: 'location.type'
    },
    prepare({ service, location, type }) {
      const emoji = type === 'city' ? '🏙️' : '🏘️';
      return {
        title: `${service} en ${location}`,
        subtitle: `Landing Local ${emoji}`
      }
    }
  }
})
