const { Command, flags } = require('@oclif/command')
const { pipeAsync } = require('../../utils/general')
const {
  parseResponse,
  checkForErrors,
  handleErrors,
  removeUpgradeLinkIfLimitsReached
} = require('../../support/command/response-handler')

class BaseCommand extends Command {
  
  executeHttp({ execute, onSuccess, onFail = handleErrors, options = { resolveStatus: [403] } }) {
    return pipeAsync(
      execute,
      parseResponse,
      checkForErrors({ resolveStatus: options.resolveStatus }),
      removeUpgradeLinkIfLimitsReached,
      onSuccess)()
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