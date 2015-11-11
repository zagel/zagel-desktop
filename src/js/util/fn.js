export default {
  empty() {},
  call(func, ...args) {
    return this.is(func) ? func.apply(null, args) : undefined;
  },
  is(func) {
    return typeof func === 'function';
  },
};
