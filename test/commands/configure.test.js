const path = require('path')
const { expect, test } = require('@oclif/test')
const inquirer = require('inquirer')
const { setConfig } = require('../../src/config')

describe('successful configuration', () => {
  test
    .stub(inquirer, 'prompt', () => Promise.resolve().then(setConfig))
    .stdout()
    .command(['configure'])
    .it('runs sets up config and logs the location of the file', ctx => {
      const configFilePath = [...ctx.config.configDir.split(path.sep), 'config.json'].join(path.sep)
      expect(ctx.stdout).to.contains(`Saved config to ${configFilePath}`)
    })
})

describe('failed configuration', () => {
  test
    .stub(inquirer, 'prompt', () => Promise.reject())
    .command(['configure'])
    .catch(err => expect(err.message).to.contain('Failed to write config to')) 
    .it('fails to setup the config and throws an error message')
})
