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