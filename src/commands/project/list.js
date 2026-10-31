const { ux, Args, Flags } = require('@oclif/core')
const { getProject } = require('../../requests/project')
const { getResponseContent } = require('../../support/command/handle-response')
const BaseCommand = require('../../support/command/base-command')

class ListProjectCommand extends BaseCommand {
    constructor(...props) {
        super(...props)
        this.logProject = this.logProject.bind(this)
    }

    async run() {
        const { args, flags } = await this.parse(ListProjectCommand)
        await this.listProjects(args['OWNER'], flags)
    }

    async logProject(response) {
        const responseObj = JSON.parse(await getResponseContent(response))
        if (responseObj.projects.length === 0){
            this.log('No projects found.')
        } else {
            ux.table(responseObj.projects, {
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

    async listProjects(owner, { limit, page, order }) {
        const queryParams = Object.fromEntries(
            Object.entries({ limit, page, order }).filter(([, value]) => value !== undefined)
        )
        return this.executeHttp({
            execute: () => getProject([owner], Object.keys(queryParams).length ? queryParams : undefined),
            onResolve: this.logProject,
            options: {}
        })
    }
}

ListProjectCommand.description = 'list projects'

ListProjectCommand.examples = [
    'swaggerhub project:list',
    'swaggerhub project:list organization',
    'swaggerhub project:list organization --limit 20 --order DESC',
    'swaggerhub project:list organization --page 2 --limit 20'
]

ListProjectCommand.args = {
    'OWNER': Args.string({
        required: false,
        description: 'The organization to list projects for on Swagger'
    })
}

ListProjectCommand.flags = {
    ...BaseCommand.flags,
    limit: Flags.integer({
        char: 'l',
        min: 1,
        max: 100,
        description: 'number of projects per page (1-100)'
    }),
    page: Flags.integer({
        min: 0,
        description: 'zero-based page of projects to return'
    }),
    order: Flags.string({
        options: ['ASC', 'DESC'],
        description: 'sort order of the projects'
    })
}

module.exports = ListProjectCommand