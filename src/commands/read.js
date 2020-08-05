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
    const raw = flags.raw

    const stringValue = this.getStringValue({
      fileName: FILE,
      jsonPointer,
      isRaw: raw
    })

    // So that it doesn't output an extra "\n"
    process.stdout.write(stringValue)
  }

  getStringValue({ fileName, jsonPointer, isRaw }) {
    const data = parseDefinition(fileName)
    const value = getJsonPointer(data, jsonPointer)

    if (typeof value === 'undefined')
      throw new CLIError(errorMsg.failedToFindJsonPointer({ jsonPointer, fileName }))

    return stringifyValue(value, isRaw)
  }

}

function stringifyValue(value, isRaw=false) {
  // Not raw? Then just stringify
  if (!isRaw)
    return JSON.stringify(value, null, 2)

  // Not good "raw" value for collections (or null)
  if (typeof value === 'object' || Array.isArray(value))
    return JSON.stringify(value, null, 2)

  // number | string | boolean
  return `${value}`
}

ReadCommand.description = `Read local file and output contents
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
  ['raw']: flags.boolean({
    char: 'r',
    description: 'Output scalars as raw values.\n\nObjects and Arrays will be output as JSON.',
    required: false
  }),
  ...BaseCommand.flags
}

ReadCommand.args = [{
  name: 'FILE',
  required: true,
  description: 'file location of API/Domain to read'
}]

ReadCommand.examples = [
  'swaggerhub read api.yaml --json-path=/info/version',
]

module.exports = ReadCommand
