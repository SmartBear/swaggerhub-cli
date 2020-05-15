const questions = require('./questions')

const parseQuestion = (question, options) => {
  if (typeof question === 'function') {
    return question(options)
  }

  return question
}

const getPrompts = prompts => (
  (options = {}) => prompts.map(p => parseQuestion(questions[p], options))
)

module.exports = {
  getPrompts
}