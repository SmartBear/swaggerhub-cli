const { Command, flags } = require('@oclif/command')
const { readFileSync } = require('../../support/fs')
const { getApiVersions, postApi } = require('../../actions/api')
const { getIdentifierArg } = require('../../utils/input-validation')
const { parseResponse, checkForErrors, handleErrors } = require('../../utils/command-response-handler')

class CreateAPICommand extends Command {
  
  static args = [{ 
    name: 'identifier',
    required: true,
    description: 'Identifier for API in format OWNER/API_NAME/VERSION'
  }]

  static flags = {
    file: flags.string({
      char: 'f', 
      description: 'API file to create in SwaggerHub',
      required: true
    }),
    oas: flags.string({
      description: 'OAS Version of API',
      options: ['2', '3'],
      required: true,
      parse: input => input === '2' ? '2.0' : '3.0.0'
    }),
    visibility: flags.string({
      description: 'Visibility of API in SwaggerHub',
      options: ['public', 'private'],
      default: 'private'
    })
  }

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
      await postApi(createApiObject)
      .then(parseResponse)
      .then(checkForErrors)
      .then(() => this.log(`Created API ${identifier}`), handleErrors)
    } else {
      handleErrors(getApiResult)
    }
  }
}

CreateAPICommand.description = `Creates API in SwaggerHub
Creates API in SwaggerHub. Fails if API already exists
`

module.exports = CreateAPICommand