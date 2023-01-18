const { CliUx } = require('@oclif/core')
const { getProject } = require('../../requests/project')
const { getResponseContent } = require('../../support/command/handle-response')
const BaseCommand = require('../../support/command/base-command')

class ListProjectCommand extends BaseCommand {
    constructor(...props) {
        super(...props)
        this.logProject = this.logProject.bind(this)
    }

    async run() {
        const { args } = await this.parse(ListProjectCommand)
        await this.listProjects(args['OWNER'])
    }

    async logProject(response) {
        const responseObj = JSON.parse(await getResponseContent(response))
        if (responseObj.projects.length === 0){
            this.log('No projects found.')
        } else {
            CliUx.ux.table(responseObj.projects, {
                name: {},
                owner: {},
                description: {},
                apis: {
                    header: 'APIs'
                },
                domains: {}
            }, {
                printLine: this.log.bind(this)
            })
        }
    }

    async listProjects(args) {
        return this.executeHttp({
            execute: () => getProject([args]),
            onResolve: this.logProject,
            options: {}
        })
    }
}

ListProjectCommand.description = 'list projects'

ListProjectCommand.examples = [
    'swaggerhub project:list',
    'swaggerhub project:list organization'
]

ListProjectCommand.args = [{
    name: 'OWNER',
    required: false,
    description: 'Organization to list projects for'
}]

ListProjectCommand.flags = {
    ...BaseCommand.flags
}

module.exports = ListProjectCommand