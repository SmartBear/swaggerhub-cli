import promptTemplates from './prompt-templates.js'

const getPrompts = (prompts, templates = promptTemplates) => (
  (options = {}) => prompts.map(p => templates[p](options))
)

export {
  getPrompts
}