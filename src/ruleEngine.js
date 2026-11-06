function evaluateRules(apiSpec, rules) {
  const results = [];
  for (const rule of rules) {
    const { urlPattern, method } = rule;
    const paths = apiSpec.paths || {};
    
    for (const path in paths) {
      if (new RegExp(urlPattern).test(path)) {
        const methods = paths[path];
        if (methods[method.toLowerCase()]) {
          results.push({ path, method, status: 'matched' });
        }
      }
    }
  }
  return results;
}

module.exports = { evaluateRules };