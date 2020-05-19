const jsonTemplate = require('json-templates')

const accept = jsonTemplate({
  'Accept': 'application/{{accept}}'
})

const auth = jsonTemplate({
  'Authorization': 'Bearer {{auth}}'
})

const contentType = jsonTemplate({
  'Content-Type': 'application/{{contentType}}'
})

const userAgent = jsonTemplate({
  'User-Agent': '{{userAgent}}'
})

module.exports = {
  accept,
  auth,
  contentType,
  userAgent
}