const { wrapTemplates } = require('../utils/general')

const errorMsg = {
  ApiCreate: 'API version \'{{owner}}/{{name}}/{{version}}\' already exists in SwaggerHub',

  DomainCreate: 'Domain version \'{{owner}}/{{name}}/{{version}}\' already exists in SwaggerHub',

  Configure: 'Failed to write config to {{configFilePath}}',

  argsMustMatchFormat: 'Argument must match {{format}} format',

  cannotParseDefinition: 'There was a problem with parsing {{filename}}. \nReason: {{e}}',

  cannotParseSpecification: 'Cannot determine specification from file',

  cannotParseVersion: 'Cannot determine version from file',

  noContentField: 'No content field provided',

  fileIsEmpty: 'File \'{{filename}}\' is empty',

  fileNotFound: 'File \'{{filename}}\' not found',

  invalidConfig: 'Invalid configuration file. Please ensure that the file is in JSON format',

  directoryExists: 'Directory already exists: \'{{directory}}\'',

  unknown: 'Unknown Error',
}

module.exports = wrapTemplates({
  ...errorMsg
})
