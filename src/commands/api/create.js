const { flags } = require('@oclif/command')
const { readFileSync } = require('fs-extra')
const { getApiVersions, postApi } = require('../../actions/api')
const { getIdentifierArg } = require('../../support/command/parse-input')
const { parseResponse, handleErrors } = require('../../support/command/response-handler')
const BaseCommand = require('../../support/command/base-command')

class CreateAPICommand extends BaseCommand {
  
  async run() {
    const { args, flags } = this.parse(CreateAPICommand)
    const identifier = getIdentifierArg(args)
    const [owner, name, version] = identifier.split('/')

    const getApiResult = await getApiVersions({ pathParams: [owner, name] }).then(parseResponse)
    if (getApiResult.ok) {
      this.error(`API '${owner}/${name}' already exists in SwaggerHub`, { exit: 1 })
    } else if (getApiResult.status === 404) {
      const queryParams = { 
        version: version, 
        isPrivate: flags.visibility==='private', 
        oas: flags.oas 
      }
      const createApiObject = {
        pathParams: [owner, name],
        queryParams: queryParams,
        body: readFileSync(flags.file)
      }
      await this.execute(() => postApi(createApiObject), () => this.log(`Created API ${identifier}`))
    } else {
      handleErrors(getApiResult)
    }
  }
}

CreateAPICommand.description = `creates an API
command will fail if the API already exists.
`

CreateAPICommand.examples = [
  'swaggerhub api:create organization/api/1.0.0 --file api.yaml --oas 3 --visibility public'
]

CreateAPICommand.flags = {
  file: flags.string({
    char: 'f', 
    description: 'file location of API to create',
    required: true
  }),
  oas: flags.string({
    description: 'OAS version of API',
    options: ['2', '3'],
    required: true,
    parse: input => input === '2' ? '2.0' : '3.0.0'
  }),
  visibility: flags.string({
    description: 'visibility of API in SwaggerHub',
    options: ['public', 'private'],
    default: 'private'
  }),
  ...BaseCommand.flags
}

CreateAPICommand.args = BaseCommand.args

module.exports = CreateAPICommand