const {flags} = require('@oclif/command')
const BaseCommand = require('../../support/command/base-command')
const ReadCommand = require('../read.js')

class VersionCommand extends BaseCommand {
  async run() {
    const {args} = this.parse(VersionCommand)
    return ReadCommand.run([args.FILE, '--raw', '--json-pointer=/info/version'])
  }
}

VersionCommand.description = `Output /info/version from local file
...
Reads a local file and outputs the /info/version.

Is an alias for:  swaggerhub read FILE --raw --json-pointer=/info/version
See the "read" command.
`

VersionCommand.flags = {
  ...BaseCommand.flags
}

VersionCommand.args = [{
  name: 'FILE',
  required: true,
  description: 'file location of API/Domain to read'
}]

VersionCommand.examples = [
  'swaggerhub read:version api.yaml',
]


module.exports = VersionCommand
