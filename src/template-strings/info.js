const { wrapTemplates } = require('../utils/general')

const infoMsg = {
  ApiCreate: 'Created API \'{{owner}}/{{name}}\'',

  ApiDelete: 'Deleted API \'{{owner}}/{{name}}\'',

  DomainCreate: 'Created domain \'{{owner}}/{{name}}\'',

  DomainDelete: 'Deleted domain \'{{owner}}/{{name}}\'',

  createdApiVersion: 'Created version {{version}} of API \'{{owner}}/{{name}}\'',

  createdDomainVersion: 'Created version {{version}} of domain \'{{owner}}/{{name}}\'',

  deletedVersion: 'Deleted version {{version}} of {{type}} \'{{owner}}/{{name}}\'',

  published: 'Published {{type}} {{path}}',

  unpublished: 'Unpublished {{type}} {{path}}',

  setDefault: 'Default version of {{owner}}/{{name}} set to {{version}}',

  ApiUpdate: 'Updated API {{owner}}/{{name}}/{{version}}',

  DomainUpdate: 'Updated domain {{owner}}/{{name}}/{{version}}',

  ApiUpdateVisibility: 'Updated API {{owner}}/{{name}}/{{version}} and visibility is set to {{visibility}}',

  DomainUpdateVisibility: 'Updated domain {{owner}}/{{name}}/{{version}} and visibility is set to {{visibility}}',

  visibilityUpdate: 'Updated visibility of {{owner}}/{{name}}/{{version}} to {{visibility}}',

  ApiUnpublish: 'Unpublished API {{apiPath}}',

  DomainUnpublish: 'Unpublished domain {{domainPath}}',

  IntegrationCreate: 'Created integration on API \'{{apiPath}}\'',

  IntegrationDelete: 'Deleted integration \'{{integrationId}}\' from API \'{{apiPath}}\'',
  
  IntegrationExecute: 'Executed integration \'{{integrationId}}\' on API \'{{apiPath}}\'',
  
  IntegrationUpdate: 'Updated integration \'{{integrationId}}\' on API \'{{apiPath}}\'',

  Configure: 'Saved config to {{configFilePath}}',

  ProjectCreate: 'Created project \'{{owner}}/{{projectName}}\'',

  ProjectUpdate: 'Updated project \'{{owner}}/{{projectName}}\'',

  ProjectApiAdd: 'Added api \'{{apiName}}\' to project \'{{projectPath}}\'',

  ProjectApiRemove: 'Removed api \'{{apiName}}\' from project \'{{projectPath}}\'',

  ProjectDomainAdd: 'Added domain \'{{domainName}}\' to project \'{{projectPath}}\'',

  ProjectDomainRemove: 'Removed domain \'{{domainName}}\' from project \'{{projectPath}}\'',

  ProjectDelete: 'Deleted project \'{{projectPath}}\''

}

module.exports = wrapTemplates({
  ...infoMsg
})
