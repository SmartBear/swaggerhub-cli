const { flags } = require('@oclif/command')
const BaseCommand = require('../../support/command/base-command')
const { getApiIdentifierArg } = require('../../support/command/parse-input')
const { getApi } = require('../../requests/api')
const { pipeAsync } = require('../../utils/general')
const { getResponseContent } = require('../../support/command/handle-response')
const { isOnPrem } = require('../../support/isOnPrem')

class ValidateCommand extends BaseCommand {
  async run() {
    const { args, flags } = this.parse(ValidateCommand)
    const apiPath = getApiIdentifierArg(args)
    const validPath = await this.ensureVersion(apiPath)
    // eslint-disable-next-line immutable/no-let
    let validationResult = await this.getValidationResult(validPath)
    // Required to support On-Prem 2.4.1
    if (validationResult.validation.length === 0 && isOnPrem()) {
      validationResult = await this.getFallbackValidationResult(validPath)
    }
    // eslint-disable-next-line immutable/no-let
    let hasCritical = false
    const validationResultsStr = validationResult.validation
          .map(err => {
            if (err.severity.toUpperCase() === 'CRITICAL') hasCritical = true
            return `${err.line}: \t${err.severity} \t${err.description}`
          })
          .join('\n')
    if (validationResult.validation.length) {
      this.log('line \tseverity \tdescription\n')
    }
    this.log(validationResultsStr)
    
    if (hasCritical && flags['fail-on-critical']) this.exit(1)
    this.exit(0)
  }

  getValidationResult(apiPath) {
    return this.executeHttp({
      execute: () => getApi([apiPath, 'standardization']),
      onResolve: pipeAsync(getResponseContent, JSON.parse),
      onReject: () => ({ validation: [] }),
      options: {}
    })
  }

  /* Required to support older on-prem installations */
  getFallbackValidationResult(apiPath) {
    return this.executeHttp({
      execute: () => getApi([apiPath, 'validation']),
      onResolve: pipeAsync(getResponseContent, JSON.parse),
      onReject: () => ({ validation: [] }),
      options: {}
    })
  }

}

ValidateCommand.description = `get validation result for an API version
When VERSION is not included in the argument, the default version will be validated.
An error will occur if the API version does not exist.
If the flag \`-c\` or \`--failOnCritical\` is used and there are standardization
errors with \`Critical\` severity present, the command will exit with error code \`1\`.
`

ValidateCommand.examples = [
  'swaggerhub api:validate organization/api/1.0.0',
  'swaggerhub api:validate -c organization/api/1.0.0',
  'swaggerhub api:validate --fail-on-critical organization/api'
]

ValidateCommand.args = [{
  name: 'OWNER/API_NAME/[VERSION]',
  required: true,
  description: 'API Identifier'
}]

ValidateCommand.flags = {
  'fail-on-critical': flags.boolean({
    char: 'c', 
    description: 'Exit with error code 1 if there are critical standardization errors present',
    default: false
  }),
  ...BaseCommand.flags
}
module.exports = ValidateCommand