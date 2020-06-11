const { CLIError } = require('@oclif/errors')
const { hasJsonStructure } = require('../../utils/general')

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

const parseContent = content => {
  const { message, error } = JSON.parse(content)
  return message || error
}

const replaceLink = error => error.replace(/[.].*::upgrade-link::/, '. You may need to upgrade your current plan.')

const handleErrors = ({ content }) => {
  const error = parseContent(content)
  if (hasJsonStructure(error)) {
    handleErrors({ content: error })
  }

  throw new CLIError(replaceLink(error))
}

module.exports = {
    parseResponse,
    checkForErrors,
    handleErrors
}