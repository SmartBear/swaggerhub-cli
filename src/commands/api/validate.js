const {Command, flags} = require('@oclif/command')
const BaseCommand = require('../../support/command/base-command')
const { getApi } = require('../../requests/api')
const { pipeAsync } = require('../../utils/general')
const { getResponseContent } = require('../../support/command/handle-response')
const { getApiIdentifierArg } = require('../../support/command/parse-input')

class ValidateCommand extends BaseCommand {
  async run() {
    const { args } = this.parse(ValidateCommand)
    const name = flags.name || 'world'
    const identifier = getApiIdentifierArg(args)

    const validationResults = await this.getValidationResults(identifier)

    const validationResultsStr = validationResults.validation
          .map(val => `${val.line}:\t${val.severity.toLowerCase()}\t${val.description}`)
          .join('\n')

    this.log(validationResultsStr)
  }

  async getValidationResults(identifier) {
    return this.executeHttp({
      execute: () => getApi([identifier, 'validation']),
      onResolve: pipeAsync(getResponseContent, JSON.parse),
      options: {},
    })
  }
}

ValidateCommand.description = `Describe the command here
...
Extra documentation goes here
`

ValidateCommand.args = [{
  name: 'OWNER/API_NAME/VERSION',
  required: true,
  description: 'SwaggerHub API to fetch'
}]

module.exports = ValidateCommand
