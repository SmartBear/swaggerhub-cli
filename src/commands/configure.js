const { Command } = require('@oclif/command')
const inquirer = require('inquirer')
const { getPrompts } = require('../support/inquirer')
const { setConfig, getConfig } = require('../config')

class ConfigureCommand extends Command {
  async run() {
    const prompts = getPrompts(['swaggerHubUrl','apiKey'])(getConfig())

    inquirer.prompt(prompts).then(setConfig)
  }
}

ConfigureCommand.description = `configure application settings
Enter the SwaggerHub URL - default is https://api.swaggerhub.com
Customers with on-premise installations need to point this to their on-premise API, which is http(s)://{swaggerhub-host}/v1
Enter the API Key - this can be retrieved from https://app.swaggerhub.com/settings/apiKey
You can set these as environment variables: SWAGGERHUB_URL, SWAGGERHUB_API_KEY. These take priority over config settings.
`
module.exports = ConfigureCommand
