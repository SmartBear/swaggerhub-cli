const { flags } = require('@oclif/command')
const { postProject } = require('../../requests/project')
const {
    getProjectIdentifierArg,
    splitPathParams,
    splitFlagParams
} = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class CreateProjectCommand extends BaseCommand {

    async run() {
        const { args, flags } = this.parse(CreateProjectCommand)
        const projectPath = getProjectIdentifierArg(args)
        const [owner, name] = splitPathParams(projectPath)
        const body = {
            owner,
            name
        }
        // Append optional flags to body if present
        if (flags.description !== undefined) body.description = flags.description
        if (flags.apis !== undefined) body.apis = splitFlagParams(flags.apis)
        if (flags.domains !== undefined) body.domains = splitFlagParams(flags.domains)

        await this.createProject(owner, name, JSON.stringify(body))
    }

    async createProject(owner, projectName, body) {
        const createRequest = {
            pathParams: [owner],
            body
        }

        return this.executeHttp({
            execute: () => postProject(createRequest),
            onResolve: this.logCommandSuccess({ owner, projectName }),
            options: {}
        })
    }
}

CreateProjectCommand.description = 'Creates a new project in SwaggerHub.'

CreateProjectCommand.examples = [
    'swaggerhub project:create organization/new_project_name --description "project description"',
    'swaggerhub project:create organization/new_project_name -a "testapi1,testapi2"',
    'swaggerhub project:create organization/new_project_name --apis "testapi1,testapi2"',
    'swaggerhub project:create organization/new_project_name -d "testdomain3,testdomain4"',
    'swaggerhub project:create organization/new_project_name --domains "testdomain3,testdomain4"',
    'swaggerhub project:create organization/new_project_name -a "testapi1" -d "testdomain3" --description "description"'
]

CreateProjectCommand.args = [{
    name: 'OWNER/PROJECT_NAME',
    required: true,
    description: 'The new project to create'
}]

CreateProjectCommand.flags = {
    description: flags.string({
        description: 'Description of project',
        required: false
    }),
    apis: flags.string({
        char: 'a',
        description: 'Comma separated list of api names to include in project',
        required: false
    }),
    domains: flags.string({
        char: 'd',
        description: 'Comma separated list of domain names to include in project',
        required: false
    }),
    ...BaseCommand.flags
}

module.exports = CreateProjectCommand