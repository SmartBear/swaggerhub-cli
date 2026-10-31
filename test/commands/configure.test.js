import path from 'path'
import { expect, test } from '@oclif/test'
import inquirer from 'inquirer'
import sinon from 'sinon'
import { setConfig } from '../../src/config/index.js'

describe('configure command', () => {
  let promptStub

  beforeEach(() => {
    promptStub = sinon.stub(inquirer, 'prompt')
  })

  afterEach(() => {
    promptStub.restore()
  })

  describe('successful configuration', () => {
    test
      .do(() => promptStub.returns(Promise.resolve().then(setConfig)))
      .stdout()
      .command(['configure'])
      .it('runs sets up config and logs the location of the file', ctx => {
        const configFilePath = [...ctx.config.configDir.split(path.sep), 'config.json'].join(path.sep)
        expect(ctx.stdout).to.contain(`Saved config to ${configFilePath}`)
      })
  })
  
  describe('failed configuration', () => {
    test
      .do(() => promptStub.returns(Promise.reject()))
      .command(['configure'])
      .catch(err => expect(err.message).to.contain('Failed to write config to')) 
      .it('fails to setup the config and throws an error message')
  })
})


