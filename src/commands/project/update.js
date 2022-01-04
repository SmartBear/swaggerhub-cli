const { flags } = require('@oclif/command')
const { putProject } = require('../../requests/project')
const {
    getProjectIdentifierArg,
    splitPathParams,
    splitFlagParams
} = require('../../support/command/parse-input')
const BaseCommand = require('../../support/command/base-command')

class UpdateProjectCommand extends BaseCommand {

    async run() {
        const { args, flags } = this.parse(UpdateProjectCommand)
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

        await this.updateProject(owner, name, JSON.stringify(body))
    }

    async updateProject(owner, projectName, body) {
        const createRequest = {
            pathParams: [owner, projectName],
            body
        }

        return this.executeHttp({
            execute: () => putProject(createRequest),
            onResolve: this.logCommandSuccess({ owner, projectName }),
            options: {}
        })
    }
}

UpdateProjectCommand.description = 'Updates an existing project in SwaggerHub. ' +
    'NOTE: Any non-included previous values will be removed when using this command.' +
    'To add an single API or domain to a project, consider using project:api:add or project:domain:add'


UpdateProjectCommand.examples = [
    'swaggerhub project:update organization/project_name --description "project description"',
    'swaggerhub project:update organization/project_name --a "testapi1,testapi2"',
    'swaggerhub project:update organization/project_name --apis "testapi1,testapi2"',
    'swaggerhub project:update organization/project_name -d "testdomain3,testdomain4"',
    'swaggerhub project:update organization/project_name --domains "testdomain3,testdomain4"',
    'swaggerhub project:update organization/project_name --domains "testdomain3,testdomain4"',
    // eslint-disable-next-line max-len
    'swaggerhub project:update organization/project_name -a "testapi,testapi2" -d "testdomain,testdomain2" --description "description of project"'
]

UpdateProjectCommand.args = [{
    name: 'OWNER/PROJECT_NAME',
    required: true,
    description: 'The project to update'
}]

UpdateProjectCommand.flags = {
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

module.exports = UpdateProjectCommand