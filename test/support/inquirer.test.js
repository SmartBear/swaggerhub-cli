import { expect, test } from '@oclif/test'
import { wrapTemplates, isEqual } from '../../src/utils/general.js'
import { getPrompts } from '../../src/support/inquirer/index.js'

const mockTemplates = wrapTemplates({
  q1: { q1: 'q1', options: '{{options}}' },
  q2: { q2: 'q2', options: '{{options}}' },
  q3: { q3: 'static-object', reason: 'we should handle both' }
})

describe('inquirer', () => {
  describe('getPrompts', () => {
    test.it('it should return a filtered list of questions', () => {
      const selected = ['q1', 'q2']
      const prompts = getPrompts(selected, mockTemplates)()


      expect(prompts.length).to.equal(2)
      expect(selected.every(k => !!prompts.find(p => p[k])))
    })

    test.it('it should support dynamic options', () => {
      const options = {
        option1: 'test option',
        option2: 'test option'
      }

      const prompts = getPrompts(['q1', 'q2'], mockTemplates)({ options })

      expect(prompts.length).to.equal(2)
      expect(prompts.every(p => isEqual(p.options, options))).to.equal(true)
    })
  })
})
