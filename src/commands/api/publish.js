const { Command, flags } = require('@oclif/command')
const { putApi } = require('../../actions/api')
const { getIdentifierArg } = require('../../support/command/parse-input')
const {
  parseResponse,
  checkForErrors,
  handleErrors,
  removeUpgradeLinkIfLimitsReached
} = require('../../support/command/response-handler')

class PublishCommand extends Command {
  
  async run() {
    const { args } = this.parse(PublishCommand)
    const identifier = getIdentifierArg(args)
    const [owner, name, version] = identifier.split('/')

    const publishApi = {
      pathParams: [owner, name, version, 'settings', 'lifecycle'],
      body: JSON.stringify({ published: true })
    }
    await putApi(publishApi)
    .then(parseResponse)
    .then(checkForErrors({ resolveStatus: [403] }))
    .then(removeUpgradeLinkIfLimitsReached)
    .then(() => this.log(`Published API ${identifier}`))
    .catch(handleErrors)
  }
}

PublishCommand.description = `publish an API version
`

PublishCommand.examples = [
  'swaggerhub api:publish organization/api/1.0.0'
]

PublishCommand.args = [{ 
  name: 'OWNER/API_NAME/VERSION',
  required: true,
  description: 'API to publish'
}]

module.exports = PublishCommand
