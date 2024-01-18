const { Flags, Args } = require('@oclif/core')
const BaseCommand = require('../../../support/command/base-command')
const { pipeAsync } = require('../../../utils/general')
const { getResponseContent } = require('../../../support/command/handle-response')
const { getStandardization } = require('../../../requests/standardization')

class ValidateDownloadRulesCommand extends BaseCommand {
    async run() {
        const { args, flags } = await this.parse(ValidateDownloadRulesCommand)

        const includeSystemRules = flags['include-system-rules'] ?? false
        const includeDisabledRules = flags['include-disabled-rules'] ?? false
        const organization = args['OWNER']

        const organizationRuleset = await this.getExportedOrganizationRuleset(organization, {includeSystemRules, includeDisabledRules})
        this.log(JSON.stringify(organizationRuleset, null, 2))
    }

    getExportedOrganizationRuleset(orgName, queryParams) {
        return this.executeHttp({
            execute: () => getStandardization([orgName, 'spectral'], queryParams),
            onResolve: pipeAsync(getResponseContent, JSON.parse),
            options: {}
        })
    }
}

ValidateDownloadRulesCommand.description = `Get existing SwaggerHub's organization standardization ruleset.
Requires organization name argument. An error will occur if provided organization is non existing
or your account is not permitted to access that organization settings.
If the flag \`-s\` or \`--include-system-rules\` is used, the returned ruleset will also include SwaggerHub system rules.
If the flag \`-d\` or \`--include-disabled-rules\` is used, the returned ruleset will also include disabled custom rules`

ValidateDownloadRulesCommand.examples = [
    'swaggerhub api:validate:download-rules myOrg -s',
    'swaggerhub api:validate:download-rules myOrg --include-disabled-rules -s',
]

ValidateDownloadRulesCommand.args = {
    'OWNER': Args.string({
        required: true,
        description: 'Which organization standardization rules to fetch from SwaggerHub'
    })
}
ValidateDownloadRulesCommand.flags = {
    'include-system-rules': Flags.boolean({
        char: 's',
        description: 'Includes system rules in fetched organization\'s ruleset',
        required: false
    }),
    'include-disabled-rules': Flags.boolean({
        char: 'd',
        description: 'Includes disabled rules in fetched organization\'s ruleset',
        required: false
    }),
    ...BaseCommand.flags
}
module.exports = ValidateDownloadRulesCommand