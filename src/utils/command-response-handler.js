const { CLIError } = require('@oclif/errors')

const parseResponse = response => new Promise(resolve => response.text()
      .then(content => resolve({
        status: response.status,
        ok: response.ok,
        content: content,
      })))

const checkForErrors = response => {
  if (!response.ok) return Promise.reject(response)

  return response.content
}

const handleErrors = ({ content }) => {
  const { message, error } = JSON.parse(content)
  if (message) {
    throw new CLIError(message)
  } else {
    throw new CLIError(error)
  }
}
module.exports = {
    parseResponse,
    checkForErrors,
    handleErrors
}