import semver from 'semver'
import packagePkg from '../package.json' with { type: 'json' }
const { engines } = packagePkg

const version = engines.node

const versionErrorMsg = () => (`
  The current node version
  ${process.version} does not 
  satisfy the required version ${version}.
`)

if (!semver.satisfies(process.version, version)) {
  throw new Error(versionErrorMsg())
}