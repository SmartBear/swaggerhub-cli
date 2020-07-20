const { Command, flags } = require('@oclif/command')
const { isURLValid } = require('../../config')
const {
  parseResponse,
  checkForErrors,
  handleErrors,
  filterResponseMessaging
} = require('./handle-response')

class BaseCommand extends Command {

  executeHttp({ execute, onResolve, onReject = handleErrors, options: { resolveStatus = [] } }) {

    if (!isURLValid()) {
      this.error('Please verify that the configured SwaggerHub URL is correct.')
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

module.exports = BaseCommand