const { Args , Errors } = require('@oclif/core')
const { getSpectralRuleset } = require('../../requests/spectral')
const { getSpectralIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { errorMsg } = require('../../template-strings')
const BaseCommand = require('../../support/command/base-command')
const unzipper = require('unzipper');
const fs = require('fs');

class DownloadSpectralRulesetCommand extends BaseCommand {
  async run() {
    const { args } = await this.parse(DownloadSpectralRulesetCommand)
    const rulesetPath = getSpectralIdentifierArg(args)

    await this.getSpectralRuleset(rulesetPath, args['directory'])
  }

  getSpectralRuleset(pathParams, outputDir) {
    return this.executeHttp({
      execute: () => getSpectralRuleset(pathParams),
        onResolve: response => this.extractZipResponse(response, outputDir),
        options: {}
    })
  }

  async extractZipResponse(response, outputDir) {
    const buffer = Buffer.from(response.content, 'binary');
    await this.createDirectory(outputDir)
    const directory = await unzipper.Open.buffer(buffer);
    await directory.extract({ path: outputDir });
  }

  async createDirectory(outputDir) {
    try {
      await fs.promises.mkdir(outputDir)
    } catch (err) {
      if (err.code === 'EEXIST') {
        throw new Errors.CLIError(errorMsg.directoryExists({ directory: outputDir }))
      }
      if (err.message) {
        throw new Errors.CLIError(err.message)
      }
      
      throw new Errors.CLIError(errorMsg.unknown())
    }
  }
}

DownloadSpectralRulesetCommand.description = `Fetch organization's Spectral ruleset`

DownloadSpectralRulesetCommand.examples = [
  'swaggerhub spectral:download my_organization/my_api_ruleset rules/',
]

DownloadSpectralRulesetCommand.args = { 
  'OWNER/RULESET_NAME': Args.string({
    required: true,
    description: 'Organization\'s Spectral ruleset to create or update on SwaggerHub'
  }),
  'directory': Args.string({
    required: true,
    description: 'Relative path to directory the ruleset files should be saved to'
  })
}

DownloadSpectralRulesetCommand.flags = {
  ...BaseCommand.flags
}

module.exports = DownloadSpectralRulesetCommand
