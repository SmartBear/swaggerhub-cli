const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const validIdentifier = 'testowner/testproject'
const jsonResponse = {
    'owner': 'testowner',
    'name': 'testproject',
    'description': '',
    'apis': [
        'testapi'
    ],
    'domains': []
}

describe('invalid identifier on project:get', () => {
    test
        .stdout()
        .command(['project:get'])
        .exit(2)
        .it('runs project:get with no identifier provided')

    test
        .stdout()
        .command(['project:get', 'invalid'])
        .exit(2)
        .it('runs project:get with invalid identifier provided')
})

describe('valid identifier on project:get', () => {
    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://test.api.swaggerhub.com' }))
        .nock('https://test.api.swaggerhub.com/projects', { reqheaders: { Accept: 'application/json' } }, api => api
            .get(`/${validIdentifier}`)
            .reply(200, jsonResponse)
        )
        .stdout()
        .command(['project:get', 'testowner/testproject'])
        .it('runs project:get  returns response in json format', ctx => {
            expect(ctx.stdout).to.contains(JSON.stringify(jsonResponse, null, 2))
        })
})

describe('swaggerhub errors on project:get', () => {
    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://test.api.swaggerhub.com' }))
        .nock('https://test.api.swaggerhub.com/projects', api => api
            .get(`/${validIdentifier}`)
            .reply(500, { message: 'Internal Server Error' })
        )
        .command(['project:get', 'testowner/testproject'])
        .exit(2)
        .it('internal server error returned by SwaggerHub, command fails')

    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://test.api.swaggerhub.com' }))
        .nock('https://test.api.swaggerhub.com/projects', api => api
            .get(`/${validIdentifier}`)
            .reply(404, { message: 'Not found' })
        )
        .command(['project:get', 'testowner/testproject'])
        .exit(2)
        .it('not found returned by SwaggerHub, command fails')

    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://test.api.swaggerhub.com' }))
        .nock('https://test.api.swaggerhub.com/projects', api => api
            .get('/testowner/nonexistantproject')
            .reply(404, { message: 'Unknown project testowner/nonexistantproject' })
        )
        .command(['project:get', 'testowner/nonexistantproject'])
        .exit(2)
        .it('not found returned when fetching non-existant project')

    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: 'https://test.api.swaggerhub.com' }))
        .nock('https://test.api.swaggerhub.com/projects', api => api
            .get(`/${validIdentifier}`)
            .reply(200)
        )
        .command(['project:get', 'testowner/testproject'])
        .catch(ctx =>
            expect(ctx.message).to.equal('No content field provided')
        )
        .it('no content returned from swaggerhub')

    test
        .stub(config, 'isURLValid', () => false)
        .command(['project:get', 'testowner/testproject'])
        .catch(ctx =>
            expect(ctx.message).to.equal('Please verify that the configured SwaggerHub URL is correct.')
        )
        .it('invalid SwaggerHub URL')
})