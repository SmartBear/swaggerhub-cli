const { Command, flags } = require('@oclif/command')
const { putApi } = require('../../actions/api')
const { getIdentifierArg } = require('../../support/command/parse-input')
const { parseResponse, checkForErrors, handleErrors } = require('../../support/command/response-handler')

class UnpublishCommand extends Command {
  async run() {
    const { args } = this.parse(UnpublishCommand)
    const identifier = getIdentifierArg(args)
    const [owner, name, version] = identifier.split('/')

    const unpublishApi = {
      pathParams: [owner, name, version, 'settings', 'lifecycle'],
      body: JSON.stringify({ published: false })
    }
    await putApi(unpublishApi)
    .then(parseResponse)
    .then(checkForErrors({ errOn404: true }))
    .then(() => this.log(`Unpublished API ${identifier}`))
    .catch(handleErrors)
  }
}

UnpublishCommand.description = `unpublish an API version
`

UnpublishCommand.examples = [
  'swaggerhub api:unpublish organization/api/1.0.0'
]

UnpublishCommand.args = [{ 
  name: 'OWNER/API_NAME/VERSION',
  required: true,
  description: 'API to unpublish'
}]

module.exports = UnpublishCommand
