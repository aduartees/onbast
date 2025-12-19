import { type SchemaTypeDefinition } from 'sanity'
import service from './service'
import project from './project'
import teamMember from './teamMember'
import testimonial from './testimonial'
import settings from './settings'
import homePage from './homePage'
import agencyPage from './agencyPage'
import projectsPage from './projectsPage'
import servicesPage from './servicesPage'
import contactPage from './contactPage'
import location from './location'
import serviceLocation from './serviceLocation'
import pricingPlan from './pricingPlan'
import pricingAddon from './pricingAddon'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Core Content
    service, 
    project, 
    teamMember, 
    testimonial, 
    settings,
    
    // Pages
    homePage, 
    agencyPage, 
    projectsPage, 
    servicesPage, 
    contactPage,

    // GEO Strategy & Commercial
    location,
    serviceLocation,
    pricingPlan,
    pricingAddon
  ],
}
