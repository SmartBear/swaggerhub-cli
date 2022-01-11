const { expect, test } = require('@oclif/test')
const config = require('../../../../src/config')
const validIdentifier = 'testowner/testproject'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('invalid project:api:add command issues', () => {
    test
        .command(['project:api:add'])
        .exit(2)
        .it('runs project:api:add with no identifier provided')

    test
        .command(['project:api:add', 'invalid'])
        .exit(2)
        .it('runs project:api:add with no project name specified')

    test
        .command(['project:api:add', `${validIdentifier}`])
        .exit(2)
        .it('runs project:api:add with no api')
})

describe('valid project:api:add',
    () => {
        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .put(`/${validIdentifier}/apis/testapi`)
                .matchHeader('Content-Type', 'application/json')
                .reply(200)
            )
            .stdout()
            .command(['project:api:add', `${validIdentifier}`,'testapi'])
            .it('runs project:api:add with \'apis\' spec type', ctx => {
                expect(ctx.stdout).to.contains('Added api \'testapi\' to project \'testowner/testproject\'')
            })
    })

describe('invalid project:api:add', () => {
    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .put(`/${validIdentifier}/apis/testapi`)
            .matchHeader('Content-Type', 'application/json')
            .reply(404, { message: 'Project \'testproject\' does not exist' })
        )
        .command(['project:api:add', `${validIdentifier}`, 'testapi'])
        .catch(ctx => {
            expect(ctx.message).to.contains('Project \'testproject\' does not exist')
        })
        .it('runs project:api:add with a project that doesn\'t exist')

    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .put(`/${validIdentifier}/apis/testapi`)
            .reply(404, { message: 'Unknown owner \'testowner\'' })
        )
        .command(['project:api:add', `${validIdentifier}`, 'testapi'])
        .catch(ctx => {
            expect(ctx.message).to.equal('Unknown owner \'testowner\'')
        })
        .it('runs project:api:add with an owner that doesn\'t exist')

    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .put(`/${validIdentifier}/apis/testapi`)
            .reply(409, {
                    'error': 'The spec already exists in the project'
                }
            )
        )
        .command(['project:api:add', `${validIdentifier}`, 'testapi'])
        .catch(ctx => {
            expect(ctx.message).to.contains('The spec already exists in the project')
        })
        .it('runs project:api:add with an api that already exists in the project')
})
