const BaseCommand = require('../../support/command/base-command')
const { getApiIdentifierArg } = require('../../support/command/parse-input')
const { getApi } = require('../../requests/api')
const { pipeAsync } = require('../../utils/general')
const { getResponseContent } = require('../../support/command/handle-response')

class ValidateCommand extends BaseCommand {
  async run() {
    const { args } = this.parse(ValidateCommand)
    const apiPath = getApiIdentifierArg(args)
    const validPath = await this.ensureVersion(apiPath)
    const validationResult = await this.getValidationResult(validPath)
    // eslint-disable-next-line immutable/no-let
    let hasCritical = false
    const validationResultsStr = validationResult.validation
          .map(err => {
            if (err.severity === 'CRITICAL') hasCritical = true
            return `${err.line}: \t${err.severity} \t${err.description}`
          })
          .join('\n')
    if (validationResult.validation.length) {
      this.log('line \tseverity \tdescription\n')
    }
    this.log(validationResultsStr)
    
    if (hasCritical) this.exit(1)
    this.exit(0)
  }

  getValidationResult(apiPath) {
    return this.executeHttp({
      execute: () => getApi([apiPath, 'validation']),
      onResolve: pipeAsync(getResponseContent, JSON.parse),
      options: {}
    })
  }
}

ValidateCommand.description = `get validation result for an API version
When VERSION is not included in the argument, the default version will be validated.
An error will occur if the API version does not exist.
`

ValidateCommand.examples = [
  'swaggerhub api:validate organization/api/1.0.0',
  'swaggerhub api:validate organization/api'
]

ValidateCommand.args = [{
  name: 'OWNER/API_NAME/[VERSION]',
  required: true,
  description: 'API Identifier'
}]

ValidateCommand.flags = BaseCommand.flags

module.exports = ValidateCommand