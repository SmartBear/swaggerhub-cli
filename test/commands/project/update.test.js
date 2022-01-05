const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const validIdentifier = 'testowner/testproject'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('invalid project:update command issues', () => {
    test
        .command(['project:update'])
        .exit(2)
        .it('runs project:update with no identifier provided')

    test
        .command(['project:update', 'invalid'])
        .exit(2)
        .it('runs project:update with no project name specified')

    test
        .command(['project:update', `${validIdentifier}`, '-f "not a valid flag"'])
        .exit(2)
        .it('runs project:update with invalid flag')
})

describe('valid project:update',
    () => {
        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .put(`/${validIdentifier}`)
                .matchHeader('Content-Type', 'application/json')
                .reply(200)
            )
            .stdout()
            .command(['project:update', `${validIdentifier}`])
            .it('runs project:update with no flags', ctx => {
                expect(ctx.stdout).to.contains('Updated project \'testowner/testproject\'')
            })

        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .put(`/${validIdentifier}`)
                .matchHeader('Content-Type', 'application/json')
                .reply(200)
            )
            .stdout()
            .command(['project:update', `${validIdentifier}`, '--apis=testapi1,testapi2'])
            .it('runs project:update with --apis flags', ctx => {
                expect(ctx.stdout).to.contains('Updated project \'testowner/testproject\'')
            })

        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .put(`/${validIdentifier}`)
                .matchHeader('Content-Type', 'application/json')
                .reply(200)
            )
            .stdout()
            .command(['project:update', `${validIdentifier}`, '--domains=testdomain1,testdomain2'])
            .it('runs project:update with --domains flags', ctx => {
                expect(ctx.stdout).to.contains('Updated project \'testowner/testproject\'')
            })

        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .put(`/${validIdentifier}`)
                .matchHeader('Content-Type', 'application/json')
                .reply(200)
            )
            .stdout()
            .command(['project:update', `${validIdentifier}`, '--description="test project description"'])
            .it('runs project:update with --description flag', ctx => {
                expect(ctx.stdout).to.contains('Updated project \'testowner/testproject\'')
            })

        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .put(`/${validIdentifier}`)
                .matchHeader('Content-Type', 'application/json')
                .reply(200)
            )
            .stdout()
            .command([
                'project:update',
                `${validIdentifier}`,
                '--description="test project description"',
                '--domains=testdomain1,testdomain2',
                '--apis=testapi1,testapi2'
            ])
            .it('runs project:update with all valid flags', ctx => {
                expect(ctx.stdout).to.contains('Updated project \'testowner/testproject\'')
            })
    })

describe('invalid project:update', () => {
    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .put(`/${validIdentifier}`)
            .matchHeader('Content-Type', 'application/json')
            .reply(404, { message: 'Project \'testproject\' does not exist' })
        )
        .command(['project:update', `${validIdentifier}`])
        .catch(ctx => {
            expect(ctx.message).to.contains('Project \'testproject\' does not exist')
        })
        .it('runs project:update with a project that doesn\'t exist')

    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .put(`/${validIdentifier}`)
            .reply(404, { message: 'Unknown owner \'testowner\'' })
        )
        .command(['project:update', `${validIdentifier}`])
        .catch(ctx => {
            expect(ctx.message).to.equal('Unknown owner \'testowner\'')
        })
        .it('runs project:update with an owner that doesn\'t exist')

    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .put(`/${validIdentifier}`)
            .reply(400, {
                    'error': 'Unable to save project. Some api/domain entries are invalid.'
                }
            )
        )
        .command(['project:update', `${validIdentifier}`, '--apis=apithatdoesnotexist,testapi2'])
        .catch(ctx => {
            expect(ctx.message).to.contains('Unable to save project. Some api/domain entries are invalid.')
        })
        .it('runs project:update with an api that doesn\'t exist')
})
