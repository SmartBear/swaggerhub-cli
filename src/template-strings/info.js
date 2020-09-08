const { wrapTemplates } = require('../utils/general')

const infoMsg = {
  ApiCreate: 'Created API \'{{owner}}/{{name}}\'',

  createdApiVersion: 'Created version {{version}} of API \'{{owner}}/{{name}}\'',

  ApiPublish: 'Published API {{apiPath}}',

  DomainPublish: 'Published domain {{requestedDomainPath}}',

  ApiSetdefault: 'Default version of {{owner}}/{{name}} set to {{version}}',

  ApiUpdate: 'Updated API {{owner}}/{{name}}/{{version}}',

  ApiUnpublish: 'Unpublished API {{apiPath}}',

  DomainUnpublish: 'Unpublished domain {{requestedDomainPath}}',

  Configure: 'Saved config to {{configFilePath}}'
}

module.exports = wrapTemplates({
  ...infoMsg
})