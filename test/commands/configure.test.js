const { expect, test } = require('@oclif/test')
const inquirer = require('inquirer')
const { setConfig } = require('../../src/config')

describe('successful configuration', () => {
  test
    .stub(inquirer, 'prompt', async () => Promise.resolve().then(setConfig))
    .stdout()
    .command(['configure'])
    .it('runs sets up config and logs the location of the file', ctx => {
      expect(ctx.stdout).to.contains(`Config saved to ${ctx.config.configDir}`)
    })
})

describe('failed configuration', () => {
    test
    .stub(inquirer, 'prompt', async () => Promise.reject())
    .stdout()
    .command(['configure'])
    .it('should log the attempted file location', ctx => {
      expect(ctx.stdout).to.contains(`Failed to write config to ${ctx.config.configDir}`)
    })
})