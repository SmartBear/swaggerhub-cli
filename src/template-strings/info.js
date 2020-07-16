const { wrapTemplates } = require('../utils/general')

const infoMsg = {
  createdApi: 'Created API \'{{owner}}/{{name}}\'',
  createdApiVersion: 'Created version {{version}} of API \'{{owner}}/{{name}}\'',
  updatedApiVersion: 'Updated API \'{{owner}}/{{name}}/{{version}}\'',
  publishedApiVersion: 'Published API {{identifier}}',
  unpublishedApiVersion: 'Unpublished API {{identifier}}',
  setDefaultApi: 'Default version of {{owner}}/{{name}} set to {{version}}',
  publishedDomainVersion: 'Published domain {{identifier}}',
  unpublishedDomainVersion: 'Unpublished domain {{identifier}}',
}

module.exports = wrapTemplates({
  ...infoMsg
})