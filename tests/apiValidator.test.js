const { validateApi } = require('../src/apiValidator');

const mockSpec = {
  paths: {
    '/users': { get: {}, post: {} },
    '/orders': { get: {} }
  }
};

test('should validate rules using programmatic matching', () => {
  const rules = [
    { urlPattern: '^/users$', method: 'GET' },
    { urlPattern: '^/orders$', method: 'GET' }
  ];
  const results = validateApi(mockSpec, rules);
  expect(results.length).toBe(2);
  expect(results[0].path).toBe('/users');
  expect(results[1].path).toBe('/orders');
});