const { Flags, Args } = require('@oclif/core')
const { readFileSync } = require('fs-extra')
const { getDomain, postDomain } = require('../../requests/domain')
const { getDomainIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { getVersion, parseDefinition } = require('../../utils/definitions')
const BaseCommand = require('../../support/command/base-command')
const UpdateCommand = require('../../support/command/update-command')

class UpdateDomainCommand extends UpdateCommand {

  async updateDomain(owner, name, version, flags) {
    const queryParams = { version }

    if (flags.visibility) {
      queryParams['isPrivate'] = flags.visibility !== 'public'
      this.logCommandSuccess = this.setSuccessMessage('DomainUpdateVisibility')
    }

    const updateDomainObj = {
      pathParams: [owner, name],
      queryParams,
      body: readFileSync(flags.file)
    }

    return await this.executeHttp({
      execute: () => postDomain(updateDomainObj),
      onResolve: this.logCommandSuccess({ owner, name, version, visibility: flags.visibility }),
      options: { resolveStatus: [403] }
    })
  }

  async run() {
    const { args, flags } = await this.parse(UpdateDomainCommand)

    if (!Object.keys(flags).length) {
      return this.error('No updates specified', { exit: 1 })
    }

    const definition = flags.file ? parseDefinition(flags.file) : null
    const domainPath = getDomainIdentifierArg(args)
    const [owner, name, version] = splitPathParams(domainPath)
    const defaultVersion = definition ? getVersion(definition) : await this.getDefaultDomainVersion([owner, name])
    const domainVersion = version ? version : defaultVersion
    const type = 'domains'

    if (flags.file) {
      await this.handleUpdate(owner, name, domainVersion, flags)
    } else if (flags.visibility) {
      await this.updateVisibility(type, owner, name, domainVersion, flags.visibility !== 'public')
    }

    if (flags.published) await this.updatePublish(type, owner, name, domainVersion, flags.published === 'publish')
    if (flags.setdefault) await this.updateDefault(type, owner, name, domainVersion)
  }

  async handleUpdate(owner, name, version, flags) {
    await this.executeHttp({
      execute: () => getDomain([owner, name, version]),
      onResolve: () => this.updateDomain(owner, name, version, flags),
      options: { resolveStatus: [403] }
    })
  }
}

UpdateDomainCommand.description = `update a domain
The domain version from the file will be used unless the version is specified in the command argument.
When no file is specified then the default domain version will be updated.
The domain visibility can be changed by using visibility flag.
`

UpdateDomainCommand.examples = [
  'swaggerhub domain:update organization/domain --file domain.yaml',
  'swaggerhub domain:update organization/domain/1.0.0 --file domain.json',
  'swaggerhub domain:update organization/domain/1.0.0 --published=publish --file domain.json',
  'swaggerhub domain:update organization/domain/1.0.0 --setdefault --file domain.json',
  'swaggerhub domain:update organization/domain/1.0.0 --published=unpublish --setdefault --file domain.json',
  'swaggerhub domain:update organization/domain/1.0.0 --visibility=private',
]

UpdateDomainCommand.args = {
  'OWNER/DOMAIN_NAME/[VERSION]': Args.string({
    required: true,
    description: 'Domain to update on SwaggerHub'
  })
}

UpdateDomainCommand.flags = {
  file: Flags.string({
    char: 'f',
    description: 'file location of domain to update',
    required: false,
    multiple: false
  }),
  visibility: Flags.string({
    description: 'visibility of domain in SwaggerHub',
    options: ['public', 'private']
  }),
  published: Flags.string({
    description: 'sets the lifecycle setting of the domain version',
    options: ['publish', 'unpublish'],
    required: false
  }),
  setdefault: Flags.boolean({
    description: 'sets domain version to be the default',
    required: false
  }),
  ...BaseCommand.flags
}

module.exports = UpdateDomainCommand
