const { deleteProject } = require('../../requests/project')
const { getProjectIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class DeleteProjectCommand extends BaseCommand {
    constructor(...props) {
        super(...props)
        this.setSuccessMessage('ProjectDelete')
    }

    async run() {
        const { args } = this.parse(DeleteProjectCommand)
        const projectPath = getProjectIdentifierArg(args)
        await this.deleteProject(projectPath)
    }

    async deleteProject(projectPath) {
        const [owner, projectName] = splitPathParams(projectPath)

        return this.executeHttp({
            execute: () => deleteProject([owner, projectName]),
            onResolve: this.logCommandSuccess({ projectPath }),
            options: {}
        })
    }
}

DeleteProjectCommand.description = 'Deletes a project from SwaggerHub.'

DeleteProjectCommand.examples = [
    'swaggerhub project:delete organization/project_name'
]

DeleteProjectCommand.args = [{
    name: 'OWNER/PROJECT_NAME',
    required: true,
    description: 'Project to delete'
}]

DeleteProjectCommand.flags = {
    ...BaseCommand.flags
}

module.exports = DeleteProjectCommand