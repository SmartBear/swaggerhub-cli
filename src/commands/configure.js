import path from 'path'
import BaseCommand from '../support/command/base-command.js'
import prompts from '../support/inquirer/prompts.js'
import { getPrompts } from '../support/inquirer/index.js'
import { setConfig, getConfig } from '../config/index.js'

class ConfigureCommand extends BaseCommand {
  async run() {
    const questions = getPrompts(['swaggerHubUrl','apiKey'])(getConfig())
    const { configDir } = this.config
    const configFilePath = [...configDir.split(path.sep), 'config.json'].join(path.sep)
    
    return prompts.ask(questions)
      .then(setConfig)
      .then(this.logCommandSuccess({ configFilePath }))
      .catch(this.throwCommandError({ configFilePath }))
  }
}

ConfigureCommand.description = `configure application settings
Enter the Swagger URL - default is https://api.swaggerhub.com
Customers with on-premise installations (version 2.x) need to point this to their on-premise API, which is http(s)://{swaggerhub-host}/v1
Enter the API Key - this can be retrieved from https://app.swaggerhub.com/settings/apiKey
You can set these as environment variables: SWAGGERHUB_URL, SWAGGERHUB_API_KEY. These take priority over config settings.
`
export default ConfigureCommand

