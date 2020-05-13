const { Command } = require('@oclif/command')
const inquirer = require('inquirer')

const { getPrompts } = require('../support/inquirer')
const { setConfig, getConfig } = require('../services/config')

class Configure extends Command {
  async run() {
    const prompts = getPrompts('swaggerHubUrl','apiKey')(getConfig())

    inquirer.prompt(prompts).then(setConfig)
  }
}

Configure.description = 'Configure application settings'
module.exports = Configure
