const {Command, flags} = require('@oclif/command')
const fetch = require('node-fetch')
const fs = require('../../support/fs')
const { postApi } = require('../../services/actions')
const { validateObjectIdentifier } = require('../../services/input-validation')

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
    const {args, flags} = this.parse(CreateAPICommand)
    const identifier = args.identifier

    if (!validateObjectIdentifier(identifier)) {
      this.error('Identifier must match {owner}/{api_name}/{version} format', { exit : 1 })
    }

    const [owner, name, version] = identifier.split('/')
    const result = await fetch(`https://dev-api.swaggerhub.com/apis/${owner}/${name}`, {
      headers: {Authorization : '<API_KEY>'}
    })

    if (result.status === 200) {
      this.error(`API '${owner}/${name}' already exists in SwaggerHub`, { exit : 1 })
    } else if (result.status === 404) {
      var queryParams = { version: version, isPrivate:flags.visibility==='private', oas:flags.oasVersion };
      var headers = { 'Content-Type' : 'application/yaml', Authorization : '<API_KEY>'};
      const obj = { pathParams : [owner, name], headers : headers, queryParams : queryParams, body : fs.readFileSync(flags.file) }
      postApi(obj)
    } else {
      this.error(`Error creating API '${identifier}'`, { exit : 1 })
    }
  }
}

CreateAPICommand.description = `Creates API in SwaggerHub`

module.exports = CreateAPICommand