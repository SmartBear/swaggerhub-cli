const { Command, flags } = require('@oclif/command')
const {
  parseResponse,
  checkForErrors,
  handleErrors,
  filterResponseMessaging
} = require('./handle-response')

class BaseCommand extends Command {
  
  executeHttp({ execute, onResolve, onReject = handleErrors, options: { resolveStatus = [] } }) {
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

module.exports = BaseCommand