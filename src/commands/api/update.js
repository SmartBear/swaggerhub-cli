const { Command, flags } = require('@oclif/command')
const { readFileSync } = require('fs-extra')
const { getApi, postApi } = require('../../actions/api')
const { getIdentifierArg, getVersion, parseDefinition } = require('../../support/command/parse-input')
const { parseResponse, checkForErrors, handleErrors } = require('../../support/command/response-handler')

class UpdateAPICommand extends Command {
  async run() {
    const { args, flags } = this.parse(UpdateAPICommand)
    const [owner, name, version] = getIdentifierArg(args, false).split('/')
    const versionToUpdate = getVersion(parseDefinition(flags.file), version)

    await getApi([owner, name, versionToUpdate], true)
    .then(parseResponse)
    .then(checkForErrors)
    .then(() => this.updateApi(owner, name, versionToUpdate, flags))
    .catch(handleErrors)
  }

  async updateApi(owner, name, version, flags) {
    const queryParams = {
      version: version,
      isPrivate: flags.visibility === 'private'
    }
    const updateApiObject = {
      pathParams: [owner, name],
      queryParams: queryParams,
      body: readFileSync(flags.file)
    }
    return await postApi(updateApiObject)
    .then(parseResponse)
    .then(checkForErrors)
    .then(() => this.log(`Updated API '${owner}/${name}/${version}'`))
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
  })
}

module.exports = UpdateAPICommand
