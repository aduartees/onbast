import type {StructureBuilder} from 'sanity/structure'

// Helper function to create a singleton list item
const singletonListItem = (S: StructureBuilder, typeName: string, title: string) =>
  S.listItem()
    .title(title)
    .id(typeName)
    .child(
      S.document()
        .schemaType(typeName)
        .documentId(typeName)
    )

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenido')
    .items([
      // 1. Configuración Global
      S.listItem()
        .title('Configuración Global')
        .child(
          S.document()
            .schemaType('settings')
            .documentId('settings')
        ),
      
      S.divider(),

      // 2. Páginas Principales (Singletons)
      S.listItem()
        .title('Páginas')
        .child(
          S.list()
            .title('Páginas del Sitio')
            .items([
              singletonListItem(S, 'homePage', 'Inicio (Home)'),
              singletonListItem(S, 'agencyPage', 'Agencia'),
              singletonListItem(S, 'servicesPage', 'Servicios (Landing)'),
              singletonListItem(S, 'projectsPage', 'Proyectos (Landing)'),
              singletonListItem(S, 'contactPage', 'Contacto'),
            ])
        ),

      S.divider(),

      // 3. Colecciones de Contenido
      S.documentTypeListItem('service').title('Servicios Individuales'),
      S.documentTypeListItem('project').title('Proyectos'),
      
      S.divider(),
      
      S.documentTypeListItem('teamMember').title('Equipo'),
      S.documentTypeListItem('testimonial').title('Testimonios'),
    ])
