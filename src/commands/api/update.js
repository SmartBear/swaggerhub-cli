const { flags } = require('@oclif/command')
const { readFileSync } = require('fs-extra')
const { getApi, postApi, putApi } = require('../../requests/api')
const { getApiIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { getVersion, parseDefinition } = require('../../utils/oas')
const BaseCommand = require('../../support/command/base-command')
const { getResponseContent } = require('../../support/command/handle-response')
const publish = require('./publish')
const setDefault = require('./setdefault')

class UpdateAPICommand extends BaseCommand {

  async updateApi({ owner, name, version, flags, isPrivate, visibility }) {

    const updateApiObj = {
      pathParams: [owner, name],
      queryParams: { version, isPrivate },
      body: readFileSync(flags.file)
    }

    return await this.executeHttp({
      execute: () => postApi(updateApiObj),
      onResolve: this.logCommandSuccess({ owner, name, version, visibility }),
      options: { resolveStatus: [403] }
    })
  }

  async run() {
    const { args, flags } = this.parse(UpdateAPICommand)

    if (!Object.keys(flags).length) {
      return this.error('No updates specified', { exit: 1 })
    }

    const definition = flags.file ? parseDefinition(flags.file) : null
    const requestedApiPath = getApiIdentifierArg(args)
    const [owner, name, version] = splitPathParams(requestedApiPath)
    const defaultVersion = definition ? getVersion(definition) : await this.getDefaultApiVersion([owner, name])
    const apiVersion = version ? version : defaultVersion

    if (flags.file) {
      await this.handleUpdate(owner, name, apiVersion, flags)
    } else if (flags.visibility) {
      await this.handleUpdateVisibility(owner, name, apiVersion, flags)
    }

    const apiPathWithVersion = requestedApiPath.split('/').length === 3 ?
      requestedApiPath :
      `${requestedApiPath}/${apiVersion}`

    if (flags.publish) await publish.run([apiPathWithVersion])
    if (flags.setdefault) await setDefault.run([apiPathWithVersion])
  }

  async handleUpdate(owner, name, apiVersion, flags) {
    await this.executeHttp({
      execute: () => getApi([owner, name, apiVersion, 'settings', 'private']),
      onResolve: response => {
        const content = getResponseContent(response)
        const versionSettings = JSON.parse(content)
        const isPrivate = flags.visibility ? flags.visibility !== 'public' : versionSettings.private
        const visibility = isPrivate ? 'private' : 'public'
        return this.updateApi({ owner, name, version: apiVersion, flags, isPrivate, visibility })
      },
      options: { resolveStatus: [403] }
    })
  }

  async handleUpdateVisibility(owner, name, apiVersion, flags) {
    const isPrivate = flags.visibility !== 'public'
    const visibility = isPrivate ? 'private' : 'public'
    const updateApiObj = {
      pathParams: [owner, name, apiVersion, 'settings', 'private'],
      body: JSON.stringify({ private: isPrivate })
    }

    await this.executeHttp({
      execute: () => putApi(updateApiObj),
      onResolve: this.setSuccessMessage('visibilityUpdate')({
        owner,
        name,
        version: apiVersion,
        visibility
      }),
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
