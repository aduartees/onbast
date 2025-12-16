import { type SchemaTypeDefinition } from 'sanity'
import service from './service'
import project from './project'
import teamMember from './teamMember'
import testimonial from './testimonial'
import settings from './settings'
import homePage from './homePage'
import agencyPage from './agencyPage'
import projectsPage from './projectsPage'
import contactPage from './contactPage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [service, project, teamMember, testimonial, settings, homePage, agencyPage, projectsPage, contactPage],
}
