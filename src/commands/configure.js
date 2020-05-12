const { Command } = require('@oclif/command')
const inquirer = require('inquirer')

const { getPrompts } = require('../support/inquirer')
const { setConfig } = require('../services/actions')
const { getConfig } = require('../services/queries')

class Configure extends Command {
  async run() {
    const prompts = getPrompts('swaggerHubUrl','apiKey')(getConfig())

    console.log(getConfig())

    inquirer.prompt(prompts).then(setConfig)
  }
}

Configure.description = 'Configure application settings'
module.exports = Configure
