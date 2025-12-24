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
              S.divider(),
              singletonListItem(S, 'privacyPolicyPage', 'Política de Privacidad'),
              singletonListItem(S, 'legalNoticePage', 'Aviso Legal'),
              singletonListItem(S, 'cookiesPage', 'Política de Cookies'),
              singletonListItem(S, 'termsOfServicePage', 'Condiciones del Servicio'),
            ])
        ),

      S.divider(),

      // 3. Colecciones de Contenido
      S.documentTypeListItem('service').title('Servicios Individuales'),
      S.documentTypeListItem('project').title('Proyectos'),
      
      S.divider(),
      
      // 4. Estrategia GEO & Comercial (NUEVO)
      S.listItem()
        .title('Estrategia GEO & Comercial')
        .child(
          S.list()
            .title('Gestión de Expansión')
            .items([
              // Agrupación de Ubicaciones
              S.listItem()
                .title('📍 Ubicaciones')
                .child(
                  S.list()
                    .title('Filtrar por Tipo')
                    .items([
                      S.listItem()
                        .title('🏙️ Ciudades Principales')
                        .child(
                          S.documentList()
                            .title('Ciudades Principales')
                            .filter('_type == "location" && type == "city"')
                        ),
                      S.listItem()
                        .title('🏘️ Pueblos y Municipios')
                        .child(
                          S.documentList()
                            .title('Pueblos y Municipios')
                            .filter('_type == "location" && type == "town"')
                        ),
                      S.divider(),
                      S.listItem()
                        .title('Ver Todas')
                        .child(S.documentTypeList('location').title('Todas las Ubicaciones')),
                    ])
                ),
              S.documentTypeListItem('serviceLocation').title('🚀 Landings Locales (Overrides)'),
              S.divider(),
              S.documentTypeListItem('pricingPlan').title('💰 Planes de Precio'),
            ])
        ),

      S.divider(),
      
      S.documentTypeListItem('teamMember').title('Equipo'),
      S.documentTypeListItem('testimonial').title('Testimonios'),
    ])
