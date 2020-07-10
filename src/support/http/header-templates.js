const { wrapTemplates } = require('../../utils/general')

const accept = {
  'Accept': 'application/{{accept}}'
}

const auth = {
  'Authorization': 'Bearer {{auth}}'
}

const contentType = {
  'Content-Type': 'application/{{contentType}}'
}

module.exports = wrapTemplates({
  accept,
  auth,
  contentType
})