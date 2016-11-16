import Promise from 'bluebird'

export default class PromiseWithTimeout {
  constructor(func, timeout) {
    var timer
    this.promise = new Promise((resolve, reject) => {
      function resolveWrapper(...args) { resolve(...args) }
      function rejectWrapper(...args) { reject(...args) }

      func(resolveWrapper, rejectWrapper)

      if (timeout) {
        timer = setTimeout(() => {
          reject({ timeout: true })
          resolve = reject = function() {}
        }, timeout)
      }
    }).finally(() => clearTimeout(timer))
  }

  then() {
    this.promise.then(...arguments)
    return this
  }

  catch() {
    this.promise.catch(...arguments)
    return this
  }

  finally() {
    this.promise.finally(...arguments)
    return this
  }

  timeout(func) {
    return this.catch((err) => {
      if (err.timeout) {
        return func(...arguments)
      }
    })
  }
}
