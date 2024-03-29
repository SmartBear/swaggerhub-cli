const { Args } = require('@oclif/core')
const { putProject } = require('../../../requests/project')
const {
    getProjectIdentifierArg
} = require('../../../support/command/parse-input')
const BaseCommand = require('../../../support/command/base-command')

class ProjectDomainAddCommand extends BaseCommand {

    async run() {
        const { args } = await this.parse(ProjectDomainAddCommand)
        const projectPath = getProjectIdentifierArg(args)
        const domainName = args['DOMAIN']

        await this.addDomainToProject(projectPath, domainName)
    }

    async addDomainToProject(projectPath, domainName) {

        return this.executeHttp({
            execute: () => putProject({ pathParams: [projectPath, 'domains', domainName] }),
            onResolve: this.logCommandSuccess({ domainName, projectPath }),
            options: {}
        })
    }
}

ProjectDomainAddCommand.description = 'Adds a domain to an existing project.'


ProjectDomainAddCommand.examples = [
    'swaggerhub project:domain:add organization/project_name my_domain'
]

ProjectDomainAddCommand.args = {
    'OWNER/PROJECT_NAME': Args.string({
        required: true,
        description: 'The project to add the domain to on Swaggerhub'
    }),
    'DOMAIN': Args.string({
        required: true,
        description: 'The name of the domain on Swaggerhub to add'
    })
}

module.exports = ProjectDomainAddCommand