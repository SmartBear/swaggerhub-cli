const { wrapTemplates } = require('../utils/general')

const infoMsg = {
  ApiCreate: 'Created API \'{{owner}}/{{name}}\'',

  DomainCreate: 'Created domain \'{{owner}}/{{name}}\'',

  createdApiVersion: 'Created version {{version}} of API \'{{owner}}/{{name}}\'',

  createdDomainVersion: 'Created version {{version}} of domain \'{{owner}}/{{name}}\'',

  published: 'Published {{type}} {{path}}',

  setDefault: 'Default version of {{owner}}/{{name}} set to {{version}}',

  ApiUpdate: 'Updated API {{owner}}/{{name}}/{{version}} and visibility is set to {{visibility}}',

  visibilityUpdate: 'Updated visibility of API {{owner}}/{{name}}/{{version}} to {{visibility}}',

  ApiUnpublish: 'Unpublished API {{apiPath}}',

  DomainUnpublish: 'Unpublished domain {{domainPath}}',

  IntegrationCreate: 'Created integration on API \'{{apiPath}}\'',

  IntegrationExecute: 'Executed integration \'{{integrationId}}\' on API \'{{apiPath}}\'',
  
  IntegrationUpdate: 'Updated integration \'{{integrationId}}\' on API \'{{apiPath}}\'',

  Configure: 'Saved config to {{configFilePath}}'
}

module.exports = wrapTemplates({
  ...infoMsg
})
