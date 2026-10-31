import { Args, Errors } from '@oclif/core'
import { getSpectralRuleset } from '../../requests/spectral.js'
import { getSpectralIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import { errorMsg } from '../../template-strings/index.js'
import BaseCommand from '../../support/command/base-command.js'
import unzipper from 'unzipper'
import fs from 'fs'

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
    const buffer = Buffer.from(response.content, 'binary')
    await this.createDirectory(outputDir)
    const directory = await unzipper.Open.buffer(buffer)
    await directory.extract({ path: outputDir })
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

DownloadSpectralRulesetCommand.description = 'Fetch organization\'s Spectral ruleset'

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

export default DownloadSpectralRulesetCommand
