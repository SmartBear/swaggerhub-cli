const { exit } = require('@oclif/core')
const { expect, test } = require('@oclif/test')
const inquirer = require('inquirer')
const config = require('../../../src/config')
const shubUrl = 'https://api.swaggerhub.com'

describe('valid api:rename', () => {
  test
      .stub(config, 'getConfig', stub => stub.returns({ SWAGGERHUB_URL: shubUrl }))
      .nock(`${shubUrl}`, api => api
          .post('/apis/org/api/rename', {})
          .query({ newName: 'newname' })
          .reply(200)
      )
      .stdout()
      .command(['api:rename', 'org/api', 'newname'])
      .it('runs api:rename with proper options', ctx => {
        expect(ctx.stdout).to.contain("Renamed API \'org/api\' to \'newname\'")
      })
});

describe('invalid api:rename', () => {
  test
      .command(['api:rename'])
      .catch(err  =>{
        expect(err.message).to.contain('Missing 2 required args')
      })
      .it('does not run api:publish with no parameters')

  test
      .command(['api:rename', 'api'])
      .catch(err  =>{
        expect(err.message).to.contain('Missing 1 required arg')
      })
      .it('does not run api:publish with one parameter')

  test
      .command(['api:rename', 'api', 'newname'])
      .catch(err  =>{
        expect(err.message).to.contain('Argument must match OWNER/API_NAME format')
      })
      .it('does not run api:publish with wrong format api identifier')

  test
      .command(['api:rename', 'org/api', 'invalid*name'])
      .catch(err  =>{
        expect(err.message).to.contain('Argument must match API_NEW_NAME format')
      })
      .it('does not run api:publish with wrong new api name format',)

});