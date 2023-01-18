const { Flags } = require('@oclif/core')
const { readFileSync } = require('fs-extra')
const { getDomain, postDomain } = require('../../requests/domain')
const { getDomainIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { getVersion, parseDefinition } = require('../../utils/definitions')
const BaseCommand = require('../../support/command/base-command')
const UpdateCommand = require('../../support/command/update-command')

const isDomainNameAvailable = response => response.status === 404

class CreateDomainCommand extends UpdateCommand {
  
  async checkDomainName(path) {
    return this.executeHttp({
      execute: () => getDomain(path),
      onResolve: isDomainNameAvailable,
      options: { resolveStatus: [403, 404] }
    })
  }

  async tryCreateDomain({ path, version, flags }) {
    const isNameAvailable = await this.checkDomainName(path)
    const pathHasVersion = path.length === 3
    const fullPath = pathHasVersion ? path : [...path, version]

    if (isNameAvailable) {
      await this.createDomain(fullPath, flags, pathHasVersion)
      return true
    }
    
    return isNameAvailable
  }

  async tryCreateDomainVersion({ path, ...args }) {
    return this.tryCreateDomain({ 
      path: [...path, args.version],
      ...args
    })
  }

  async createDomain([owner, name, version], flags, pathHasVersion) {
    const isPrivate = flags.visibility === 'private'

    const createDomainObj = {
      pathParams: [owner, name],
      queryParams: { version, isPrivate },
      body: readFileSync(flags.file)
    }

    if (pathHasVersion) {
      this.logCommandSuccess = this.setSuccessMessage('createdDomainVersion')
    }

    return await this.executeHttp({
      execute: () => postDomain(createDomainObj), 
      onResolve: this.logCommandSuccess({ owner, name, version }),
      options: { resolveStatus: [403] }
    })
  }

  async run() {
    const { args, flags } = await this.parse(CreateDomainCommand)
    const definition = parseDefinition(flags.file)
    const domainVersion = getVersion(definition)
    const doaminPath = getDomainIdentifierArg(args)
    const [owner, name, version = domainVersion] = splitPathParams(doaminPath)
    const type = 'domains'

    const argsObj = {
      path: [owner, name],
      version,
      flags
    }

    const createdDomain = (
      await this.tryCreateDomain(argsObj) ||
      await this.tryCreateDomainVersion(argsObj)
    )

    if (!createdDomain) {
      return this.throwCommandError({
        owner, name, version 
      })()
    }

    if (flags.published === 'publish') await this.updatePublish(type, owner, name, version, true)
    if (flags.setdefault) await this.updateDefault(type, owner, name, version)
  }
}

CreateDomainCommand.description = `creates a new domain / domain version from a YAML/JSON file
The domain version from the file will be used unless the version is specified in the command argument.
An error will occur if the domain version already exists.
`

CreateDomainCommand.examples = [
  'swaggerhub domain:create organization/domain/1.0.0 --file domain.yaml --visibility public',
  'swaggerhub domain:create organization/domain --file domain.yaml',
  'swaggerhub domain:create organization/domain/1.0.0 --publish --file domain.json',
  'swaggerhub domain:create organization/domain/1.0.0 --setdefault --file domain.json',
  'swaggerhub domain:create organization/domain/1.0.0 --publish --setdefault --file domain.json'
]

CreateDomainCommand.args = [{ 
  name: 'OWNER/DOMAIN_NAME/[VERSION]',
  required: true,
  description: 'Domain to create in SwaggerHub'
}]

CreateDomainCommand.flags = {
  file: Flags.string({
    char: 'f', 
    description: 'file location of domain to create',
    required: true
  }),
  visibility: Flags.string({
    description: 'visibility of domain in SwaggerHub',
    options: ['public', 'private'],
    default: 'private'
  }),
  published: Flags.string({
    description: 'sets the lifecycle setting of the domain version',
    options: ['publish', 'unpublish'],
    default: 'unpublish',
    required: false,
    dependsOn: ['file']
  }),
  setdefault: Flags.boolean({
    description: 'sets domain version to be the default',
    default: false,
    required: false,
    dependsOn: ['file']
  }),
  ...BaseCommand.flags
}

module.exports = CreateDomainCommand
