const { Flags, Args } = require('@oclif/core')
const BaseValidateCommand = require('../../../support/command/base-validate-command')
const { pipeAsync } = require('../../../utils/general')
const { getResponseContent } = require('../../../support/command/handle-response')
const { getStandardization } = require('../../../requests/standardization')

class ValidateDownloadRulesCommand extends BaseValidateCommand {
    async run() {
        const { flags, args } = await this.parse(ValidateDownloadRulesCommand)
        const organization = args['OWNER']
        const standardizationConfig = await this.getOrganizationStandardizationConfig(organization, flags)
        this.log(JSON.stringify(standardizationConfig, null, 2))
    }

    getOrganizationStandardizationConfig(orgName, queryParams) {
        return this.executeHttp({
            execute: () => getStandardization([orgName, 'spectral'], queryParams),
            onResolve: pipeAsync(getResponseContent, JSON.parse),
            options: {}
        })
    }
}

ValidateDownloadRulesCommand.description = `TODO`

ValidateDownloadRulesCommand.examples = [
    'swaggerhub api:validate:download-rules myOrg -s=true',
    'swaggerhub api:validate:download-rules myOrg --include-disabled-rules=true -s',
]

ValidateDownloadRulesCommand.args = {
    'OWNER': Args.string({
        required: true,
        description: 'Which organization standardization rules to fetch from SwaggerHub'
    })
}
ValidateDownloadRulesCommand.flags = {
    includeSystemRules: Flags.boolean({
        char: 's',
        description: 'Includes system rules in fetched organization\'s ruleset',
        required: false
    }),
    includeDisabledRules: Flags.boolean({
        char: 'd',
        description: 'Includes disabled rules in fetched organization\'s ruleset',
        required: false
    }),
    ...BaseValidateCommand.flags
}
module.exports = ValidateDownloadRulesCommand