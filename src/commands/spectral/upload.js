const { Args } = require('@oclif/core')
const {saveSpectralRuleset} = require('../../requests/spectral')
const { getSpectralIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')
const { PassThrough } = require('stream')
const { pipeAsync } = require('../../utils/general')
const archiver = require('archiver')
const { getResponseContent } = require('../../support/command/handle-response')

class UploadSpectralRulesetCommand extends BaseCommand {
  async run() {
    const { args } = await this.parse(UploadSpectralRulesetCommand)
    const rulesetPath = getSpectralIdentifierArg(args)

    const zippedDirectory = await this.zipTheDirectory(args.directory)
    await this.saveSpectralRuleset(rulesetPath, zippedDirectory)
  }

 async zipTheDirectory(directoryPath) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const passthrough = new PassThrough();

    archive.directory(directoryPath, false);
    archive.finalize();
    archive.pipe(passthrough);
    return passthrough;
  }

  saveSpectralRuleset(pathParams, zippedDirectory) {
    return this.executeHttp({
      execute: () => saveSpectralRuleset(pathParams, zippedDirectory),
        onResolve: pipeAsync(getResponseContent, JSON.parse),
        options: {}
    })
  }
}

UploadSpectralRulesetCommand.description = `Create or update organization's Spectral ruleset`

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

module.exports = UploadSpectralRulesetCommand
