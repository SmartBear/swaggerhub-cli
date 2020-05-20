const promptTemplates = require('./prompt-templates')

const getPrompts = prompts => (
  (options = {}) => prompts.map(p => promptTemplates[p](options))
)

module.exports = {
  getPrompts
}