import Promise from 'bluebird';
import fn from './fn';

export default class PromiseWithTimeout {
  constructor(func, timeout) {
    var timer;
    this.promise = new Promise((resolve, reject) => {
      function resolveWrapper(...args) { resolve(...args); }
      function rejectWrapper(...args) { reject(...args); }

      func(resolveWrapper, rejectWrapper);

      if (timeout) {
        timer = setTimeout(() => {
          reject({timeout: true});
          resolve = reject = fn.empty;
        }, timeout);
      }
    }).finally(() => clearTimeout(timer));
  }

  then() {
    this.promise.then.apply(this.promise, arguments);
    return this;
  }

  catch() {
    this.promise.catch.apply(this.promise, arguments);
    return this;
  }

  finally() {
    this.promise.finally.apply(this.promise, arguments);
    return this;
  }

  timeout(func) {
    return this.catch((err) => {
      if (err.timeout) {
        return func.apply(null, arguments);
      }
    });
  }
}
