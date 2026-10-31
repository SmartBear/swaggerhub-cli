import { Args } from '@oclif/core'
import { getProject } from '../../requests/project.js'
import { getProjectIdentifierArg, splitPathParams } from '../../support/command/parse-input.js'
import { getResponseContent } from '../../support/command/handle-response.js'
import { prettyPrintJSON } from '../../utils/general.js'
import BaseCommand from '../../support/command/base-command.js'

class GetProjectCommand extends BaseCommand {
    constructor(...props) {
        super(...props)
        this.logProject = this.logProject.bind(this)
    }

    async run() {
        const { args } = await this.parse(GetProjectCommand)
        const projectPath = getProjectIdentifierArg(args)
        await this.getProject(projectPath)
    }

    async logProject(response) {
        const project = await getResponseContent(response)
        this.log(prettyPrintJSON(project))
    }

    async getProject(projectPath) {
        const [owner, project] = splitPathParams(projectPath)

        return this.executeHttp({
            execute: () => getProject([owner, project]),
            onResolve: this.logProject,
            options: {}
        })
    }
}

GetProjectCommand.description = 'Retrieves the details for a project.'

GetProjectCommand.examples = [
    'swaggerhub project:get organization/project_name'
]

GetProjectCommand.args = {
    'OWNER/PROJECT_NAME': Args.string({
        required: true,
        description: 'The project to get details for on Swaggerhub'
    })
}

GetProjectCommand.flags = {
    ...BaseCommand.flags
}

export default GetProjectCommand