const semver = require('semver')
const { engines } = require('../package.json')

const version = engines.node

const versionErrorMsg = () => (`
  The current node version
  ${process.version} does not 
  satisfy the required version ${version}.
`)

if (!semver.satisfies(process.version, version)) {
  throw new Error(versionErrorMsg())
}