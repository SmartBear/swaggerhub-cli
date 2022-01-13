const { expect, test } = require('@oclif/test')
const config = require('../../../../src/config')
const validIdentifier= 'testowner/testproject'
const shubUrl = 'https://test.api.swaggerhub.com'
const membersResponse = {
    'members': [
        {
            'name': 'testuser',
            'type': 'USER',
            'roles': [
                'OWNER',
                'MEMBER'
            ]
        }
    ]
}

describe('valid project:member:list', () => {
    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, { reqheaders: { accept: 'application/json' } }, projects => projects
            .get(`/${validIdentifier}/members`)
            .reply(200, { members: [] })
        )
        .stdout()
        .command(['project:member:list', validIdentifier])
        .it('runs project:member:list ands finds no members', ctx => {
            expect(ctx.stdout).to.contain('No members found.')
        })

    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, { reqheaders: { accept: 'application/json' } }, projects => projects
            .get(`/${validIdentifier}/members`)
            .reply(200, membersResponse)
        )
        .stdout()
        .command(['project:member:list', validIdentifier])
        .it('runs project:member:list and finds one member', ctx => {
            expect(ctx.stdout).to.contain('testuser USER')
        })
})

describe('invalid project:list command issues', () => {
    test
        .command(['project:member:list'])
        .exit(2)
        .it('runs project:member:list with an no identifier')

    test
        .command(['project:member:list', 'testowner'])
        .exit(2)
        .it('runs project:member:list with an no project name')
})

describe('invalid project:list', () => {
    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, { reqheaders: { accept: 'application/json' } }, projects => projects
            .get(`/${validIdentifier}/members`)
            .reply(404, membersResponse)
        )
        .command(['project:member:list', 'testowner/testproject'])
        .exit(2)
        .it('project not found, command fails')
})

