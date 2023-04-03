const { Args } = require('@oclif/core')
const { putProject, getProject } = require('../../../requests/project')
const {
    getProjectIdentifierArg,
    splitPathParams,
} = require('../../../support/command/parse-input')
const BaseCommand = require('../../../support/command/base-command')
const { getResponseContent } = require('../../../support/command/handle-response')
const { pipeAsync } = require('../../../utils/general')

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

module.exports = ProjectApiRemoveCommand