import semver from 'semver'
import packageJson from '../package.json' with { type: 'json' }
const { engines } = packageJson

const version = engines.node

const versionErrorMsg = () => (`
  The current node version
  ${process.version} does not 
  satisfy the required version ${version}.
`)

if (!semver.satisfies(process.version, version)) {
  throw new Error(versionErrorMsg())
}