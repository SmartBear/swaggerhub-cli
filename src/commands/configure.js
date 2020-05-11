const { Command, flags } = require('@oclif/command')
const Config = require('../services/config');
const inquirer = require('inquirer');

class Configure extends Command {
  async run() {
    const userConfig = new Config(this.config.configDir);
    userConfig.load();

    var questions = [
      {
        name: 'swaggerHubUrl',
        message: "SwaggerHub URL:",
        default: userConfig.swaggerHubUrl
      },
      {
        type: 'input',
        name: 'apiKey',
        message: 'API Key',
        default: userConfig.apiKey || null
      }
    ];

    inquirer.prompt(questions).then(answers => {
      userConfig.swaggerHubUrl = answers.swaggerHubUrl
      userConfig.apiKey = answers.apiKey;
      userConfig.save();
    });
  }
}

Configure.description = `Configure application settings`
module.exports = Configure;
