const { flags } = require('@oclif/command')
const { readFileSync } = require('fs-extra')
const { getApi, postApi } = require('../../requests/api')
const { getApiIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { getVersion, parseDefinition } = require('../../utils/oas')
const BaseCommand = require('../../support/command/base-command')
const UpdateCommand = require('../../support/command/update-command')

class UpdateAPICommand extends UpdateCommand {

  async updateApi(owner, name, version, flags) {
    const queryParams = { version }

    if (flags.visibility) {
      queryParams['isPrivate'] = flags.visibility !== 'public'
      this.logCommandSuccess = this.setSuccessMessage('ApiUpdateVisibility')
    }

    const updateApiObj = {
      pathParams: [owner, name],
      queryParams,
      body: readFileSync(flags.file)
    }

    return await this.executeHttp({
      execute: () => postApi(updateApiObj),
      onResolve: this.logCommandSuccess({ owner, name, version, visibility: flags.visibility }),
      options: { resolveStatus: [403] }
    })
  }

  async run() {
    const { args, flags } = this.parse(UpdateAPICommand)

    if (!Object.keys(flags).length) {
      return this.error('No updates specified', { exit: 1 })
    }

    const definition = flags.file ? parseDefinition(flags.file) : null
    const apiPath = getApiIdentifierArg(args)
    const [owner, name, version] = splitPathParams(apiPath)
    const defaultVersion = definition ? getVersion(definition) : await this.getDefaultApiVersion([owner, name])
    const apiVersion = version ? version : defaultVersion
    const type = 'apis'

    if (flags.file) {
      await this.handleUpdate(owner, name, apiVersion, flags)
    } else if (flags.visibility) {
      await this.updateVisibility(type, owner, name, apiVersion, flags.visibility !== 'public')
    }

    if (flags.publish) await this.updatePublish(type, owner, name, apiVersion)
    if (flags.setdefault) await this.updateDefault(type, owner, name, apiVersion)
  }

  async handleUpdate(owner, name, version, flags) {
    await this.executeHttp({
      execute: () => getApi([owner, name, version]),
      onResolve: () => this.updateApi(owner, name, version, flags),
      options: { resolveStatus: [403] }
    })
  }
}

UpdateAPICommand.description = `update an API
The API version from the file will be used unless the version is specified in the command argument.
When no file is specified then the default API version will be updated.
The API visibility can be changed by using visibility flag.
`

UpdateAPICommand.examples = [
  'swaggerhub api:update organization/api --file api.yaml',
  'swaggerhub api:update organization/api/1.0.0 --file api.json',
  'swaggerhub api:update organization/api/1.0.0 --publish --file api.json',
  'swaggerhub api:update organization/api/1.0.0 --setdefault --file api.json',
  'swaggerhub api:update organization/api/1.0.0 --publish --setdefault --file api.json',
  'swaggerhub api:update organization/api/1.0.0 --visibility=private',
]

UpdateAPICommand.args = [{
  name: 'OWNER/API_NAME/[VERSION]',
  required: true,
  description: 'API to update in SwaggerHub'
}]

UpdateAPICommand.flags = {
  file: flags.string({
    char: 'f',
    description: 'file location of API to update',
    required: false,
    multiple: false
  }),
  visibility: flags.string({
    description: 'visibility of API in SwaggerHub',
    options: ['public', 'private']
  }),
  publish: flags.boolean({
    description: 'sets the API version as published',
    required: false
  }),
  setdefault: flags.boolean({
    description: 'sets API version to be the default',
    required: false
  }),
  ...BaseCommand.flags
}

module.exports = UpdateAPICommand
