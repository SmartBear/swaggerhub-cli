const { Command, flags } = require('@oclif/command')
const { readFileSync } = require('../../support/fs')
const { getApiVersions, postApi } = require('../../actions/api')
const { getIdentifierArg } = require('../../utils/input-validation')

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
    visibility: flags.string({
      description: 'Visibility of API in SwaggerHub',
      options: ['public', 'private'],
      default: 'private'
    }),
    oasVersion: flags.string({
      description: 'OAS Version of API',
      options: ['2.0', '3.0.0'],
      default: '3.0.0'
    })
  }

  async run() {
    const { args, flags } = this.parse(CreateAPICommand)
    const identifier = getIdentifierArg(args)

    const [owner, name, version] = identifier.split('/')

    const getApiResult = await getApiVersions({ pathParams: [owner, name] })
    if (getApiResult.status === 200) {
      this.error(`API '${owner}/${name}' already exists in SwaggerHub`, { exit: 1 })
    } else if (getApiResult.status === 404) {
      const queryParams = { 
        version: version, 
        isPrivate: flags.visibility==='private', 
        oas: flags.oasVersion 
      }
      const obj = { 
        pathParams: [owner, name], 
        queryParams: queryParams, 
        body: readFileSync(flags.file) 
      }
      await postApi(obj).then(createApiResult => {
        if (createApiResult.ok) {
          this.log(`Created API ${owner}/${name}`)
        } else {
          this.error('Error creating API')
        }
      })
    } else {
      this.error(`Error creating API '${identifier}'`)
    }
  }
}

CreateAPICommand.description = `Creates API in SwaggerHub
Creates API in SwaggerHub. Fails if API already exists
`

module.exports = CreateAPICommand