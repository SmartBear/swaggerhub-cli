const { wrapTemplates } = require('../utils/general')

const infoMsg = {
  createdApi: 'Created API \'{{owner}}/{{name}}\'',

  createdApiVersion: 'Created version {{version}} of API \'{{owner}}/{{name}}\'',

  publishedApiVersion: 'Published API {{apiPath}}',

  publishedDomainVersion: 'Published domain {{requestedDomainPath}}',

  setDefaultApi: 'Default version of {{owner}}/{{name}} set to {{version}}',

  updatedApiVersion: 'Updated API \'{{owner}}/{{name}}/{{version}}\'',

  unpublishedApiVersion: 'Unpublished API {{apiPath}}',

  unpublishedDomainVersion: 'Unpublished domain {{requestedDomainPath}}',
}

module.exports = wrapTemplates({
  ...infoMsg
})