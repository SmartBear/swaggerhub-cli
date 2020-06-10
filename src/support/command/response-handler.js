const { CLIError } = require('@oclif/errors')

const parseResponse = response => new Promise(resolve => response.text()
      .then(content => resolve({
        status: response.status,
        ok: response.ok,
        content: content,
      })))

const checkForErrors = ({ errOn404 = false } = {}) => response => {
  if (!errOn404 && response.status === 404) return Promise.resolve(response)

  if (!response.ok) return Promise.reject(response)

  return response.content
}

const handleErrors = ({ content }) => {
  const { message } = JSON.parse(content)
  throw new CLIError(message)
}

module.exports = {
  parseResponse,
  checkForErrors,
  handleErrors
}