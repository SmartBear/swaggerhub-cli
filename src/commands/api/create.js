const { Command, flags } = require('@oclif/command')
const { readFileSync } = require('fs-extra')
const { getApiVersion, postApi } = require('../../actions/api')
const { parseDefinition, getOasVersion } = require('../../utils/general')
const { getIdentifierArg } = require('../../support/command/parse-input')
const { parseResponse, checkForErrors, handleErrors } = require('../../support/command/response-handler')

class CreateAPICommand extends Command {

  async run() {
    const { args, flags } = this.parse(CreateAPICommand)
    const [owner, name, version] = getIdentifierArg(args).split('/')
    const definition = parseDefinition(flags.file)
    const versionToCreate = this.getVersion(version, definition)
    const oas = getOasVersion(definition)

    const getApiResult = await getApiVersion(`${owner}/${name}`, flags).then(parseResponse)
    if (getApiResult.ok) {
      const getApiVersionResult = await getApiVersion(`${owner}/${name}/${versionToCreate}`, flags).then(parseResponse)
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

  getVersion(version, definition) {
    if (!version) {
      return definition.info.version
    }
    return version
  }

  async createApi(owner, name, version, oas, flags, successMessage) {
    const queryParams = { 
      version: version, 
      isPrivate: flags.visibility==='private', 
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

CreateAPICommand.description = `creates an API/API version
if user does not specify version of API to create, version from file will be created
command will fail if the API version already exists.
`

CreateAPICommand.examples = [
  'swaggerhub api:create organization/api/1.0.0 --file api.yaml --visibility public',
  'swaggerhub api:create organization/api --file api.yaml'
]

CreateAPICommand.args = [{ 
  name: 'OWNER/API_NAME/VERSION',
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