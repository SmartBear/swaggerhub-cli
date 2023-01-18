const { Command, Flags } = require('@oclif/core')
const { capitalise, pipeAsync } = require('../../utils/general')
const { infoMsg, errorMsg } = require('../../template-strings')
const { getApi } = require('../../requests/api')
const { getDomain } = require('../../requests/domain')
const { getResponseContent } = require('./handle-response')

const config = require('../../config')
const {
  parseResponse,
  checkForErrors,
  handleErrors,
  filterResponseMessaging
} = require('./handle-response')

const versionResponse = content => JSON.parse(content).version

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

  async ensureVersion(apiPath) {
    if (apiPath.split('/').length !== 3) {
      const version = await this.getDefaultApiVersion(apiPath.split('/'))
      return `${apiPath}/${version}`
    }
    return apiPath
  }

  async getDefaultApiVersion(identifier) {
    return this.executeHttp({
      execute: () => getApi([...identifier, 'settings', 'default']),
      onResolve: pipeAsync(getResponseContent, versionResponse),
      options: { resolveStatus: [403] }
    })
  }

  async getDefaultDomainVersion(identifier) {
    return this.executeHttp({
      execute: () => getDomain([...identifier, 'settings', 'default']),
      onResolve: pipeAsync(getResponseContent, versionResponse),
      options: { resolveStatus: [403] }
    })
  }
  
  executeHttp({ execute, onResolve, onReject = handleErrors, options: { resolveStatus = [] } }) {

    if (!config.isURLValid()) {
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
  help: Flags.help({ char: 'h' })
}

module.exports = BaseCommand