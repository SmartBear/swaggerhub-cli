const { expect, test } = require('@oclif/test')
const config = require('../../../src/config')
const validIdentifier = 'testowner/testproject'
const validOwner = 'testowner'
const shubUrl = 'https://test-api.swaggerhub.com'

describe('invalid project:create command issues', () => {
    test
        .command(['project:create'])
        .exit(2)
        .it('runs project:create with no identifier provided')

    test
        .command(['project:create', 'invalid'])
        .exit(2)
        .it('runs project:create with no project name specified')

    test
        .command(['project:create', `${validIdentifier}`, '-f "not a valid flag"'])
        .exit(2)
        .it('runs project:create with invalid flag')
})

describe('valid project:create',
    () => {
        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .post(`/${validOwner}`)
                .matchHeader('Content-Type', 'application/json')
                .reply(201)
            )
            .stdout()
            .command(['project:create', `${validIdentifier}`])
            .it('runs project:create with no flags', ctx => {
                expect(ctx.stdout).to.contains('Created project \'testowner/testproject\'')
            })

        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .post(`/${validOwner}`)
                .matchHeader('Content-Type', 'application/json')
                .reply(201)
            )
            .stdout()
            .command(['project:create', `${validIdentifier}`, '--apis=testapi1,testapi2'])
            .it('runs project:create with --apis flags', ctx => {
                expect(ctx.stdout).to.contains('Created project \'testowner/testproject\'')
            })

        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .post(`/${validOwner}`)
                .matchHeader('Content-Type', 'application/json')
                .reply(201)
            )
            .stdout()
            .command(['project:create', `${validIdentifier}`, '--apis="testapi1, testapi2,     testapi3"'])
            .it('runs project:create with --apis flags with whitespace characters', ctx => {
                expect(ctx.stdout).to.contains('Created project \'testowner/testproject\'')
            })

        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .post(`/${validOwner}`)
                .matchHeader('Content-Type', 'application/json')
                .reply(201)
            )
            .stdout()
            .command(['project:create', `${validIdentifier}`, '--domains="testdomain1,  testdomain2,        testdomain3"'])
            .it('runs project:create with --domains flags with whitespace characters', ctx => {
                expect(ctx.stdout).to.contains('Created project \'testowner/testproject\'')
            })

        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .post(`/${validOwner}`)
                .matchHeader('Content-Type', 'application/json')
                .reply(201)
            )
            .stdout()
            .command(['project:create', `${validIdentifier}`, '--domains=testdomain1,testdomain2'])
            .it('runs project:create with --domains flags', ctx => {
                expect(ctx.stdout).to.contains('Created project \'testowner/testproject\'')
            })

        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .post(`/${validOwner}`)
                .matchHeader('Content-Type', 'application/json')
                .reply(201)
            )
            .stdout()
            .command(['project:create', `${validIdentifier}`, '--description="test project description"'])
            .it('runs project:create with --description flag', ctx => {
                expect(ctx.stdout).to.contains('Created project \'testowner/testproject\'')
            })

        test
            .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
            .nock(`${shubUrl}/projects`, integration => integration
                .post(`/${validOwner}`)
                .matchHeader('Content-Type', 'application/json')
                .reply(201)
            )
            .stdout()
            .command([
                'project:create',
                `${validIdentifier}`,
                '--description="test project description"',
                '--domains=testdomain1,testdomain2',
                '--apis=testapi1,testapi2'
            ])
            .it('runs project:create with all valid flags', ctx => {
                expect(ctx.stdout).to.contains('Created project \'testowner/testproject\'')
            })
    })

describe('invalid project:create', () => {
    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .post(`/${validOwner}`)
            .matchHeader('Content-Type', 'application/json')
            .reply(409, { message: 'Project \'testproject\' already exists' })
        )
        .command(['project:create', `${validIdentifier}`])
        .catch(ctx => {
            expect(ctx.message).to.contains('Project \'testproject\' already exists')
        })
        .it('runs project:create with project name conflict')

    test
        .stub(config, 'getConfig', () => ({ SWAGGERHUB_URL: shubUrl }))
        .nock(`${shubUrl}/projects`, integration => integration
            .post(`/${validOwner}`)
            .reply(404, { message: 'Unknown owner \'testowner\'' })
        )
        .command(['project:create', `${validIdentifier}`])
        .catch(ctx => {
            expect(ctx.message).to.equal('Unknown owner \'testowner\'')
        })
        .it('runs project:create with an owner that doesn\'t exist')
})
