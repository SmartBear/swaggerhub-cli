import { Errors } from '@oclif/core'
const { CLIError } = Errors
import { hasJsonStructure } from './general.js'
import * as yaml from 'js-yaml'
import { existsSync, readFileSync } from 'node:fs'
import { errorMsg } from '../template-strings/index.js'

const specVersionToSpecification = specVersion => {
  if (/2.0$/.test(specVersion))
    return 'openapi-2.0'
  if (/2.\d+.\d+$/.test(specVersion))
    return 'asyncapi-2.x.x'
  if (/3.1.\d+$/.test(specVersion))
    return 'openapi-3.1.0'
  return 'openapi-3.0.0'
}

const getSpecification = ({ swagger, openapi, asyncapi }) => {
  if (!swagger && !openapi && !asyncapi) {
    throw new CLIError(errorMsg.cannotParseSpecification())
  }
  const specVersion = [swagger, openapi, asyncapi].filter(version => Boolean(version))[0]
  return specVersionToSpecification(specVersion)
}

const getVersion = definition => {
  if (definition.info && definition.info.version) {
    return definition.info.version
  }
  throw new CLIError(errorMsg.cannotParseVersion())
}

const parseDefinition = filename => {
  if (!existsSync(filename)) {
    throw new CLIError(errorMsg.fileNotFound({ filename }))
  }
  const file = readFileSync(filename)
  if (file.length === 0) {
    throw new CLIError(errorMsg.fileIsEmpty({ filename }))
  }
  try {
    return hasJsonStructure(file) ? JSON.parse(file) : yaml.load(file) 
  } catch (e) {
    throw new CLIError(errorMsg.cannotParseDefinition({ filename, e: JSON.stringify(e.message).replace(/\\n/g, '\n') }))
  }
}

export {
  getSpecification,
  getVersion,
  parseDefinition,
}