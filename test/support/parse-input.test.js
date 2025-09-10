const { expect } = require('@oclif/test')
const { CLIError } = require('@oclif/core').Errors 
const { parseDefinition } = require('../../src/utils/definitions')
const { 
  isValidIdentifier, 
  getApiIdentifierArg, 
  getDomainIdentifierArg,
  getProjectIdentifierArg,
  getSpectralIdentifierArg,
  readConfigFile,
  reqType,
  splitFlagParams
} = require('../../src/support/command/parse-input')

describe('reqType returns correct type', () => {

  context('reqType({json:true})', () => {
    it('should be json', () => {
      expect(reqType({ 'json': true })).to.equal('json')
    })
  })

  context('reqType({json:false})', () => {
    it('should be yaml', () => {
      expect(reqType({ 'json': false })).to.equal('yaml')
    })
  })

  context('reqType({})', () => {
    it('should be yaml', () => {
      expect(reqType({})).to.equal('yaml')
    })
  })
})

describe('splitFlagParams returns array of params', () => {

  context('splitFlagParams(\'testapi1,testapi2,testapi3\')', () => {
    it('should return 3 items', () => {
      expect(splitFlagParams('testapi1,testapi2,testapi3').length).to.equal(3)
    })
  })

  context('splitFlagParams(\'testapi1,    testapi2,     testapi3\')', () => {
    it('should return 3 items', () => {
      expect(splitFlagParams('testapi1,    testapi2,     testapi3').length).to.equal(3)
    })
  })

  context('splitFlagParams(\'testapi1\')', () => {
    it('should return 1 items', () => {
      expect(splitFlagParams('testapi1').length).lengthOf.to.equal(1)
    })
  })

  context('splitFlagParams(\'testapi1,,,,testapi2\')', () => {
    it('should return 3 items', () => {
      expect(splitFlagParams('testapi1,,,,testapi2').length).to.equal(2)
    })
  })

})

describe('Validate Object Identifier', () => {

  context('testing valid owner/api/version identifier', () => {
    it('should be true', () => {
      expect(isValidIdentifier('owner/api/123')).to.equal(true)
    })
  })

  context('testing valid api name with _ and -', () => {
    it('should be true', () => {
      expect(isValidIdentifier('owner/api-name_v2/12')).to.equal(true)
    })
  })

  context('testing valid version id using semantic versioning', () => {
    it('should be true', () => {
      expect(isValidIdentifier('MichaelMelodyDemoOrg/testing/1.0.0')).to.equal(true)
    })
  })

  context('testing invalid owner/api/version idenfitier', () => {
    it('should be false', function () {
      expect(isValidIdentifier('invalid_id/')).to.equal(false)
    })
  })
})

describe('getApiIdentifierArg', () => {

  context('valid version identifier', () => {
    it('should be returned', () => {
      expect(getApiIdentifierArg({ 'OWNER/API_NAME/VERSION': 'owner/api/123' })).to.equal('owner/api/123')
    })
  })

  context('valid identifier', () => {
    it('should be returned', () => {
      expect(getApiIdentifierArg({ 'OWNER/API_NAME/[VERSION]': 'owner/api' }, false)).to.equal('owner/api')
    })
  })

  context('invalid identifier', () => {
    it('should throw an exception', () => {
      expect(() => { getApiIdentifierArg({ 'OWNER/API_NAME/VERSION': 'owner/api/version/extra' })}).to.throw(CLIError)
    })
  })

  context('invalid identifier with space', () => {
    it('should throw an exception', () => {
      expect(() => { getApiIdentifierArg({ 'OWNER/API_NAME/VERSION': 'owner/api name/version' })}).to.throw(CLIError)
    })
  })

  context('invalid identifier with space and no version', () => {
    it('should throw an exception', () => {
      expect(() => { getApiIdentifierArg({ 'OWNER/API_NAME/[VERSION]': 'owner/api name' }, false)}).to.throw(CLIError)
    })
  })

  context('invalid identifier with version required', () => {
    it('should throw an exception', () => {
      expect(() => { getApiIdentifierArg({ 'OWNER/API_NAME/VERSION': 'owner/api' })}).to.throw(CLIError)
    })
  })
})

