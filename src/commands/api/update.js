const { flags } = require('@oclif/command')
const { readFileSync } = require('fs-extra')
const { getApi, postApi } = require('../../requests/api')
const { getApiIdentifierArg } = require('../../support/command/parse-input')
const { getVersion, parseDefinition } = require('../../utils/oas')
const BaseCommand = require('../../support/command/base-command')

class UpdateAPICommand extends BaseCommand {
  async run() {
    const { args, flags } = this.parse(UpdateAPICommand)
    const [owner, name, version] = getApiIdentifierArg(args, false).split('/')
    const definition = parseDefinition(flags.file)
    const versionToUpdate = version || getVersion(definition)

    await this.executeHttp({
      execute: () => getApi([owner, name, versionToUpdate]), 
      onResolve: () => this.updateApi(owner, name, versionToUpdate, flags),
      options: { resolveStatus: [403] }
    })
  }

  async updateApi(owner, name, version, flags) {
    const isPrivate = flags.visibility === 'private'
    const updateApiObj = {
      pathParams: [owner, name],
      queryParams: { version, isPrivate },
      body: readFileSync(flags.file)
    }

    return await this.executeHttp({
      execute: () => postApi(updateApiObj), 
      onResolve: () => this.log(`Updated API '${owner}/${name}/${version}'`),
      options: { resolveStatus: [403] }
    })
  }
}

UpdateAPICommand.description = `update an API version
The API version from the file will be used unless the version is specified in the command argument.
An error will occur if the API version does not exist.
`

UpdateAPICommand.examples = [
  'swaggerhub api:update organization/api --file api.yaml',
  'swaggerhub api:update organization/api/1.0.0 --file api.json'
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
    required: true
  }),
  visibility: flags.string({
    description: 'visibility of API in SwaggerHub',
    options: ['public', 'private'],
    default: 'private'
  }),
  ...BaseCommand.flags
}

module.exports = UpdateAPICommand
