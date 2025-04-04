const path = require('path')
const BaseCommand = require('../support/command/base-command')
const { getPrompts } = require('../support/inquirer')
const { setConfig, getConfig } = require('../config')

class ConfigureCommand extends BaseCommand {
  async run() {
    const prompts = getPrompts(['swaggerHubUrl','apiKey'])(getConfig())
    const { configDir } = this.config
    const configFilePath = [...configDir.split(path.sep), 'config.json'].join(path.sep)
    
    return import('inquirer')
      .then(module => module.default)
      .then(inquirer => inquirer.prompt(prompts))
      .then(setConfig)
      .then(this.logCommandSuccess({ configFilePath }))
      .catch(this.throwCommandError({ configFilePath }))
  }
}

ConfigureCommand.description = `configure application settings
Enter the SwaggerHub URL - default is https://api.swaggerhub.com
Customers with on-premise installations need to point this to their on-premise API, which is http(s)://{swaggerhub-host}/v1
Enter the API Key - this can be retrieved from https://app.swaggerhub.com/settings/apiKey
You can set these as environment variables: SWAGGERHUB_URL, SWAGGERHUB_API_KEY. These take priority over config settings.
`
module.exports = ConfigureCommand

