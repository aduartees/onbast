import { type SchemaTypeDefinition } from 'sanity'
import service from './service'
import project from './project'
import teamMember from './teamMember'
import testimonial from './testimonial'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [service, project, teamMember, testimonial],
}
