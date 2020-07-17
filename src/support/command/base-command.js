const { Command, flags } = require('@oclif/command')
const {
  parseResponse,
  checkForErrors,
  handleErrors,
  filterResponseMessaging
} = require('../../support/command/response-handler')
const { isURLValid } = require('../../config')

class BaseCommand extends Command {

  executeHttp({ execute, onResolve, onReject = handleErrors, options: { resolveStatus = [] } }) {

    if (!isURLValid()) {
      this.error('Verify SwaggerHub URL is correct')
    } 

    return execute()
      .then(parseResponse)
      .then(checkForErrors({ resolveStatus }))
      .then(filterResponseMessaging)
      .then(onResolve)
      .catch(onReject)
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