describe('getDomainIdentifierArg', () => {

  context('valid version identifier', () =>
    it('should be returned', () =>
      expect(getDomainIdentifierArg({ 'OWNER/DOMAIN_NAME/VERSION': 'owner/domain/123' })).to.equal('owner/domain/123')
    )
  )

  context('valid identifier', () =>
    it('should be returned', () =>
      expect(getDomainIdentifierArg({ 'OWNER/DOMAIN_NAME/[VERSION]': 'owner/domain' }, false)).to.equal('owner/domain')
    )
  )

  context('invalid identifier', () =>
    it('should throw an exception', () =>
      expect(() => { getDomainIdentifierArg({ 'OWNER/DOMAIN_NAME/VERSION': 'owner/domain/version/extra' })})
        .to.throw(CLIError)
    )
  )

  context('invalid identifier with space', () =>
    it('should throw an exception', () =>
      expect(() => { getDomainIdentifierArg({ 'OWNER/DOMAIN_NAME/VERSION': 'owner/domain name/version' })})
        .to.throw(CLIError)
    )
  )

  context('invalid identifier with space and no version', () => {
    it('should throw an exception', () =>
      expect(() => { getDomainIdentifierArg({ 'OWNER/DOMAIN_NAME/[VERSION]': 'owner/domain name' }, false)})
        .to.throw(CLIError)
    )
  })

  context('invalid identifier with version required', () =>
    it('should throw an exception', () =>
      expect(() => { getDomainIdentifierArg({ 'OWNER/DOMAIN_NAME/VERSION': 'owner/domain' })}).to.throw(CLIError)
    )
  )
})

describe('getProjectIdentifierArg', () => {

  context('valid identifier', () =>
      it('should be returned', () =>
          expect(getProjectIdentifierArg({ 'OWNER/PROJECT_NAME': 'owner/project_name' })).to.equal('owner/project_name')
      )
  )

  context('invalid identifier', () =>
      it('should throw an exception', () =>
          expect(() => { getProjectIdentifierArg({ 'OWNER/PROJECT_NAME': 'owner/project_name/extra' })})
              .to.throw(CLIError)
      )
  )

  context('invalid identifier with space', () =>
      it('should throw an exception', () =>
          expect(() => { getProjectIdentifierArg({ 'OWNER/PROJECT_NAME': 'owner/project name' })})
              .to.throw(CLIError)
      )
  )

  context('null identifier', () =>
      it('should throw an exception', () =>
          expect(() => { getProjectIdentifierArg({ 'OWNER/PROJECT_NAME': null })})
              .to.throw(CLIError)
      )
  )

})

describe('getSpectralIdentifierArg', () => {

  context('valid identifier', () =>
    it('should be returned', () =>
      expect(getSpectralIdentifierArg({ 'OWNER/RULESET_NAME': 'owner/ruleset' })).to.equal('owner/ruleset')
    )
  )

  context('invalid identifier', () =>
    it('should throw an exception', () =>
      expect(() => { getSpectralIdentifierArg({ 'OWNER/RULESET_NAME': 'owner/ruleset/1.2.3' })})
        .to.throw(CLIError)
    )
  )

  context('invalid identifier with space', () =>
    it('should throw an exception', () =>
      expect(() => { getSpectralIdentifierArg({ 'OWNER/RULESET_NAME': 'owner/ruleset name' })})
        .to.throw(CLIError)
    )
  )
})

describe('readConfigFile', () => {

  context('valid config file', () =>
    it('should return config content', () => {
      const config = readConfigFile('test/resources/github.json')
      const configString = String.fromCharCode.apply(null, config)
      expect(configString).to.contains('GitHub Integration Name')
    })
  )

  context('config file does not exist', () => 
    it('should return an error', () =>
      expect(() => readConfigFile('test/resources/missing_file.json'))
        .to.throw('File \'test/resources/missing_file.json\' not found')
    )
  )

  context('config file is empty', () => 
    it('should return an error', () =>
      expect(() => readConfigFile('test/resources/empty.yaml'))
        .to.throw('File \'test/resources/empty.yaml\' is empty')
    )
  )

  context('config file is not in JSON format', () => 
    it('should return an error', () =>
      expect(() => readConfigFile('test/resources/invalid_format.yaml'))
        .to.throw('Invalid configuration file. Please ensure that the file is in JSON format')
    )
  )
})

describe('parseDefinition', () => {
  context('call parseDefinition with nonexistent file', () => {
    it('should throw an exception', () => {
      expect(() => { parseDefinition('test/resources/missing_file.yaml')}).to.throw(CLIError)
    })
  })

  context('call parseDefinition with empty file', () => {
    it('should throw an exception', () => {
      expect(() => { parseDefinition('test/resources/empty.yaml')}).to.throw(CLIError)
    })
  })
})