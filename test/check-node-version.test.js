import { expect } from '@oclif/test'
import fs from 'node:fs'

const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const moduleUrl = new URL('../src/check-node-version.js', import.meta.url).href
const originalVersion = process.version

const setNodeVersion = version => Object.defineProperty(process, 'version', { value: version, configurable: true })

describe('check-node-version', () => {
  afterEach(() => setNodeVersion(originalVersion))

  it('does not throw when node version satisfies engines.node', async () => {
    setNodeVersion('v99.0.0')
    await import(`${moduleUrl}?satisfied`)
  })

  it('throws when node version does not satisfy engines.node', async () => {
    setNodeVersion('v1.0.0')
    let error
    try {
      await import(`${moduleUrl}?unsatisfied`)
    } catch (err) {
      error = err
    }
    expect(error).to.be.an('error')
    expect(error.message).to.contain('v1.0.0')
    expect(error.message).to.contain(packageJson.engines.node)
  })
})
