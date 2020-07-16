const { putDomain } = require('../../requests/domain')
const { getDomainIdentifierArg } = require('../../support/command/parse-input')
const { infoMsg } = require('../../template-strings')

const BaseCommand = require('../../support/command/base-command')

class UnpublishCommand extends BaseCommand {
  
  async run() {
    const { args } = this.parse(UnpublishCommand)
    const identifier = getDomainIdentifierArg(args)
    const [owner, name, version] = identifier.split('/')

    const publish = {
      pathParams: [owner, name, version, 'settings', 'lifecycle'],
      body: JSON.stringify({ published: false })
    }
    
    await this.executeHttp({
      execute: () => putDomain(publish), 
      onResolve: () => this.log(infoMsg.unpublishedDomainVersion({ identifier })),
      options: { resolveStatus: [403] }
    })
  }
}

UnpublishCommand.description = 'unpublish a domain version'

UnpublishCommand.examples = [
  'swaggerhub domain:unpublish organization/domain/1.0.0'
]

UnpublishCommand.args = [{ 
  name: 'OWNER/DOMAIN_NAME/VERSION',
  required: true,
  description: 'Domain identifier'
}]

UnpublishCommand.flags = BaseCommand.flags

module.exports = UnpublishCommand
