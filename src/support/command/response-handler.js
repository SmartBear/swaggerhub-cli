const { CLIError } = require('@oclif/errors')
const { hasJsonStructure } = require('../../utils/general')

const parseResponse = response => new Promise(resolve => response.text()
  .then(content => resolve({
    status: response.status,
    ok: response.ok,
    content: content,
  })))

const checkForErrors = ({ resolveStatus = [] } = {}) => response => {
  if (resolveStatus.includes(response.status) || response.ok) {
    return Promise.resolve(response)
  }

  return Promise.reject(response)
}

const getResponseContent = ({ content }) => content 
  ? Promise.resolve(content) 
  : Promise.reject(new Error('No content field provided'))

const parseResponseError = ({ content }) => !!content && hasJsonStructure(content)
  ? JSON.parse(content).message
  : 'Unknown Error'

const handleErrors = error => {
  const cliError = (error instanceof Error === true)
    ? error
    : parseResponseError(error)

  throw new CLIError(cliError)
}

module.exports = {
  parseResponse,
  checkForErrors,
  getResponseContent,
  handleErrors
}
