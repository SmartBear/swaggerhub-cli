const { expect, test } = require('@oclif/test')
const ConfigureCommand = require('../../src/commands/configure')
const inquirer = require('inquirer')
const { setConfig } = require('../../src/config')

describe('successful configuration', () => {
  test
    .stub(ConfigureCommand, 'config', {
      configDir: 'pio'
    })
    .stub(inquirer, 'prompt', () => Promise.resolve().then(setConfig))
    .stdout()
    .command(['configure'])
    .it('runs sets up config and logs the location of the file', ctx => {
      expect(ctx.stdout).to.contains(`Config saved to ${ctx.config.configDir}`)
    })
})

describe('failed configuration', () => {
  test
    .stub(ConfigureCommand, 'config', {
      configDir: 'pio'
    })
    .stub(inquirer, 'prompt', () => Promise.reject())
    .stdout()
    .command(['configure'])
    .it('runs sets up config and logs the location of the file', ctx => {
      expect(ctx.stdout).to.contains(`Failed to write config to ${ctx.config.configDir}`)
    })
})