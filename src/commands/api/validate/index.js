const { Args } = require('@oclif/core')
const BaseValidateCommand = require('../../../support/command/base-validate-command')
const { getApiIdentifierArg } = require('../../../support/command/parse-input')
const { getApi } = require('../../../requests/api')
const { pipeAsync } = require('../../../utils/general')
const { getResponseContent } = require('../../../support/command/handle-response')
const { isOnPrem } = require('../../../support/isOnPrem')

class ValidateCommand extends BaseValidateCommand {
  async run() {
    const { args, flags } = await this.parse(ValidateCommand)
    const apiPath = getApiIdentifierArg(args)
    const validPath = await this.ensureVersion(apiPath)
    await this.checkApiExists(validPath)
    // eslint-disable-next-line immutable/no-let
    let validationResult = await this.getValidationResult(validPath)
    // Required to support On-Prem 2.4.1
    if (validationResult.validation.length === 0 && isOnPrem()) {
      validationResult = await this.getFallbackValidationResult(validPath)
    }
    this.printValidationOutput(flags, validationResult)
    this.exitWithCode(flags, validationResult)
  }

  checkApiExists(apiPath) {
    return this.executeHttp({
      execute: () => getApi([apiPath]),
      options: { resolveStatus: [200] }
    })
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

ValidateCommand.description = `Get validation result for an API version
When VERSION is not included in the argument, the default version will be validated.
An error will occur if the API version does not exist.
If the flag \`-c\` or \`--failOnCritical\` is used and there are standardization
errors with \`Critical\` severity present, the command will exit with error code \`1\`.
`

ValidateCommand.examples = [
  'swaggerhub api:validate organization/api/1.0.0',
  'swaggerhub api:validate -c -j organization/api/1.0.0',
  'swaggerhub api:validate --fail-on-critical --json organization/api'
]

ValidateCommand.args = {
  'OWNER/API_NAME/[VERSION]': Args.string({
    required: true,
    description: 'API to fetch validation errors for from Swaggerhub'
  })
}

ValidateCommand.flags = {
  ...BaseValidateCommand.flags
}
module.exports = ValidateCommand