import { Args } from '@oclif/core'
import { deleteProject } from '../../requests/project.js'
import { getProjectIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import BaseCommand from '../../support/command/base-command.js'

class DeleteProjectCommand extends BaseCommand {
    constructor(...props) {
        super(...props)
        this.setSuccessMessage('ProjectDelete')
    }

    async run() {
        const { args } = await this.parse(DeleteProjectCommand)
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

DeleteProjectCommand.args = {
    'OWNER/PROJECT_NAME': Args.string({
        required: true,
        description: 'The project to delete on Swaggerhub'
    })
}

DeleteProjectCommand.flags = {
    ...BaseCommand.flags
}

export default DeleteProjectCommand