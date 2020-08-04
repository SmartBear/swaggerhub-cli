const { expect, test } = require('@oclif/test')
const inquirer = require('inquirer')
const { setConfig } = require('../../src/config')

describe('successful configuration', () => {
  test
    .stub(inquirer, 'prompt', () => Promise.resolve().then(setConfig))
    .stdout()
    .command(['configure'])
    .it('sets up config and logs the location of the file', ctx => {
      expect(ctx.stdout).to.contains(`Config saved to ${ctx.config.configDir}`)
    })
})

describe('failed configuration', () => {
  test
    .stub(inquirer, 'prompt', () => Promise.reject())
    .command(['configure'])
    .catch(err => expect(err.message).to.contain('Failed to write config to')) 
    .it('fails to setup the config and throws an error message')
})
