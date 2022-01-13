const { expect, test } = require('@oclif/test')
const config = require('../../../../src/config')
const validIdentifier = 'testowner/testproject'
const shubUrl = 'https://test-api.swaggerhub.com'
const validProjectJson = {
    'owner': 'testowner',
    'name': 'testproject',
    'description': '',
    'apis': [],
    'domains': [
        'testdomain'
    ]
}


describe('invalid project:domain:remove command issues', () => {
    test
        .command(['project:domain:remove'])
        .exit(2)
        .it('runs project:domain:remove with no identifier provided')

    test
        .command(['project:domain:remove', 'invalid'])
        .exit(2)
        .it('runs project:domain:remove with no project name specified')

    test
        .command(['project:domain:remove', `${validIdentifier}`])
        .exit(2)
        .it('runs project:domain:remove with invalid no domain specified')
})

describe('valid project:domain:remove', () => {
        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
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
            .command(['project:domain:remove', `${validIdentifier}`, 'testdomain'])
            .it('runs project:domain:remove with a valid project and domain', ctx => {
                expect(ctx.stdout).to.contains('Removed domain \'testdomain\' from project \'testowner/testproject\'')
            })
    })

describe('invalid project:domain:remove', () => {
    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, project => project
            .get(`/${validIdentifier}`)
            .reply(404, { message: 'Project \'testproject\' does not exist' })
        )
        .command(['project:domain:remove', `${validIdentifier}`, 'testdomain'])
        .catch(ctx => {
            expect(ctx.message).to.contains('Project \'testproject\' does not exist')
        })
        .it('runs project:domain:remove with a project that doesn\'t exist')

    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, project => project
            .get(`/${validIdentifier}`)
            .reply(404, { message: 'Organization \'testowner\' does not exist' })
        )
        .command(['project:domain:remove', `${validIdentifier}`, 'testdomain'])
        .catch(ctx => {
            expect(ctx.message).to.contains('Organization \'testowner\' does not exist')
        })
        .it('runs project:domain:remove with an organization that doesn\'t exist')

    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, project => project
            .get(`/${validIdentifier}`)
            .reply(200, validProjectJson)
        )
        .stdout()
        .command(['project:domain:remove', `${validIdentifier}`, 'invalid'])
        .it('runs project:domain:remove with a domain that isn\'t in the project', ctx => {
            expect(ctx.stdout).to.contains('Domain \'invalid\' does not exist in project \'testowner/testproject\'')
        })

})
