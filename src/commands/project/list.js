const { cli } = require('cli-ux')
const { getProject } = require('../../requests/project')
const { getResponseContent } = require('../../support/command/handle-response')
const BaseCommand = require('../../support/command/base-command')

class ListProjectCommand extends BaseCommand {
    constructor(...props) {
        super(...props)
        this.logProject = this.logProject.bind(this)
    }

    async run() {
        const { args } = this.parse(ListProjectCommand)
        await this.listProjects(args['[OWNER]'])
    }

    async logProject(response) {
        const responseObj = JSON.parse(await getResponseContent(response))
        const projectCount = responseObj.projects.length
        this.log(`Found ${ projectCount } project${ projectCount > 1 ? 's' : '' }.`)
        cli.table(responseObj.projects, {
            name: {
                header: 'Name'
            },
            owner: {
                header: 'Owner'
            },
            description: {
                header: 'Description'
            },
            apis: {
                header: 'APIs'
            },
            domains: {
                header: 'Domains'
            }
        }, {
            printLine: this.log
        })
    }

    async listProjects(args) {
        return this.executeHttp({
            execute: () => getProject('projects', [args]),
            onResolve: this.logProject,
            options: {}
        })
    }
}

ListProjectCommand.description = 'list projects'

ListProjectCommand.examples = [
    'swaggerhub project:list organization'
]

ListProjectCommand.args = [{
    name: '[OWNER]',
    required: false,
    description: 'Organization to list projects for'
}]

ListProjectCommand.flags = {
    ...BaseCommand.flags
}

module.exports = ListProjectCommand