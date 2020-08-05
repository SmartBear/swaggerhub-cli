const { flags } = require('@oclif/command')
const { CLIError } = require('@oclif/errors')
const { readFileSync } = require('fs-extra')
const { parseDefinition } = require('../utils/oas')
const { getJsonPointer } = require('../utils/general')
const BaseCommand = require('../support/command/base-command')
const { errorMsg } = require('../template-strings')

class ReadCommand extends BaseCommand {
  async run() {
    const { flags, args } = this.parse(ReadCommand)
    const { FILE } = args
    const data = parseDefinition(FILE)
    const jsonPointer = flags['json-pointer']
    const value = getJsonPointer(data, jsonPointer)

    if(typeof value === 'undefined')
      throw new CLIError(errorMsg.failedToFindJsonPointer({ jsonPointer, fileName: FILE }))

    // So that it doesn't output an extra "\n"
    process.stdout.write(`${value}`)
  }
}

ReadCommand.description = `Describe the command here
...
  Reads a local file and outputs the contents.
  Useful if you add the --path flag to specify what path you wish to output.

  For more advance json parsing, consider using \`swaggerhub\` in conjunction with the powerful [JQ cli tool](https://github.com/stedolan/jq)
`

ReadCommand.flags = {
  ['json-pointer']: flags.string({
    char: 'p',
    description: 'JSON Pointer to filter output by',
    required: true
  }),
  ...BaseCommand.flags
}

ReadCommand.args = [{
  name: 'FILE',
  required: true,
  description: 'file location of API to read'
}]

ReadCommand.examples = [
  'swaggerhub read api.yaml --json-path=/info/version',
]

module.exports = ReadCommand
