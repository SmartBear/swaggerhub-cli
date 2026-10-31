import { Args } from '@oclif/core'
import { saveSpectralRuleset } from '../../requests/spectral.js'
import { getSpectralIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import BaseCommand from '../../support/command/base-command.js'
import { PassThrough } from 'stream'
import { pipeAsync } from '../../utils/general.js'
import archiver from 'archiver'
import { getResponseContent } from '../../support/command/handle-response.js'

class UploadSpectralRulesetCommand extends BaseCommand {
  async run() {
    const { args } = await this.parse(UploadSpectralRulesetCommand)
    const rulesetPath = getSpectralIdentifierArg(args)

    const zippedDirectory = await this.zipTheDirectory(args.directory)
    await this.saveSpectralRuleset(rulesetPath, zippedDirectory)
  }

 async zipTheDirectory(directoryPath) {
    const archive = archiver('zip', { zlib: { level: 9 } })
    const passthrough = new PassThrough()

    archive.directory(directoryPath, false)
    await archive.finalize()
    archive.pipe(passthrough)
    return passthrough
  }

  saveSpectralRuleset(pathParams, zippedDirectory) {
    return this.executeHttp({
      execute: () => saveSpectralRuleset(pathParams, zippedDirectory),
        onResolve: pipeAsync(getResponseContent, JSON.parse),
        options: {}
    })
  }
}

UploadSpectralRulesetCommand.description = 'Create or update organization\'s Spectral ruleset'

UploadSpectralRulesetCommand.examples = [
  'swaggerhub spectral:upload my_organization/my_api_ruleset rules/',
]

UploadSpectralRulesetCommand.args = { 
  'OWNER/RULESET_NAME': Args.string({
    required: true,
    description: 'Organization\'s Spectral ruleset to create or update on SwaggerHub'
  }),
  'directory': Args.string({
    required: true,
    description: 'Relative path to directory with ruleset files'
  })
}

UploadSpectralRulesetCommand.flags = {
  ...BaseCommand.flags
}

export default UploadSpectralRulesetCommand
