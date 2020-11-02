const { wrapTemplates } = require('../utils/general')

const infoMsg = {
  ApiCreate: 'Created API \'{{owner}}/{{name}}\'',

  createdApiVersion: 'Created version {{version}} of API \'{{owner}}/{{name}}\'',

  ApiPublish: 'Published API {{apiPath}}',

  DomainPublish: 'Published domain {{domainPath}}',

  ApiSetdefault: 'Default version of {{owner}}/{{name}} set to {{version}}',

  ApiUpdate: 'Updated API {{owner}}/{{name}}/{{version}} and visibility is set to {{visibility}}',

  visibilityUpdate: 'Updated visibility of API {{owner}}/{{name}}/{{version}} to {{visibility}}',

  ApiUnpublish: 'Unpublished API {{apiPath}}',

  DomainUnpublish: 'Unpublished domain {{domainPath}}',

  IntegrationCreate: 'Created integration on API \'{{apiPath}}\'',

  Configure: 'Saved config to {{configFilePath}}'
}

module.exports = wrapTemplates({
  ...infoMsg
})
