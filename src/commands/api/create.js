const { Command, flags } = require('@oclif/command')
const fs = require('../../support/fs')
const { getApiVersions, postApi } = require('../../actions/api')
const { validateObjectIdentifier } = require('../../utils/input-validation')

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
    const identifier = args.identifier

    if (!validateObjectIdentifier(identifier)) {
      console.log('in here')
      this.error('identifier must match {owner}/{api_name}/{version} format', { exit: 1 })
    }

    const [owner, name, version] = identifier.split('/')

    const result = await getApiVersions({ pathParams: [owner, name] })
    if (result.status === 200) {
      this.error(`API '${owner}/${name}' already exists in SwaggerHub`, { exit: 1 })
    } else if (result.status === 404) {
      const queryParams = { 
        version: version, 
        isPrivate: flags.visibility==='private', 
        oas: flags.oasVersion 
      }
      const obj = { 
        pathParams: [owner, name], 
        queryParams: queryParams, 
        body: fs.readFileSync(flags.file) 
      }
      await postApi(obj).then(result => {
        if (result.ok) {
          this.log(`Created API ${owner}/${name}`)
        } else {
          this.error('Error creating API', { exit: 1 })
        }
      })
    } else {
      this.error(`Error creating API '${identifier}'`, { exit: 1 })
    }
  }
}

CreateAPICommand.description = 'Creates API in SwaggerHub'

module.exports = CreateAPICommand