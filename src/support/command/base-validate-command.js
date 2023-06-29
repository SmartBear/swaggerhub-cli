const { Flags, ux } = require('@oclif/core')
const BaseCommand = require('../../support/command/base-command')

class BaseValidateCommand extends BaseCommand {

    exitWithCode(flags, validationResult) {
        const hasCritical = validationResult.validation.some(err => err.severity.toUpperCase() === 'CRITICAL')
        const exitCode = hasCritical && flags['fail-on-critical'] ? 1 : 0
        this.exit(exitCode)
    }

    printValidationOutput(flags, validationResult) {
        if (validationResult.validation.length && !flags['to-json']) {
            ux.table(validationResult.validation, {
                line: {},
                severity: {},
                description: {},
            }, {
                printLine: this.log.bind(this)
            })
        } else {
            this.log(JSON.stringify(validationResult, null, 2))
        }
    }
}

BaseValidateCommand.flags = {
    'fail-on-critical': Flags.boolean({
        char: 'c',
        description: 'Exit with error code 1 if there are critical standardization errors present',
        default: false
    }),
    'to-json': Flags.boolean({
        char: 'j',
        description: 'Print output in JSON instead of table format',
        default: false
    }),
    ...BaseCommand.flags
}
module.exports = BaseValidateCommand