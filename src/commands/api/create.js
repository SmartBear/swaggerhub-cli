const { Command, flags } = require('@oclif/command')
const { readFileSync } = require('fs-extra')
const { getApiVersion, postApi } = require('../../actions/api')
const { getIdentifierArg, getOasVersion, getVersion, parseDefinition } = require('../../support/command/parse-input')
const { parseResponse, checkForErrors, handleErrors } = require('../../support/command/response-handler')

const isApiNameAvailable = response => response.status === 404

const successMessage = ([owner, name, version]) => !version 
  ? `Created API '${owner}/${name}'`
  : `Created version ${version} of API '${owner}/${name}'`

class CreateAPICommand extends Command {

  async checkApiName(path) {
    return getApiVersion(path, true)
      .then(parseResponse)
      .then(checkForErrors({ errOn404: false }))
      .then(isApiNameAvailable)
      .catch(handleErrors)
  }

  async tryCreateApi({ flags, apiPath, oas, versionToCreate }) {
    const isNameAvailable = await this.checkApiName(apiPath)
    
    if (isNameAvailable) {
      const [owner, name, version = versionToCreate] = apiPath.split('/')
      return this.createApi(owner, name, version, oas, flags, successMessage(apiPath.split('/')))
        .then(() => true)
    }
    
    return Promise.resolve(isNameAvailable)
  }

  async tryCreateApiVersion({ apiPath, version, ...args }) {
    return this.tryCreateApi({ ...args, apiPath: `${apiPath}/${version}` })
  }

  async run() {
    const { args, flags } = this.parse(CreateAPICommand)
    const [owner, name, version] = getIdentifierArg(args, false).split('/')
    const definition = parseDefinition(flags.file)
    const oas = getOasVersion(definition)
    const versionToCreate = version || getVersion(definition)

    const argsObj = {
      flags,
      apiPath: [owner, name].join('/'),
      oas, 
      versionToCreate 
    }

    return (
      await this.tryCreateApi(argsObj) ||
      await this.tryCreateApiVersion({ ...argsObj, version: versionToCreate }) ||
      this.error(`API version '${owner}/${name}/${versionToCreate}' already exists in SwaggerHub`, { exit: 1 })
    )
  }

  async createApi(owner, name, version, oas, flags, successMessage) {
    const isPrivate = flags.visibility === 'private'
    
    return await postApi({
        pathParams: [owner, name],
        queryParams: { version, isPrivate, oas },
        body: readFileSync(flags.file)
      })
      .then(parseResponse)
      .then(checkForErrors())
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