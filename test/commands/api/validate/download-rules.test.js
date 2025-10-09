/* eslint-disable max-len */
const { expect, test } = require('@oclif/test')
const config = require('../../../../src/config')
const {
    ruleset,
    rulesetWithDisabledRule,
    rulesetWithSystemRule,
    rulesetWithDisabledAndSystemRule
} = require('../../../resources/rulesets')

const orgName = 'org1'
describe('invalid api:validate:download-rules', () => {
    test
        .stdout()
        .command(['api:validate:download-rules'])
        .exit(2)
        .it('runs api:validate:download-rules with no organization name provided')

    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
        .nock('https://api.swaggerhub.com/standardization',{ reqheaders: { Accept: 'application/json' } }, api => api
            .get('/org2/spectral')
            .query({ includeSystemRules: false, includeDisabledRules: false })
            .reply(404, 'Access Denied')
        )
        .command(['api:validate:download-rules', 'org2'])
        .exit(2)
        .it('Access Denied returned when trying to fetch ruleset of not existing or not available organization')

    test
        .stub(config, 'isURLValid', stub => stub.returns(false))
        .command(['api:validate:download-rules', 'org1'])
        .catch(ctx =>
            expect(ctx.message).to.equal('Please verify that the configured SwaggerHub URL is correct.')
        )
        .it('invalid SwaggerHub URL provided in the config')
})

describe('valid api:validate:download-rules', () => {
    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
        .nock('https://api.swaggerhub.com/standardization',{ reqheaders: { Accept: 'application/json' } }, api => api
            .get(`/${orgName}/spectral`)
            .query({ includeSystemRules: false, includeDisabledRules: false })
            .reply(200, ruleset)
        )
        .stdout()
        .command(['api:validate:download-rules', 'org1'])
        .it('runs api:validate:download-rules and returns organization rules without system rules nor disabled rules', ctx => {
            expect(ctx.stdout).to.contain(JSON.stringify(ruleset, null, 2))
        })

    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
        .nock('https://api.swaggerhub.com/standardization',{ reqheaders: { Accept: 'application/json' } }, api => api
            .get(`/${orgName}/spectral`)
            .query({ includeSystemRules: true, includeDisabledRules: false })
            .reply(200, rulesetWithSystemRule)
        )
        .stdout()
        .command(['api:validate:download-rules', 'org1', '-s'])
        .it('runs api:validate:download-rules and returns organization rules with system rules, but without disabled rules', ctx => {
            expect(ctx.stdout).to.contain(JSON.stringify(rulesetWithSystemRule, null, 2))
        })

    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
        .nock('https://api.swaggerhub.com/standardization',{ reqheaders: { Accept: 'application/json' } }, api => api
            .get(`/${orgName}/spectral`)
            .query({ includeSystemRules: false, includeDisabledRules: true })
            .reply(200, rulesetWithDisabledRule)
        )
        .stdout()
        .command(['api:validate:download-rules', 'org1', '-d'])
        .it('runs api:validate:download-rules and returns organization rules without system rules, but with disabled rules', ctx => {
            expect(ctx.stdout).to.contain(JSON.stringify(rulesetWithDisabledRule, null, 2))
        })


    test
        .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: 'https://api.swaggerhub.com' }))
        .nock('https://api.swaggerhub.com/standardization',{ reqheaders: { Accept: 'application/json' } }, api => api
            .get(`/${orgName}/spectral`)
            .query({ includeSystemRules: true, includeDisabledRules: true })
            .reply(200, rulesetWithDisabledAndSystemRule)
        )
        .stdout()
        .command(['api:validate:download-rules', 'org1', '-s', '-d'])
        .it('runs api:validate:download-rules and returns organization rules with system rules and disabled rules', ctx => {
            expect(ctx.stdout).to.contain(JSON.stringify(rulesetWithDisabledAndSystemRule, null, 2))
        })
})