const { Args } = require('@oclif/core')
const { putProject } = require('../../../requests/project')
const {
    getProjectIdentifierArg
} = require('../../../support/command/parse-input')
const BaseCommand = require('../../../support/command/base-command')

class ProjectApiAddCommand extends BaseCommand {

    async run() {
        const { args } = await this.parse(ProjectApiAddCommand)
        const projectPath = getProjectIdentifierArg(args)
        const apiName = args['API']

        await this.addApiToProject(projectPath, apiName)
    }

    async addApiToProject(projectPath, apiName) {

        return this.executeHttp({
            execute: () => putProject({ pathParams: [projectPath, 'apis', apiName] }),
            onResolve: this.logCommandSuccess({ apiName, projectPath }),
            options: {}
        })
    }
}

ProjectApiAddCommand.description = 'Adds an API to an existing project.'


ProjectApiAddCommand.examples = [
    'swaggerhub project:api:add organization/project_name my_api'
]

ProjectApiAddCommand.args = {
    'OWNER/PROJECT_NAME': Args.string({
        required: true,
        description: 'The project to add the API to on Swaggerhub'
    }),
    'API': Args.string({
        required: true,
        description: 'The name of the API on Swaggerhub to add'
    })
}

module.exports = ProjectApiAddCommand