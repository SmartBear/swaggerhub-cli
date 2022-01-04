const { expect, test } = require('@oclif/test')
const config = require('../../../../src/config')
const validIdentifier = 'testowner/testproject'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('invalid project:spec:add command issues', () => {
    test
        .command(['project:spec:add'])
        .exit(2)
        .it('runs project:spec:add with no identifier provided')

    test
        .command(['project:spec:add', 'invalid'])
        .exit(2)
        .it('runs project:spec:add with no project name specified')

    test
        .command(['project:spec:add', `${validIdentifier}`])
        .exit(2)
        .it('runs project:spec:add with no spec type or name')

    test
        .command(['project:spec:add', `${validIdentifier}`, 'notapis','testapiname'])
        .exit(2)
        .it('runs project:spec:add with invalid spec type')
})

describe('valid project:spec:add',
    () => {
        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .put(`/${validIdentifier}/apis/testapi`)
                .matchHeader('Content-Type', 'application/json')
                .reply(200)
            )
            .stdout()
            .command(['project:spec:add', `${validIdentifier}`,'apis','testapi'])
            .it('runs project:spec:add with \'apis\' spec type', ctx => {
                expect(ctx.stdout).to.contains('Added spec \'testapi\' (apis) to project \'testowner/testproject\'')
            })

        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .put(`/${validIdentifier}/domains/testdomain`)
                .matchHeader('Content-Type', 'application/json')
                .reply(200)
            )
            .stdout()
            .command(['project:spec:add', `${validIdentifier}`, 'domains', 'testdomain'])
            .it('runs project:spec:add with \'domains\' spec type', ctx => {
                expect(ctx.stdout).to.contains("Added spec 'testdomain' (domains) to project 'testowner/testproject'")
            })
    })

describe('invalid project:spec:add', () => {
    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .put(`/${validIdentifier}/apis/testapi`)
            .matchHeader('Content-Type', 'application/json')
            .reply(404, { message: 'Project \'testproject\' does not exist' })
        )
        .command(['project:spec:add', `${validIdentifier}`,'apis','testapi'])
        .catch(ctx => {
            expect(ctx.message).to.contains('Project \'testproject\' does not exist')
        })
        .it('runs project:spec:add with a project that doesn\'t exist')

    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .put(`/${validIdentifier}/apis/testapi`)
            .reply(404, { message: 'Unknown owner \'testowner\'' })
        )
        .command(['project:spec:add', `${validIdentifier}`,'apis','testapi'])
        .catch(ctx => {
            expect(ctx.message).to.equal('Unknown owner \'testowner\'')
        })
        .it('runs project:spec:add with an owner that doesn\'t exist')

    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .put(`/${validIdentifier}/apis/testapi`)
            .reply(409, {
                    'error': 'The spec already exists in the project'
                }
            )
        )
        .command(['project:spec:add', `${validIdentifier}`,'apis','testapi'])
        .catch(ctx => {
            expect(ctx.message).to.contains('The spec already exists in the project')
        })
        .it('runs project:spec:add with an api that already exists in the project')
})
