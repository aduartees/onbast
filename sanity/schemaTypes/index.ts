import { type SchemaTypeDefinition } from 'sanity'
import service from './service'
import project from './project'
import teamMember from './teamMember'
import testimonial from './testimonial'
import settings from './settings'
import homePage from './homePage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [service, project, teamMember, testimonial, settings, homePage],
}
