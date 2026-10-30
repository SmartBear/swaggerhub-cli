const { expect, test } = require('@oclif/test')
const { faker } = require('@faker-js/faker')
const config = require('../../../src/config')
const shubUrl = 'https://api.swaggerhub.com'

describe('valid domain:rename', () => {
  const newName = faker.lorem.word().toLowerCase()
  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/domains/org/domain/rename', {})
          .query({ newName: newName })
          .reply(200)
      )
      .stdout()
      .command(['domain:rename', 'org/domain', newName])
      .it('runs domain:rename with proper options', ctx => {
        expect(ctx.stdout).to.contain(`Renamed domain 'org/domain' to '${newName}'`)
      })
})

describe('failing domain:rename', () => {
  const newName = faker.lorem.word().toLowerCase()
  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/domains/org/domain/rename', {})
          .query({ newName: newName })
          .reply(403, { error: 'Forbidden', message: 'Access denied' })
      )
      .stdout()
      .command(['domain:rename', 'org/domain', newName])
      .exit(2)
      .it('Handles domain:rename error status code', ctx => {
        expect(ctx.stdout).to.contain('Renaming domain:')
      })
})

describe('invalid domain:rename command', () => {
  test
      .command(['domain:rename'])
      .catch(err => {
        expect(err.message).to.contain('Missing 2 required args')
      })
      .it('does not run domain:rename with no parameters')
  test
      .command(['domain:rename'])
      .exit(2)
      .it('does not run domain:rename with no parameters')

  test
      .command(['domain:rename', faker.lorem.word()])
      .catch(err => {
        expect(err.message).to.contain('Missing 1 required arg')
      })
      .it('does not run domain:rename with one parameter')
  test
      .command(['domain:rename', faker.lorem.word()])
      .exit(2)
      .it('does not run domain:rename with one parameter exit code 2')

  test
      .command(['domain:rename', faker.lorem.word(), faker.lorem.word()])
      .catch(err => {
        expect(err.message).to.contain('Argument must match OWNER/DOMAIN_NAME format')
      })
      .it('does not run domain:rename with wrong format domain identifier')
  test
      .command(['domain:rename', faker.lorem.word(), faker.lorem.word()])
      .exit(2)
      .it('does not run domain:rename with wrong format domain identifier exit code 2')

  test
      .command(['domain:rename', 'org/domain', `${faker.lorem.word()}*${faker.lorem.word()}`])
      .catch(err => {
        expect(err.message).to.contain('Argument must match DOMAIN_NEW_NAME format')
      })
      .it('does not run domain:rename with wrong new domain name format')
  test
      .command(['domain:rename', 'org/domain', `${faker.lorem.word()}*${faker.lorem.word()}`])
      .exit(2)
      .it('does not run domain:rename with wrong new domain name format exit code 2')
})

describe('domain:rename with --force', () => {
  const newName = faker.lorem.word().toLowerCase()
  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/domains/org/domain/rename', {})
          .query({ newName: newName, force: 'true' })
          .reply(200)
      )
      .stdout()
      .command(['domain:rename', 'org/domain', newName, '--force'])
      .it('passes force query param', ctx => {
        expect(ctx.stdout).to.contain(`Renamed domain 'org/domain' to '${newName}'`)
      })
})
