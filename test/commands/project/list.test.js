const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const validOrgName = 'MyTestOrg'
const shubUrl = 'https://test.api.swaggerhub.com'
const projectsResponse = {
    'projects': [
        {
            'name': 'test_project_1',
            'owner': validOrgName,
            'description': 'test description',
            'apis': ['testapi1'],
            'domains': ['testdomain1']
        },
        {
            'name': 'test_project_2',
            'owner': validOrgName,
            'description': 'test description',
            'apis': ['testapi2'],
            'domains': []
        },
    ]
}

describe('valid project:list', () => {
    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, { reqheaders: { accept: 'application/json' } }, projects => projects
            .get('/')
            .reply(200, { 'projects': [] })
        )
        .stdout()
        .command(['project:list'])
        .it('runs project:list with no arguments and finds no projects', ctx => {
            expect(ctx.stdout).to.contains('No projects found.')
        })

    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, { reqheaders: { accept: 'application/json' } }, projects => projects
            .get('/')
            .reply(200, projectsResponse)
        )
        .stdout()
        .command(['project:list'])
        .it('runs project:list with no arguments ands finds 2 projects', ctx => {
            expect(ctx.stdout).to.contains('test_project_1')
            expect(ctx.stdout).to.contains('test_project_2')
        })

    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, { reqheaders: { accept: 'application/json' } }, projects => projects
            .get(`/${validOrgName}`)
            .reply(200, projectsResponse)
        )
        .stdout()
        .command(['project:list', validOrgName])
        .it('runs project:list with org name', ctx => {
            expect(ctx.stdout).to.contains('test_project_1')
            expect(ctx.stdout).to.contains('test_project_2')
        })
})
