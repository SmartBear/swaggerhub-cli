const { wrapTemplates } = require('../utils/general')

const errorMsg = {
  ApiCreate: 'API version \'{{owner}}/{{name}}/{{version}}\' already exists in SwaggerHub',

  Configure: 'Failed to write config to {{configFilePath}}',

  argsMustMatchFormat: 'Argument must match {{format}} format',

  cannotParseDefinition: 'There was a problem with parsing {{fileName}}. Ensure the definition is valid. {{e}}',

  cannotParseOasVersion: 'Cannot determine OAS version from file',

  cannotParseVersion: 'Cannot determine version from file',

  noContentField: 'No content field provided',

  fileIsEmpty: 'File \'{{fileName}}\' is empty',

  fileNotFound: 'File \'{{fileName}}\' not found',

  upgradePlan: 'You may need to upgrade your current plan.',

  unknown: 'Unknown Error',

  failedToFindJsonPointer: "Failed to find JSON Pointer '{{jsonPointer}}' in defintion '{{fileName}}'"
}

module.exports = wrapTemplates({
  ...errorMsg
})
