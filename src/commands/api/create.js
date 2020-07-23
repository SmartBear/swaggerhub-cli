const { flags } = require('@oclif/command')
const { readFileSync } = require('fs-extra')
const { getApi, postApi } = require('../../requests/api')
const { from } = require('../../utils/general')
const { getApiIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { getOasVersion, getVersion, parseDefinition } = require('../../utils/oas')
const { errorMsg, infoMsg } = require('../../template-strings')
const BaseCommand = require('../../support/command/base-command')

const isApiNameAvailable = response => response.status === 404

const successMessage = ([owner, name, version]) => !version 
  ? infoMsg.createdApi({ owner, name })
  : infoMsg.createdApiVersion({ owner, name, version })

class CreateAPICommand extends BaseCommand {
  
  async checkApiName(path) {
    return this.executeHttp({
      execute: () => getApi(path),
      onResolve: isApiNameAvailable,
      options: { resolveStatus: [403, 404] }
    })
  }

  async tryCreateApi({ path, version, oas, flags }) {
    const isNameAvailable = await this.checkApiName(path)
    const pathHasVersion = path.length === 3
    const fullPath = pathHasVersion ? path : [...path, version]
    
    if (isNameAvailable) {
      await this.createApi(fullPath, oas, flags, successMessage(path))
      return true
    }
    
    return isNameAvailable
  }

  async tryCreateApiVersion({ path, ...args }) {
    return this.tryCreateApi({ 
      path: [...path, args.version],
      ...args
    })
  }

  async createApi([owner, name, version], oas, flags, successMessage) {
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

  async run() {
    const { args, flags } = this.parse(CreateAPICommand)
    const definition = parseDefinition(flags.file)
    const [oas, apiVersion] = from(definition)(getOasVersion, getVersion)
    const requestedApiPath = getApiIdentifierArg(args, false)
    const [owner, name, version = apiVersion] = splitPathParams(requestedApiPath)

    const argsObj = {
      path: [owner, name],
      version,
      flags,
      oas
    }

    const createdApi = (
      await this.tryCreateApi(argsObj) || 
      await this.tryCreateApiVersion(argsObj)
    )

    if (!createdApi) {
      return this.error(
        errorMsg.apiVersionExists({ owner, name, version }), 
        { exit: 1 }
      )
    }
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
