const { Args, Flags } = require('@oclif/core')
const BaseCommand = require('../../support/command/base-command')
const { getApiIdentifierArg } = require('../../support/command/parse-input')
const { getApi } = require('../../requests/api')
const { pipeAsync } = require('../../utils/general')
const { getResponseContent } = require('../../support/command/handle-response')

class ValidateCommand extends BaseCommand {
  async run() {
    const { args, flags } = await this.parse(ValidateCommand)
    const apiPath = getApiIdentifierArg(args)
    const validPath = await this.ensureVersion(apiPath)
    const validationResult = await this.getValidationResult(validPath)
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
      onReject: () => this.getFallbackValidationResult(apiPath),
      options: {}
    })
  }

  /* Required to support older on-prem installations */
  getFallbackValidationResult(apiPath) {
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
If the flag \`-c\` or \`--failOnCritical\` is used and there are standardization
errors with \`Critical\` severity present, the command will exit with error code \`1\`.
`

ValidateCommand.examples = [
  'swaggerhub api:validate organization/api/1.0.0',
  'swaggerhub api:validate -c organization/api/1.0.0',
  'swaggerhub api:validate --fail-on-critical organization/api'
]

ValidateCommand.args = {
  'OWNER/API_NAME/[VERSION]': Args.string({
    required: true,
    description: 'API to fetch validation errors for from Swaggerhub'
  })
}

ValidateCommand.flags = {
  'fail-on-critical': Flags.boolean({
    char: 'c', 
    description: 'Exit with error code 1 if there are critical standardization errors present',
    default: false
  }),
  ...BaseCommand.flags
}
module.exports = ValidateCommand