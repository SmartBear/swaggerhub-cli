const { evaluateRules } = require('./ruleEngine');

function validateApi(apiSpec, rules) {
  return evaluateRules(apiSpec, rules);
}

module.exports = { validateApi };