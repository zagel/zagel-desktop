import { InCall, OutCall } from './call'
import { GlobalSignaling } from './signaling'
import Subscriber from './util/subscriber'

export default class CallManager extends Subscriber {
  constructor() {
    super()
    this.calls = {}
    this.activeCall = null
    this.signaling = new GlobalSignaling()
    this._waitForCalls()
  }

  getCallWith(user) {
    return this.calls[user.id]
  }

  stopActive() {
    this.activeCall && this.activeCall.hangup()
  }

  stopAll() {
    for (var id in this.calls) {
      this.calls[id].hangup()
    }
  }

  call(to) {
    this.stopActive()
    const outcall = new OutCall(to).start()
    this._addCall(to, outcall)
    this.activeCall = outcall
    return outcall
  }

  _waitForCalls() {
    this.signaling.on('receive-offer', ({ from, data }) => {
      console.debug('Received call from', from)
      const incall = new InCall(from, data)
      this._addCall(from, incall)
      this.emit('receive-call', incall)
      incall.on('accepted', () => {
        this.stopActive()
        this.activeCall = incall
      })
    })
  }

  _addCall(user, call) {
    this.calls[user.id] = call
    call.on('disconnected', () => {
      if (call === this.activeCall) {
        this.activeCall = null
      }
      delete this.calls[user.id]
    })
  }
}
