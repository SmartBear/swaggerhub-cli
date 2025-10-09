const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const validIdentifier = 'testowner/testproject'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('valid project:delete', () => {
    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, api => api
            .delete(`/${validIdentifier}`)
            .reply(200, `Deleted project \'${validIdentifier}\'`)
        )
        .stdout()
        .command(['project:delete', 'testowner/testproject'])
        .it('runs project:delete and returns success response', ctx => {
            expect(ctx.stdout).to.contain(`Deleted project \'${validIdentifier}\'`)
        })
})

describe('invalid project:delete command problems', () => {
    test
        .stdout()
        .command(['project:delete'])
        .exit(2)
        .it('runs project:delete with no identifier provided')

    test
        .stdout()
        .command(['project:get', 'invalid'])
        .exit(2)
        .it('runs project:delete with invalid identifier provided')
})

describe('invalid project:delete', () => {
    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .delete(`/${validIdentifier}`)
            .reply(404, { message: 'The specified project was not found' })
        )
        .command(['project:delete', `${validIdentifier}`])
        .catch(ctx => {
            expect(ctx.message).to.equal('The specified project was not found')
        })
        .it('runs project:delete with a project that doesn\'t exist')
})