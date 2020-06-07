const { Command, flags } = require('@oclif/command')
const { parseResponse, checkForErrors, handleErrors } = require('../../support/command/response-handler')

class BaseCommand extends Command {
  
  execute(apiCall, success) {
    return apiCall()
    .then(parseResponse)
    .then(checkForErrors)
    .then(success)
    .catch(handleErrors)
  }
}

BaseCommand.flags = {
  help: flags.help({ char: 'h'})
}

BaseCommand.args = [{ 
  name: 'OWNER/API_NAME/VERSION',
  required: true,
  description: 'API identifier'
}]

module.exports = BaseCommand