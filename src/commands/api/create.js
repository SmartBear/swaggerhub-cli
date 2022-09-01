const { flags } = require('@oclif/command')
const { readFileSync } = require('fs-extra')
const { getApi, postApi } = require('../../requests/api')
const { getApiIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { getVersion, parseDefinition, getSpecification } = require('../../utils/definitions')
const BaseCommand = require('../../support/command/base-command')
const UpdateCommand = require('../../support/command/update-command')

const isApiNameAvailable = response => response.status === 404

class CreateAPICommand extends UpdateCommand {
  
  async checkApiName(path) {
    return this.executeHttp({
      execute: () => getApi(path),
      onResolve: isApiNameAvailable,
      options: { resolveStatus: [403, 404] }
    })
  }

  async tryCreateApi({ path, version, specification, flags }) {
    const isNameAvailable = await this.checkApiName(path)
    const pathHasVersion = path.length === 3
    const fullPath = pathHasVersion ? path : [...path, version]
    
    if (isNameAvailable) {
      await this.createApi(fullPath, specification, flags, pathHasVersion)
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

  async createApi([owner, name, version], specification, flags, pathHasVersion) {
    const isPrivate = flags.visibility === 'private'

    const createApiObj = {
      pathParams: [owner, name],
      queryParams: { version, isPrivate, specification },
      body: readFileSync(flags.file)
    }

    if (pathHasVersion) {
      this.logCommandSuccess = this.setSuccessMessage('createdApiVersion')
    }

    return await this.executeHttp({
      execute: () => postApi(createApiObj), 
      onResolve: this.logCommandSuccess({ owner, name, version }),
      options: { resolveStatus: [403] }
    })
  }

  async run() {
    const { args, flags } = this.parse(CreateAPICommand)
    const definition = parseDefinition(flags.file)
    const specification = getSpecification(definition)
    const apiVersion = getVersion(definition)
    const apiPath = getApiIdentifierArg(args)
    const [owner, name, version = apiVersion] = splitPathParams(apiPath)
    const type = 'apis'

    const argsObj = {
      path: [owner, name],
      version,
      flags,
      specification
    }

    const createdApi = (
      await this.tryCreateApi(argsObj) ||
      await this.tryCreateApiVersion(argsObj)
    )

    if (!createdApi) {
      return this.throwCommandError({
        owner, name, version 
      })()
    }

    if (flags.published === 'publish') await this.updatePublish(type, owner, name, version, true)
    if (flags.setdefault) await this.updateDefault(type, owner, name, version)
  }
}

CreateAPICommand.description = `creates a new API / API version from a YAML/JSON file
The API version from the file will be used unless the version is specified in the command argument.
An error will occur if the API version already exists.
`

CreateAPICommand.examples = [
  'swaggerhub api:create organization/api/1.0.0 --file api.yaml --visibility public',
  'swaggerhub api:create organization/api --file api.yaml',
  'swaggerhub api:create organization/api/1.0.0 --published=publish --file api.json',
  'swaggerhub api:create organization/api/1.0.0 --setdefault --file api.json',
  'swaggerhub api:create organization/api/1.0.0 --published=publish --setdefault --file api.json'
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
  published: flags.string({
    description: 'sets the lifecycle setting of the API version',
    options: ['publish', 'unpublish'],
    default: 'unpublish',
    required: false,
    dependsOn: ['file']
  }),
  setdefault: flags.boolean({
    description: 'sets API version to be the default',
    default: false,
    required: false,
    dependsOn: ['file']
  }),
  ...BaseCommand.flags
}

module.exports = CreateAPICommand
