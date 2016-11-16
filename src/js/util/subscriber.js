import EventEmitter from 'events'

export default class Subscriber extends EventEmitter {
  addListener(type, listener) {
    super.addListener(type, listener)
    return {
      release: () => this.removeListener(type, listener),
    }
  }

  on(...args) {
    return this.addListener(...args)
  }
}
