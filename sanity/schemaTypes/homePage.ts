import { defineField, defineType } from 'sanity'

const sectionFields = [
  defineField({
    name: 'pill',
    title: 'Píldora Luminosa (Badge)',
    type: 'string',
    description: 'Texto pequeño sobre el título (Ej: Nuestra Esencia)',
  }),
  defineField({
    name: 'title',
    title: 'Título Principal',
    type: 'string',
    validation: Rule => Rule.required(),
  }),
  defineField({
    name: 'highlight',
    title: 'Palabra Destacada (Cursiva)',
    type: 'string',
    description: 'Palabra exacta del título que se pondrá en cursiva y con estilo diferente.',
  }),
  defineField({
    name: 'description',
    title: 'Descripción',
    type: 'text',
    rows: 3,
  }),
]

export default defineType({
  name: 'homePage',
  title: 'Página de Inicio',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Sección Hero',
      type: 'object',
      fields: [
         defineField({ name: 'title', title: 'Título Principal', type: 'string' }),
         defineField({ name: 'subtitle', title: 'Subtítulo', type: 'string' }),
         defineField({ name: 'buttonText', title: 'Texto Botón Principal', type: 'string' }),
         defineField({ name: 'secondaryButtonText', title: 'Texto Botón Secundario', type: 'string' }),
      ]
    }),
    defineField({
      name: 'philosophy',
      title: 'Sección Filosofía',
      type: 'object',
      fields: sectionFields,
    }),
    defineField({
      name: 'techArsenal',
      title: 'Sección Arsenal Tecnológico',
      type: 'object',
      fields: sectionFields,
    }),
    defineField({
      name: 'services',
      title: 'Sección Servicios',
      type: 'object',
      fields: sectionFields,
    }),
    defineField({
      name: 'projects',
      title: 'Sección Proyectos',
      type: 'object',
      fields: sectionFields,
    }),
    defineField({
      name: 'contact',
      title: 'Sección Contacto',
      type: 'object',
      fields: sectionFields,
    }),
  ],
})
