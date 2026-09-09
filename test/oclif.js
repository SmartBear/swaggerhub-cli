const { Config } = require('@oclif/core')
const { runCommand } = require('@oclif/test')
const { expect } = require('chai')
const nock = require('nock')
const sinon = require('sinon')

class TestBuilder {
  constructor () {
    this.actions = []
    this.commandArgs = null
    this.envVars = {}
    this.errorHandler = null
    this.expectedExitCode = undefined
    this.nockDefs = []
    this.stubDefs = []
  }

  catch (handler) {
    this.errorHandler = handler
    return this
  }

  command (args) {
    this.commandArgs = args
    return this
  }

  do (fn) {
    this.actions.push(fn)
    return this
  }

  env (vars) {
    Object.assign(this.envVars, vars)
    return this
  }

  exit (code) {
    this.expectedExitCode = code
    return this
  }

  nock (baseUrl, optionsOrFactory, maybeFactory) {
    const options = typeof optionsOrFactory === 'function' ? undefined : optionsOrFactory
    const factory = typeof optionsOrFactory === 'function' ? optionsOrFactory : maybeFactory

    this.nockDefs.push({ baseUrl, factory, options })
    return this
  }

  stderr () {
    return this
  }

  stdout () {
    return this
  }

  stub (object, property, setup) {
    this.stubDefs.push({ object, property, setup })
    return this
  }

  it (title, assertion) {
    return it(title, async () => {
      const envKeys = Object.keys(this.envVars)
      const previousEnv = new Map(envKeys.map(key => [key, process.env[key]]))
      const stubs = []
      const scopes = []
      let context

      try {
        for (const [key, value] of Object.entries(this.envVars)) {
          process.env[key] = value
        }

        for (const { object, property, setup } of this.stubDefs) {
          const stub = sinon.stub(object, property)
          if (setup) setup(stub)
          stubs.push(stub)
        }

        for (const { baseUrl, factory, options } of this.nockDefs) {
          const scope = options ? nock(baseUrl, options) : nock(baseUrl)
          factory(scope)
          scopes.push(scope)
        }

        try {
          for (const action of this.actions) {
            context = await action(context)
          }

          if (!this.commandArgs) {
            if (this.errorHandler) {
              throw new Error('Expected operation to fail')
            }

            if (assertion) {
              await assertion(context)
            }

            return
          }

          const result = await runCommand(this.commandArgs)
          context = result.error ? Object.assign(result.error, result) : result
          context.config = await Config.load({ root: process.cwd() })
          context.stdout = context.stdout || undefined
          context.stderr = context.stderr || undefined

          const actualExitCode = result.error ? (result.error.oclif?.exit ?? 1) : 0
          if (this.expectedExitCode !== undefined) {
            expect(actualExitCode).to.equal(this.expectedExitCode)
          }

          if (result.error) {
            if (this.errorHandler) {
              await this.errorHandler(context)
            } else if (this.expectedExitCode === undefined) {
              throw context
            }
          } else if (this.errorHandler) {
            throw new Error('Expected command to fail')
          }
        } catch (error) {
          if (this.errorHandler) {
            context = error
            await this.errorHandler(error)
          } else {
            throw error
          }
        }

        if (assertion) {
          await assertion(context)
        }

        for (const scope of scopes) {
          scope.done()
        }
      } finally {
        for (const stub of stubs) {
          stub.restore()
        }

        nock.cleanAll()

        for (const key of envKeys) {
          const previousValue = previousEnv.get(key)
          if (previousValue === undefined) {
            delete process.env[key]
          } else {
            process.env[key] = previousValue
          }
        }
      }
    })
  }
}

const test = new Proxy({}, {
  get (_, property) {
    if (property === 'it') {
      return (...args) => new TestBuilder().it(...args)
    }

    return (...args) => new TestBuilder()[property](...args)
  }
})

module.exports = {
  expect,
  test
}
