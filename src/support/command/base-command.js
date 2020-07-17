const { Command, flags } = require('@oclif/command')
const {
  parseResponse,
  checkForErrors,
  handleErrors,
  filterResponseMessaging
} = require('../../support/command/response-handler')
const { CLIError } = require('@oclif/errors')
const { getConfig } = require('../../config')


class BaseCommand extends Command {

  executeHttp({ execute, onSuccess, onFail = handleErrors, options: { resolveStatus = [] } }) {
    const { SWAGGERHUB_URL } = getConfig()
    if (SWAGGERHUB_URL !== 'https://api.swaggerhub.com' || !SWAGGERHUB_URL.endsWith('/v1')) {
      throw new CLIError('SwaggerHub URL validation failed.')
    }

    return execute()
      .then(parseResponse)
      .then(checkForErrors({ resolveStatus }))
      .then(filterResponseMessaging)
      .then(onSuccess)
      .catch(onFail)
  }
}

BaseCommand.flags = {
  help: flags.help({ char: 'h' })
}

BaseCommand.args = [{ 
  name: 'OWNER/API_NAME/VERSION',
  required: true,
  description: 'API identifier'
}]

module.exports = BaseCommand