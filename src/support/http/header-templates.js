import { wrapTemplates } from '../../utils/general.js'

const accept = {
  'Accept': 'application/{{accept}}'
}

const auth = {
  'Authorization': 'Bearer {{auth}}'
}

const contentType = {
  'Content-Type': 'application/{{contentType}}'
}

export default wrapTemplates({
  accept,
  auth,
  contentType
})