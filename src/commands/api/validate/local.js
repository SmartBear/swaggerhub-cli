const { Flags } = require('@oclif/core')
const BaseValidateCommand = require('../../../support/command/base-validate-command')
const { pipeAsync } = require('../../../utils/general')
const { getResponseContent } = require('../../../support/command/handle-response')
const { postStandardization } = require('../../../requests/standardization')
const { parseDefinition, getSpecification, getVersion } = require('../../../utils/definitions')
const { readFileSync } = require('fs-extra')

class ValidateLocalCommand extends BaseValidateCommand {
  async run() {
    const { flags } = await this.parse(ValidateLocalCommand)
    this.validateDefinition(flags['file'])
    const definition = readFileSync(flags['file'])
    const validationResult = await this.getValidationResult(flags['organization'], definition)
    this.printValidationOutput(flags, validationResult)
    this.exitWithCode(flags, validationResult)
  }

  // Rudimentary checks to check that file is
  // at least an OpenAPI/AsyncAPI definition
  // and is valid yaml/json
  validateDefinition(pathToFile) {
    const definition = parseDefinition(pathToFile)
    getSpecification(definition)
    getVersion(definition)
  }

  getValidationResult(orgName, body) {
    return this.executeHttp({
      execute: () => postStandardization([orgName, 'scan'], body),
      onResolve: pipeAsync(getResponseContent, JSON.parse),
      options: {}
    })
  }
}

ValidateLocalCommand.description = `Runs a scan against a local API definition using the organization's standardization configuration on SwaggerHub.
If the flag \`-c\` or \`--failOnCritical\` is used and there are standardization
errors with \`Critical\` severity present, the command will exit with error code \`1\`.
`

ValidateLocalCommand.examples = [
  'swaggerhub api:validate-local -c -j -o myOrg -f ./my-api.yaml',
  'swaggerhub api:validate-local --fail-on-critical --to-json --organization myOrg --file ./my-api/json',
]

ValidateLocalCommand.flags = {
  'file': Flags.string({
    char: 'f',
    description: 'Path of API definition file to run scan against',
    required: true
  }),
  'organization': Flags.string({
    char: 'o',
    description: 'Which organization\'s standardization settings to use for linting the target definition',
    required: true
  }),
  ...BaseValidateCommand.flags
}
module.exports = ValidateLocalCommand