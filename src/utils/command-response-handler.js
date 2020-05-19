const { CLIError } = require('@oclif/errors')

const parseResponse = response => new Promise(resolve => response.text()
      .then(content => resolve({
        status: response.status,
        ok: response.ok,
        content: content,
      })))

const checkForErrors = response => {
  if (!response.ok) {
    const { message } = JSON.parse(response.content)
    throw new CLIError(message)
  }
  return response.content
}

module.exports = {
    checkForErrors,
    parseResponse
}