import { type SchemaTypeDefinition } from 'sanity'
import service from './service'
import project from './project'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [service, project],
}
