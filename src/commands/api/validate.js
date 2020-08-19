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

  async ensureVersion(apiPath) {
    if (apiPath.split('/').length !== 3) {
      const version = await this.getDefaultVersion(apiPath.split('/'))
      return `${apiPath}/${version}`
    }
    return apiPath
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
An error will occur if the API version does not exist.
`

ValidateCommand.args = [{
  name: 'OWNER/API_NAME/[VERSION]',
  required: true,
  description: 'SwaggerHub API to fetch'
}]

module.exports = ValidateCommand