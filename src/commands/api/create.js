const { Command, flags } = require('@oclif/command')
const { readFileSync, fileExistsSync } = require('../../support/fs')
const { getApiVersions, postApi } = require('../../actions/api')
const { getIdentifierArg } = require('../../utils/input-validation')
const { parseResponse, checkForErrors, handleErrors } = require('../../utils/command-response-handler')

class CreateAPICommand extends Command {
  
  async run() {
    const { args, flags } = this.parse(CreateAPICommand)
    const identifier = getIdentifierArg(args)
    const [owner, name, version] = identifier.split('/')

    if (!fileExistsSync(flags.file)) {
      this.error(`File '${flags.file}' not found`, { exit: 1 })
    }

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
      .then(() => this.log(`Created API ${identifier}`))
      .catch(handleErrors)
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

CreateAPICommand.args = [{ 
  name: 'OWNER/API_NAME/VERSION',
  required: true,
  description: 'API to create in SwaggerHub'
}]

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
  })
}

module.exports = CreateAPICommand