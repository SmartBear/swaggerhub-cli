const { flags } = require('@oclif/command')
const { readFileSync } = require('fs-extra')
const { getApi, postApi } = require('../../requests/api')
const { getApiIdentifierArg, getOasVersion, getVersion, parseDefinition } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

const isApiNameAvailable = response => response.status === 404

const successMessage = ([owner, name, version]) => !version 
  ? `Created API '${owner}/${name}'`
  : `Created version ${version} of API '${owner}/${name}'`

class CreateAPICommand extends BaseCommand {
  
  async checkApiName(path) {
    return this.executeHttp({
      execute: () => getApi(path),
      onResolve: isApiNameAvailable,
      options: { resolveStatus: [403, 404] }
    })
  }

  async tryCreateApi({ flags, apiPath, oas, versionToCreate }) {
    const isNameAvailable = await this.checkApiName(apiPath)
    
    if (isNameAvailable) {
      const [owner, name, version = versionToCreate] = apiPath
      return this.createApi(owner, name, version, oas, flags, successMessage(apiPath))
        .then(() => true)
    }
    
    return Promise.resolve(isNameAvailable)
  }

  async tryCreateApiVersion({ apiPath, version, ...args }) {
    return this.tryCreateApi({ ...args, apiPath: [...apiPath, version] })
  }

  async run() {
    const { args, flags } = this.parse(CreateAPICommand)
    const [owner, name, version] = getApiIdentifierArg(args, false).split('/')
    const definition = parseDefinition(flags.file)
    const oas = getOasVersion(definition)
    const versionToCreate = version || getVersion(definition)

    const argsObj = {
      flags,
      apiPath: [owner, name],
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
    const createApiObj = {
      pathParams: [owner, name],
      queryParams: { version, isPrivate, oas },
      body: readFileSync(flags.file)
    }

    return await this.executeHttp({
      execute: () => postApi(createApiObj), 
      onResolve: () => this.log(successMessage),
      options: { resolveStatus: [403] }
    })
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
  }),
  ...BaseCommand.flags
}

module.exports = CreateAPICommand
