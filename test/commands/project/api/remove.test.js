const { expect, test } = require('@oclif/test')
const config = require('../../../../src/config')
const validIdentifier = 'testowner/testproject'
const shubUrl = 'https://test-api.swaggerhub.com'
const validProjectJson = {
    'owner': 'testowner',
    'name': 'testproject',
    'description': '',
    'apis': [
        'testapi'
    ],
    'domains': []
}


describe('invalid project:api:remove command issues', () => {
    test
        .command(['project:api:remove'])
        .exit(2)
        .it('runs project:api:remove with no identifier provided')

    test
        .command(['project:api:remove', 'invalid'])
        .exit(2)
        .it('runs project:api:remove with no project name specified')

    test
        .command(['project:api:remove', `${validIdentifier}`])
        .exit(2)
        .it('runs project:api:remove with invalid no api specified')
})

describe('valid project:api:remove', () => {
        test
            .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, project => project
                .get(`/${validIdentifier}`)
                .reply(200, validProjectJson)
            )
            .nock(`${shubUrl}/projects`, project => project
                .put(`/${validIdentifier}`)
                .matchHeader('Content-Type', 'application/json')
                .reply(200)
            )
            .stdout()
            .command(['project:api:remove', `${validIdentifier}`, 'testapi'])
            .it('runs project:api:remove with a valid project and api', ctx => {
                expect(ctx.stdout).to.contains('Removed api \'testapi\' from project \'testowner/testproject\'')
            })
    })

describe('invalid project:api:remove', () => {
    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, project => project
            .get(`/${validIdentifier}`)
            .reply(404, { message: 'Project \'testproject\' does not exist' })
        )
        .command(['project:api:remove', `${validIdentifier}`, 'testapi'])
        .catch(ctx => {
            expect(ctx.message).to.contains('Project \'testproject\' does not exist')
        })
        .it('runs project:api:remove with a project that doesn\'t exist')

    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, project => project
            .get(`/${validIdentifier}`)
            .reply(404, { message: 'Organization \'testowner\' does not exist' })
        )
        .command(['project:api:remove', `${validIdentifier}`, 'testapi'])
        .catch(ctx => {
            expect(ctx.message).to.contains('Organization \'testowner\' does not exist')
        })
        .it('runs project:api:remove with an organization that doesn\'t exist')

    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, project => project
            .get(`/${validIdentifier}`)
            .reply(200, validProjectJson)
        )
        .stdout()
        .command(['project:api:remove', `${validIdentifier}`, 'invalid'])
        .it('runs project:api:remove with an api that isn\'t in the project', ctx => {
            expect(ctx.stdout).to.contains('Api \'invalid\' does not exist in project \'testowner/testproject\'')
        })

})
