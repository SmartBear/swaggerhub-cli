const { Args , Errors } = require('@oclif/core')
const { getSpectralRuleset } = require('../../requests/spectral')
const { getSpectralIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { errorMsg } = require('../../template-strings')
const BaseCommand = require('../../support/command/base-command')
const unzipper = require('unzipper');
const fs = require('fs');

class UploadSpectralRulesetCommand extends BaseCommand {
  async run() {
    const { args } = await this.parse(UploadSpectralRulesetCommand)
    const rulesetPath = getSpectralIdentifierArg(args)
    const [owner, name, version = '1.0.0'] = splitPathParams(rulesetPath)
    const rulesetPathWithVersion = [owner, name, version].join('/')

    await this.getSpectralRuleset(rulesetPathWithVersion, args['directory'])
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
      throw err
    }
  }
}

UploadSpectralRulesetCommand.description = `Fetch organization's spectral ruleset`

UploadSpectralRulesetCommand.examples = [
  'swaggerhub spectral:download my_organization/my_api_ruleset/1.0.0 rules/',
  'swaggerhub spectral:download my_organization/my_api_ruleset rules/',
]

UploadSpectralRulesetCommand.args = { 
  'OWNER/RULESET_NAME/[VERSION]': Args.string({
    required: true,
    description: 'Organization\'s Spectral ruleset to create or update on SwaggerHub'
  }),
  'directory': Args.string({
    required: true,
    description: 'Relative path to directory the ruleset files should be saved to'
  })
}

UploadSpectralRulesetCommand.flags = {
  ...BaseCommand.flags
}

module.exports = UploadSpectralRulesetCommand
