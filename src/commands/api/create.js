const { Command, flags } = require('@oclif/command')
const { readFileSync } = require('../../support/fs')
const { getApiVersions, postApi } = require('../../actions/api')
const { getIdentifierArg } = require('../../utils/input-validation')

class CreateAPICommand extends Command {
  
  static args = [{ 
    name: 'identifier',
    required: true,
    description: 'identifier for API in {owner}/{api_name}/{version} format'
  }]

  static flags = {
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
        oas: flags.oas 
      }
      const createApiObject = {
        pathParams: [owner, name],
        queryParams: queryParams,
        body: readFileSync(flags.file)
      }
      await postApi(createApiObject).then(createApiResult => {
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

CreateAPICommand.description = `creates an API
command will fail if the API already exists.
`

module.exports = CreateAPICommand