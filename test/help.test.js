import { expect } from '@oclif/test'
import { Config } from '@oclif/core'
import { fileURLToPath } from 'node:url'
import CustomHelp from '../src/help.js'

describe('CustomHelp', () => {
  it('always shows all commands', async () => {
    const config = await Config.load(fileURLToPath(new URL('..', import.meta.url)))
    const help = new CustomHelp(config, { all: false })
    expect(help.opts.all).to.equal(true)
  })
})
