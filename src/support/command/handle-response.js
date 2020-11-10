const { CLIError } = require('@oclif/errors')
const { hasJsonStructure, isError } = require('../../utils/general')
const { errorMsg } = require('../../template-strings')

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

const filterResponseMessaging = response => {
  if (response.status === 403) {
    return Promise.reject(response)
  }

  return Promise.resolve(response)
}

const getResponseContent = ({ content }) => content || Promise.reject(
  new Error(errorMsg.noContentField())
)

const parseContent = content => {
  const { message, error } = JSON.parse(content)
  return message || error
}

const parseResponseError = ({ content }) => hasJsonStructure(content)
  ? parseContent(content)
  : errorMsg.unknown()

const handleErrors = error => {
  const cliError = isError(error)
    ? error
    : parseResponseError(error)

  if (hasJsonStructure(cliError)) {
    return handleErrors({ content: cliError })
  }

  throw new CLIError(cliError)
}

module.exports = {
  parseResponse,
  checkForErrors,
  getResponseContent,
  handleErrors,
  filterResponseMessaging
}
