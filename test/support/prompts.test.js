import { expect } from 'chai'
import prompts from '../../src/support/inquirer/prompts.js'

describe('prompts', () => {
  describe('ask', () => {
    it('resolves to an empty object when there are no questions', async () => {
      expect(await prompts.ask([])).to.deep.equal({})
    })

    it('rejects a question with an unsupported type', async () => {
      const questions = [{ type: 'password', name: 'SWAGGERHUB_API_KEY', message: 'API Key:' }]
      let error
      try {
        await prompts.ask(questions)
      } catch (err) {
        error = err
      }
      expect(error).to.be.an('error')
      expect(error.message).to.equal("Unsupported prompt type 'password' for question 'SWAGGERHUB_API_KEY'")
    })
  })
})
