const { putProject } = require('../../../requests/project')
const {
    getProjectIdentifierArg,
    getSpecTypeIdentifierArg
} = require('../../../support/command/parse-input')
const BaseCommand = require('../../../support/command/base-command')

class AddSpecCommand extends BaseCommand {

    async run() {
        const { args } = this.parse(AddSpecCommand)
        const projectPath = getProjectIdentifierArg(args)
        const specType = getSpecTypeIdentifierArg(args)
        const specName = args['SPEC_NAME']

        await this.addSpecToProject(projectPath, specType, specName)
    }

    async addSpecToProject(projectPath, specType, specName) {

        return this.executeHttp({
            execute: () => putProject({ pathParams: [projectPath, specType, specName] }),
            onResolve: this.logCommandSuccess({ specName, specType, projectPath }),
            options: {}
        })
    }
}

AddSpecCommand.description = 'Adds a spec to an existing project.'


AddSpecCommand.examples = [
    'swaggerhub project:spec:add organization/project_name apis my_api',
    'swaggerhub project:spec:add organization/project_name domains my_domain'
]

AddSpecCommand.args = [
    {
        name: 'OWNER/PROJECT_NAME',
        required: true,
        description: 'The project to add the spec to'
    },
    {
        name: 'SPEC_TYPE',
        required: true,
        description: 'The type of the spec to add, either \'apis\' or \'domains\''
    },
    {
        name: 'SPEC_NAME',
        required: true,
        description: 'The name of the spec to add'
    }
]

module.exports = AddSpecCommand