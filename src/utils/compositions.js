const pipe = val => (...fns) => (
  fns.reduce((acc, currentFn) => currentFn(acc), val)
)

module.exports = {
  pipe
}