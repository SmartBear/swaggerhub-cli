const {Command, flags} = require('@oclif/command')

class VersionCommand extends Command {
  async run() {
    const {flags} = this.parse(VersionCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/josh/projects/swaggerhub-cli/src/commands/read/version.js`)
  }
}

VersionCommand.description = `Describe the command here
...
Extra documentation goes here
`

VersionCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = VersionCommand
