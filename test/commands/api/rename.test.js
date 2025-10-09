const { expect, test } = require('@oclif/test')
const { faker } = require('@faker-js/faker')
const config = require('../../../src/config')
const shubUrl = 'https://api.swaggerhub.com'

describe('valid api:rename', () => {
  const newName = faker.lorem.word().toLowerCase()
  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/apis/org/api/rename', {})
          .query({ newName: newName })
          .reply(200)
      )
      .stdout()
      .command(['api:rename', 'org/api', newName])
      .it('runs api:rename with proper options', ctx => {
        expect(ctx.stdout).to.contain(`Renamed API 'org/api' to '${newName}'`)
      })
});

describe('failing api:rename', () => {
  const newName = faker.lorem.word().toLowerCase()
  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/apis/org/api/rename', {})
          .query({ newName: newName })
          .reply(403, { error: 'Forbidden', message: 'Access denied' })
      )
      .stdout()
      .command(['api:rename', 'org/api', newName])
      .exit(2)
      .it('Handles api:rename error status code', ctx => {
        expect(ctx.stdout).to.contain('Renaming API:')
      })
});

describe('invalid api:rename command', () => {
  test
      .command(['api:rename'])
      .catch(err  =>{
        expect(err.message).to.contain('Missing 2 required args')
      })
      .it('does not run api:rename with no parameters')
  test
      .command(['api:rename'])
      .exit(2)
      .it('does not run api:rename with no parameters')

  test
      .command(['api:rename', faker.lorem.word()])
      .catch(err  =>{
        expect(err.message).to.contain('Missing 1 required arg')
      })
      .it('does not run api:rename with one parameter')
  test
      .command(['api:rename', faker.lorem.word()])
      .exit(2)
      .it('does not run api:rename with one parameter exit code 2')

  test
      .command(['api:rename', faker.lorem.word(), faker.lorem.word()])
      .catch(err  =>{
        expect(err.message).to.contain('Argument must match OWNER/API_NAME format')
      })
      .it('does not run api:rename with wrong format api identifier')
  test
      .command(['api:rename', faker.lorem.word(), faker.lorem.word()])
      .exit(2)
      .it('does not run api:rename with wrong format api identifier exit code 2')

  test
      .command(['api:rename', 'org/api', `${faker.lorem.word()}*${faker.lorem.word()}`])
      .catch(err  =>{
        expect(err.message).to.contain('Argument must match API_NEW_NAME format')
      })
      .it('does not run api:rename with wrong new api name format')
  test
      .command(['api:rename', 'org/api', `${faker.lorem.word()}*${faker.lorem.word()}`])
      .exit(2)
      .it('does not run api:rename with wrong new api name format exit code 2')
});