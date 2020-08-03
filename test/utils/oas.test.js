const { expect, test } = require('@oclif/test')
const { parseDefinition } = require('../../src/utils/oas')
const fse = require('fs-extra')

describe('utils/oas ', () => {

  describe('parseDefinition', () => {

    test
      .stub(fse, 'existsSync', path => path === '/tmp/test.txt')
      .do(() => parseDefinition('/path/not/found'))
      .catch(err => {
        expect(err.message).to.include('not found')
        expect(err.message).to.include('path/not/found')
      })
      .it('should throw file missing error')

    test
      .stub(fse, 'existsSync', path => path === '/tmp/test.txt')
      .stub(fse, 'readFileSync', () => '{"one": 1}')
      .it('should read in a json file (mocked)', () => {
        const output = parseDefinition('/tmp/test.txt')
        expect(output).to.eql({ one: 1 })
      })

    test
      .stub(fse, 'existsSync', path => path === '/tmp/test.txt')
      .stub(fse, 'readFileSync', () => 'one: 1')
      .it('should read in a yaml file (mocked)', () => {
        const output = parseDefinition('/tmp/test.txt')
        expect(output).to.eql({ one: 1 })
      })

    test
      .stub(fse, 'existsSync', path => path === '/tmp/test.txt')
      .stub(fse, 'readFileSync', () => 'one: 1\n  invalid: true')
      .do(() => parseDefinition('/tmp/test.txt'))
      .catch(err => expect(err.message).to.include('bad indentation'))
      .it('should throw "bad indentation" for invalid data')

  })
})
