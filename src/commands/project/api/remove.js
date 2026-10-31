import { Args } from '@oclif/core'
import { putProject, getProject } from '../../../requests/project.js'
import { getProjectIdentifierArg, splitPathParams } from '../../../support/command/parse-input.js'
import BaseCommand from '../../../support/command/base-command.js'
import { getResponseContent } from '../../../support/command/handle-response.js'
import { pipeAsync } from '../../../utils/general.js'

class ProjectApiRemoveCommand extends BaseCommand {

    async run() {
        const { args } = await this.parse(ProjectApiRemoveCommand)
        const projectPath = getProjectIdentifierArg(args)
        const apiToRemove = args['API']

        await this.removeApiFromProject(projectPath, apiToRemove)
    }

    async getProjectDetails(owner, projectName) {
        return this.executeHttp({
            execute: () => getProject([owner, projectName]),
            onResolve: pipeAsync(getResponseContent, JSON.parse),
            options: {}
        })
    }

    async removeApiFromProject(projectPath, apiName) {
        const [owner, projectName] = splitPathParams(projectPath)

        const project = await this.getProjectDetails(owner, projectName)
        if (project.apis && !project.apis.includes(apiName)) {
            return this.log(`Api \'${apiName}\' does not exist in project \'${projectPath}\'`)
        }

        project.apis = project.apis.filter(item => item !== apiName)
        const updateRequest = {
            pathParams: [owner, projectName],
            body: JSON.stringify(project)
        }

        return this.executeHttp({
            execute: () => putProject(updateRequest),
            onResolve: this.logCommandSuccess({ apiName, projectPath }),
            options: {}
        })
    }
}

ProjectApiRemoveCommand.description = 'Removes an API from a project in SwaggerHub.'

ProjectApiRemoveCommand.examples = [
    'swaggerhub project:api:remove organization/project_name my_api',
]

ProjectApiRemoveCommand.args = {
    'OWNER/PROJECT_NAME': Args.string({
        required: true,
        description: 'The project to remove the API from on Swaggerhub'
    }),
    'API': Args.string({
        required: true,
        description: 'The name of the API on Swaggerhub to remove'
    })
}

export default ProjectApiRemoveCommand