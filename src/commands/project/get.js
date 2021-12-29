const { getProject } = require('../../requests/project')
const { getProjectIdentifierArg, splitPathParams } = require('../../support/command/parse-input')
const { getResponseContent } = require('../../support/command/handle-response')
const { prettyPrintJSON } = require('../../utils/general')
const BaseCommand = require('../../support/command/base-command')

class GetProjectCommand extends BaseCommand {
    constructor(...props) {
        super(...props)
        this.logProject = this.logProject.bind(this)
    }

    async run() {
        const { args } = this.parse(GetProjectCommand)
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

GetProjectCommand.description = 'Retrieves the details for a single project.'

GetProjectCommand.examples = [
    'swaggerhub project:get organization/project_name'
]

GetProjectCommand.args = [{
    name: 'OWNER/PROJECT_NAME',
    required: true,
    description: 'Project to retrieve the details for'
}]

GetProjectCommand.flags = {
    ...BaseCommand.flags
}

module.exports = GetProjectCommand