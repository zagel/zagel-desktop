export default {
  empty() {},
  call(func, ...args) {
    return this.is(func) ? func(...args) : undefined
  },
  is(func) {
    return typeof func === 'function'
  },
}
