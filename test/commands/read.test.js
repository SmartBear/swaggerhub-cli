const { expect, test } = require('@oclif/test')
const fse = require('fs-extra')

const FAKE_FILE = '/tmp/test.txt'

describe('read', () => {

  test
    .stdout()
    .stub(fse, 'existsSync', path => path === FAKE_FILE)
    .stub(fse, 'readFileSync', () => 'one: 1')
    .command(['read', FAKE_FILE, '-p=/one'])
    .it('should return the value pointed to by the JSON Pointer', ctx => {
      expect(ctx.stdout).to.equal('1')
    })

  test
    .stdout()
    .stub(fse, 'existsSync', path => false)
    .command(['read', FAKE_FILE, '-p=/one'])
    .catch(err => expect(err.message).to.include('not found'))
    .it('should throw error if file does not exist')

  test
    .stdout()
    .stub(fse, 'existsSync', path => path === FAKE_FILE)
    .stub(fse, 'readFileSync', () => 'one: 1\n  two: 2')
    .command(['read', FAKE_FILE, '-p=/one'])
    .catch(err => expect(err.message).to.include('problem with parsing'))
    .it('should throw an error if it cannot parse definition')

  test
    .stdout()
    .stub(fse, 'existsSync', path => path === FAKE_FILE)
    .stub(fse, 'readFileSync', () => 'one: 1')
    .command(['read', FAKE_FILE, '-p=/three'])
    .catch(err => expect(err.message).to.include('Failed to find JSON Pointer'))
    .it('should throw error if JSON Pointer is not found')

  test
    .stdout()
    .stub(fse, 'existsSync', path => path === FAKE_FILE)
    .stub(fse, 'readFileSync', () => 'one: 1')
    .command(['read', FAKE_FILE, '-p=/three'])
    .catch(err => expect(err.message).to.include('Failed to find JSON Pointer'))
    .it('should output JSON for objects')

  test
    .stdout()
    .stub(fse, 'existsSync', path => path === FAKE_FILE)
    .stub(fse, 'readFileSync', () => 'one: 1')
    .command(['read', FAKE_FILE, '-p=/three'])
    .catch(err => expect(err.message).to.include('Failed to find JSON Pointer'))
    .it('should output JSON for objects')

})
