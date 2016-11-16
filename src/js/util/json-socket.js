import Subscriber from './subscriber'
import PromiseWithTimeout from './promise'

const PING_DELAY = 3000
const PING_TIMEOUT = 3000
const PING_RETRIES = 5

const MAX_RETRY_DELAY = 10000

export default class JsonSocket extends Subscriber {
  constructor(url, options) {
    super()
    this.url = url
    this.options = options || {}
    this.retryCount = 0
    this._startPings()
  }

  connect() {
    this.missedPings = 0
    this.ws = new window.WebSocket(this.url)
    this._setupEvents()
    return this
  }

  send(data) {
    if (!this._isConnected()) {
      throw new Error('Web socket is not connected')
    }
    this.ws.send(JSON.stringify(data))
  }

  ping() {
    console.debug('PING')
    return new PromiseWithTimeout((resolve) => {
      this.send({ ping: true })
      this.onpong = resolve
    }, PING_TIMEOUT).finally(() => {
      this.onpong = null
    })
  }

  pong() {
    this.send({ pong: true })
  }

  close() {
    if (this.ws) {
      this.ws.close()
    }
  }

  _setupEvents() {
    this.ws.onopen = this._onOpen.bind(this)
    this.ws.onerror = this._onError.bind(this)
    this.ws.onclose = this._onClose.bind(this)
    this.ws.onmessage = this._onMessage.bind(this)
  }

  _startPings() {
    var self = this._startPings.bind(this)
    if (!this._isConnected()) {
      setTimeout(self, PING_DELAY)
      return
    }

    setTimeout(() => {
      this._reping().finally(self)
    }, PING_DELAY)
  }

  _reping() {
    return this.ping().then(() => {
      this.missedPings = 0
    }).catch((err) => {
      this.missedPings++
      if (this.missedPings >= PING_RETRIES) {
        this.close()
        this._retry()
      }
    })
  }

  _isConnected() {
    return this.ws && this.ws.readyState === this.ws.OPEN
  }

  _onOpen(event) {
    console.debug("WS connected")
    this.retryCount = 0
    this.emit('open', event)
  }

  _onMessage(event) {
    var msg = JSON.parse(event.data)
    if (msg.ping) {
      this.pong()
    } else if (msg.pong) {
      this.onpong && this.onpong()
    } else {
      this.emit('message', msg)
    }
  }

  _onError(event) {
    console.debug('WS ERROR')
    // this.emit('error', event)
  }

  _onClose(event) {
    console.debug('WS connection closed')
    if (!event.wasClean && this.options.retry) {
      this._retry()
    }
    this.emit('close', event)
  }

  _retry() {
    var delay = this._getRetryDelay()
    this.retryCount++
    console.debug('Retrying in', delay / 1000, 'seconds')
    setTimeout(this.connect.bind(this), delay)
  }

  _getRetryDelay() {
    return Math.min(MAX_RETRY_DELAY, 1000 * Math.pow(2, this.retryCount))
  }
}
