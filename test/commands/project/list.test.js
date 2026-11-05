import { expect, test } from '@oclif/test'
import config from '../../../src/config/index.js'
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
            expect(ctx.stdout).to.contain('No projects found.')
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
            expect(ctx.stdout).to.contain('test_project_1')
            expect(ctx.stdout).to.contain('test_project_2')
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
            expect(ctx.stdout).to.contain('test_project_1')
            expect(ctx.stdout).to.contain('test_project_2')
        })

    const queryTest = (flags, query) => test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, { reqheaders: { accept: 'application/json' } }, projects => projects
            .get(`/${validOrgName}`)
            .query(query)
            .reply(200, projectsResponse)
        )
        .stdout()
        .command(['project:list', validOrgName, ...flags])

    queryTest(['--limit', '5'], { limit: 5 })
        .it('passes --limit as a query param', ctx => {
            expect(ctx.stdout).to.contain('test_project_1')
        })

    queryTest(['-l', '5'], { limit: 5 })
        .it('accepts -l as shorthand for --limit', ctx => {
            expect(ctx.stdout).to.contain('test_project_1')
        })

    queryTest(['--page', '2'], { page: 2 })
        .it('passes --page as a query param', ctx => {
            expect(ctx.stdout).to.contain('test_project_1')
        })

    queryTest(['--order', 'DESC'], { order: 'DESC' })
        .it('passes --order as a query param', ctx => {
            expect(ctx.stdout).to.contain('test_project_1')
        })

    queryTest(['--limit', '2', '--page', '1', '--order', 'ASC'], { limit: 2, page: 1, order: 'ASC' })
        .it('passes combined paging flags', ctx => {
            expect(ctx.stdout).to.contain('test_project_2')
        })

    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, { reqheaders: { accept: 'application/json' } }, projects => projects
            .get(`/${validOrgName}`)
            .query({ page: 3 })
            .reply(200, { projects: [] })
        )
        .stdout()
        .command(['project:list', validOrgName, '--page', '3'])
        .it('prints no projects message for an empty page', ctx => {
            expect(ctx.stdout).to.contain('No projects found.')
        })
})

describe('invalid project:list', () => {
    test
        .stdout()
        .command(['project:list', '--order', 'SIDEWAYS'])
        .catch(err => expect(err.message).to.contain('Expected --order=SIDEWAYS'))
        .it('rejects an invalid --order')

    test
        .stdout()
        .command(['project:list', '--limit', '0'])
        .catch(err => expect(err.message).to.contain('Expected an integer greater than or equal to 1'))
        .it('rejects --limit below 1')

    test
        .stdout()
        .command(['project:list', '--limit', '101'])
        .catch(err => expect(err.message).to.contain('Expected an integer less than or equal to 100'))
        .it('rejects --limit above 100')
})
