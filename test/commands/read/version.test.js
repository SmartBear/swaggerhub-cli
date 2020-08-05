const {expect, test} = require('@oclif/test')
const fse = require('fs-extra')

const FAKE_FILE = '/tmp/test.txt'

describe('read:version', () => {

  test
  .stdout()
  .stub(fse, 'existsSync', path => path === FAKE_FILE)
  .stub(fse, 'readFileSync', () => JSON.stringify({
    info: {
      version: '1.2.3'
    }
  }))
  .command(['read:version', FAKE_FILE])
  .it('return the version within the definition (raw)', ctx => {
    expect(ctx.stdout).to.equal('1.2.3')
  })

  test
  .stdout()
  .stub(fse, 'existsSync', path => path === FAKE_FILE)
  .stub(fse, 'readFileSync', () => JSON.stringify({
    info: {}
  }))
  .command(['read:version', FAKE_FILE])
  .catch(err => expect(err.message).to.include('Failed to find JSON Pointer'))
  .it('should throw an error if the version is missing from the definition')

})
