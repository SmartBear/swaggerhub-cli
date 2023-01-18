const { putProject, getProject } = require('../../../requests/project')
const {
    getProjectIdentifierArg,
    splitPathParams,
} = require('../../../support/command/parse-input')
const BaseCommand = require('../../../support/command/base-command')
const { getResponseContent } = require('../../../support/command/handle-response')
const { pipeAsync } = require('../../../utils/general')

class ProjectDomainRemoveCommand extends BaseCommand {

    async run() {
        const { args } = await this.parse(ProjectDomainRemoveCommand)
        const projectPath = getProjectIdentifierArg(args)
        const domainToRemove = args['DOMAIN']

        await this.removeDomainFromProject(projectPath, domainToRemove)
    }

    async getProjectDetails(owner, projectName) {
        return this.executeHttp({
            execute: () => getProject([owner, projectName]),
            onResolve: pipeAsync(getResponseContent, JSON.parse),
            options: {}
        })
    }

    async removeDomainFromProject(projectPath, domainName) {
        const [owner, projectName] = splitPathParams(projectPath)

        const project = await this.getProjectDetails(owner, projectName)
        if (project.domains && !project.domains.includes(domainName)) {
            return this.log(`Domain \'${domainName}\' does not exist in project \'${projectPath}\'`)
        }

        project.domains = project.domains.filter(item => item !== domainName)
        const updateRequest = {
            pathParams: [owner, projectName],
            body: JSON.stringify(project)
        }

        return this.executeHttp({
            execute: () => putProject(updateRequest),
            onResolve: this.logCommandSuccess({ domainName, projectPath }),
            options: {}
        })
    }
}

ProjectDomainRemoveCommand.description = 'Removes a domain from a project in SwaggerHub.'

ProjectDomainRemoveCommand.examples = [
    'swaggerhub project:domain:remove organization/project_name my_domain',
]

ProjectDomainRemoveCommand.args = [
    {
        name: 'OWNER/PROJECT_NAME',
        required: true,
        description: 'The project remove the domain from'
    },
    {
        name: 'DOMAIN',
        required: true,
        description: 'The domain to remove'
    }
]

module.exports = ProjectDomainRemoveCommand