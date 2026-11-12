import { expect } from '@oclif/test'
import { run } from '../src/index.js'

describe('index', () => {
  it('exports the oclif run function', () => {
    expect(run).to.be.a('function')
  })
})
