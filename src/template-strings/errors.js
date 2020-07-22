const { wrapTemplates } = require('../utils/general')

const errorMsg = {
  apiVersionExists: 'API version \'{{owner}}/{{name}}/{{versionToCreate}}\' already exists in SwaggerHub',
  argsMustMatchFormat: 'Argument must match {{format}} format',
  upgradePlan: 'You may need to upgrade your current plan.',
  noContentField: 'No content field provided',
  unknown: 'Unknown Error',
  cannotParseOasVersion: 'Cannot determine OAS version from file',
  cannotParseVersion: 'Cannot determine version from file',
  fileNotFound: 'File \'{{fileName}}\' not found',
  fileIsEmpty: 'File \'{{fileName}}\' is empty',
  cannotParseDefinition: 'There was a problem with parsing {{fileName}}. Ensure the definition is valid. {{e}}'
}

module.exports = wrapTemplates({
  ...errorMsg
})