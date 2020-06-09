const { Command, flags } = require('@oclif/command')
const { readFileSync } = require('fs-extra')
const { headApi, postApi } = require('../../actions/api')
const { getIdentifierArg, getOasVersion, getVersion, parseDefinition } = require('../../support/command/parse-input')
const { parseResponse, checkForErrors, handleErrors } = require('../../support/command/response-handler')

class CreateAPICommand extends Command {

  async run() {
    const { args, flags } = this.parse(CreateAPICommand)
    const [owner, name, version] = getIdentifierArg(args, false).split('/')
    const definition = parseDefinition(flags.file)
    const oas = getOasVersion(definition)
    const versionToCreate = getVersion(definition, version)

    const getApiResult = await headApi([owner, name]).then(parseResponse)
    if (getApiResult.ok) {
      const getApiVersionResult = await headApi([owner, name, versionToCreate]).then(parseResponse)
      if (getApiVersionResult.ok) {
        this.error(`API version '${owner}/${name}/${versionToCreate}' already exists in SwaggerHub`, { exit: 1 })
      } else if (getApiVersionResult.status === 404) {
        await this.createApi(owner, name, versionToCreate, oas, flags, `Created version ${versionToCreate} of API '${owner}/${name}'`)
      } else {
        handleErrors(getApiVersionResult)
      }
    } else if (getApiResult.status === 404) {
      await this.createApi(owner, name, versionToCreate, oas, flags, `Created API '${owner}/${name}'`)
    } else {
      handleErrors(getApiResult)
    }
  }

  async createApi(owner, name, version, oas, flags, successMessage) {
    const queryParams = {
      version: version,
      isPrivate: flags.visibility === 'private',
      oas: oas
    }
    const createApiObject = {
      pathParams: [owner, name],
      queryParams: queryParams,
      body: readFileSync(flags.file)
    }
    return await postApi(createApiObject)
    .then(parseResponse)
    .then(checkForErrors)
    .then(() => this.log(successMessage))
    .catch(handleErrors)
  }
}

CreateAPICommand.description = `creates a new API / API version from a YAML/JSON file
The API version from the file will be used unless the version is specified in the command argument.
An error will occur if the API version already exists.
`

CreateAPICommand.examples = [
  'swaggerhub api:create organization/api/1.0.0 --file api.yaml --visibility public',
  'swaggerhub api:create organization/api --file api.yaml'
]

CreateAPICommand.args = [{ 
  name: 'OWNER/API_NAME/[VERSION]',
  required: true,
  description: 'API to create in SwaggerHub'
}]

CreateAPICommand.flags = {
  file: flags.string({
    char: 'f', 
    description: 'file location of API to create',
    required: true
  }),
  visibility: flags.string({
    description: 'visibility of API in SwaggerHub',
    options: ['public', 'private'],
    default: 'private'
  })
}

module.exports = CreateAPICommand
