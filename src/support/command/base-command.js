const { Command, flags } = require('@oclif/command')
const { capitalise } = require('../../utils/general')
const { infoMsg, errorMsg } = require('../../template-strings')

const { isURLValid } = require('../../config')
const {
  parseResponse,
  checkForErrors,
  handleErrors,
  filterResponseMessaging
} = require('./handle-response')

const idToCapitalCase = id => id.split(':')
  .map(capitalise)
  .join('')

class BaseCommand extends Command {
  constructor(...props) {
    super(...props)
    const msgKey = idToCapitalCase(this.id)
    
    this.setSuccessMessage = this.setSuccessMessage.bind(this)
    this.setErrorMessage = this.setErrorMessage.bind(this)

    this.logCommandSuccess = this.setSuccessMessage(msgKey)
    this.throwCommandError = this.setErrorMessage(msgKey)
  }

  setSuccessMessage(type) {
    return data => {
      const message = !!infoMsg[type] && infoMsg[type](data)
      return () => this.log(message)
    }
  }

  setErrorMessage(type) {
    return data => {
      const message = !!errorMsg[type] && errorMsg[type](data)
      return () => this.error(message, { exit: 1 })
    }
  }
  
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