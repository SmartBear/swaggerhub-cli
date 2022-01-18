const { getProject } = require('../../../requests/project')
const { getResponseContent } = require('../../../support/command/handle-response')
const BaseCommand = require('../../../support/command/base-command')
const { getProjectIdentifierArg } = require('../../../support/command/parse-input')
const { cli } = require('cli-ux')

class ListProjectMembersCommand extends BaseCommand {
    constructor(...props) {
        super(...props)
        this.logProjectMembers = this.logProjectMembers.bind(this)
    }

    async run() {
        const { args } = this.parse(ListProjectMembersCommand)
        const projectPath = getProjectIdentifierArg(args)
        await this.getProjectMembers(projectPath)
    }

    async logProjectMembers(response) {
        const responseObj = JSON.parse(await getResponseContent(response))
        if (responseObj.members.length === 0){
            this.log('No members found.')
        } else {
            cli.table(responseObj.members, {
                name: {
                    minWidth: 24
                },
                type: {}
            }, {
                printLine: this.log
            })
        }
    }

    async getProjectMembers(projectPath) {
        return this.executeHttp({
            execute: () => getProject([projectPath,'members']),
            onResolve: this.logProjectMembers,
            options: {}
        })
    }
}

ListProjectMembersCommand.description = 'list members of a project'

ListProjectMembersCommand.examples = [
    'swaggerhub project:member:list organisation/project_name',
]

ListProjectMembersCommand.args = [{
    name: 'OWNER/PROJECT_NAME',
    required: true,
    description: 'Project to list members of'
}]

ListProjectMembersCommand.flags = {
    ...BaseCommand.flags
}

module.exports = ListProjectMembersCommand