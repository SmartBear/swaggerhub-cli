const { CLIError } = require('@oclif/core').Errors
const { hasJsonStructure, isError } = require('../../utils/general')
const { errorMsg } = require('../../template-strings')

const parseResponse = response => new Promise(resolve => {

  const resolveContent = content => resolve({
    status: response.status,
    ok: response.ok,
    content,
  });

  const contentType = response.headers?.get('content-type') || '';
  if (contentType.includes('application/zip')) {
    response.buffer().then(resolveContent)
  } else {
    response.text().then(resolveContent)
  }
});

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

const getResponseContent = async ({ content } = {}) => {
  content = await content
  if (!content) {
    throw new CLIError(errorMsg.noContentField())
  }  
  return content
}

const parseContent = content => {
  const { message, error } = JSON.parse(content)
  return message || error
}

const parseResponseError = ({ content }) => hasJsonStructure(content)
  ? parseContent(content)
  : errorMsg.unknown()

const handleErrors = error => {
  const cliError = isError(error) ? error.message : parseResponseError(error)
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
