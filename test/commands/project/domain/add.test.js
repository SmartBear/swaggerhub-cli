const { expect, test } = require('@oclif/test')
const config = require('../../../../src/config')
const validIdentifier = 'testowner/testproject'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('invalid project:domain:add command issues', () => {
    test
        .command(['project:domain:add'])
        .exit(2)
        .it('runs project:domain:add with no identifier provided')

    test
        .command(['project:domain:add', 'invalid'])
        .exit(2)
        .it('runs project:domain:add with no project name specified')

    test
        .command(['project:domain:add', `${validIdentifier}`])
        .exit(2)
        .it('runs project:domain:add with no domain name')
})

describe('valid project:domain:add',
    () => {
        test
            .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .put(`/${validIdentifier}/domains/testdomain`)
                .matchHeader('Content-Type', 'application/json')
                .reply(200)
            )
            .stdout()
            .command(['project:domain:add', `${validIdentifier}`, 'testdomain'])
            .it('runs project:domain:add', ctx => {
                expect(ctx.stdout).to.contains('Added domain \'testdomain\' to project \'testowner/testproject\'')
            })
    })

describe('invalid project:domain:add', () => {
    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .put(`/${validIdentifier}/domains/testdomain`)
            .matchHeader('Content-Type', 'application/json')
            .reply(404, { message: 'Project \'testproject\' does not exist' })
        )
        .command(['project:domain:add', `${validIdentifier}`,'testdomain'])
        .catch(ctx => {
            expect(ctx.message).to.contains('Project \'testproject\' does not exist')
        })
        .it('runs project:domain:add with a project that doesn\'t exist')

    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .put(`/${validIdentifier}/domains/testdomain`)
            .reply(404, { message: 'Unknown owner \'testowner\'' })
        )
        .command(['project:domain:add', `${validIdentifier}`, 'testdomain'])
        .catch(ctx => {
            expect(ctx.message).to.equal('Unknown owner \'testowner\'')
        })
        .it('runs project:domain:add with an owner that doesn\'t exist')

    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .put(`/${validIdentifier}/domains/testdomain`)
            .reply(409, {
                    'error': 'The spec already exists in the project'
                }
            )
        )
        .command(['project:domain:add', `${validIdentifier}`, 'testdomain'])
        .catch(ctx => {
            expect(ctx.message).to.contains('The spec already exists in the project')
        })
        .it('runs project:domain:add with a domain that already exists in the project')
})
