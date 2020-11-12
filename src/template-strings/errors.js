const { wrapTemplates } = require('../utils/general')

const errorMsg = {
  ApiCreate: 'API version \'{{owner}}/{{name}}/{{version}}\' already exists in SwaggerHub',

  Configure: 'Failed to write config to {{configFilePath}}',

  argsMustMatchFormat: 'Argument must match {{format}} format',

  cannotParseDefinition: 'There was a problem with parsing {{filename}}. Ensure the definition is valid. {{e}}',

  cannotParseOasVersion: 'Cannot determine OAS version from file',

  cannotParseVersion: 'Cannot determine version from file',

  noContentField: 'No content field provided',

  fileIsEmpty: 'File \'{{filename}}\' is empty',

  fileNotFound: 'File \'{{filename}}\' not found',

  invalidConfig: 'Invalid configuration file. Please ensure that the file is in JSON format',

  unknown: 'Unknown Error',
}

module.exports = wrapTemplates({
  ...errorMsg
})
