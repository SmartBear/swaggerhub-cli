import { getConfig } from '../config/index.js'

const isOnPrem = () => {
  const { SWAGGERHUB_URL } = getConfig()
  return !SWAGGERHUB_URL.endsWith('swaggerhub.com')
}

export {
  isOnPrem
}