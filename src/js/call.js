import RTC from './rtc'
import {SignalingWithUser} from './signaling'
import Subscriber from './util/subscriber'
import config from './config'
import Promise from 'bluebird'

class BaseCall extends Subscriber {
  constructor(user) {
    super()
    this.user = user
    this.audioEnabled = true
    this.videoEnabled = true
    this.signaling = new SignalingWithUser(user)
  }

  audio(enabled) {
    this._updateStreams({audio: enabled, video: this.videoEnabled})
    return this
  }

  video(enabled) {
    this._updateStreams({video: enabled, audio: this.audioEnabled})
    return this
  }

  hangup() {
    if (this._stop()) {
      this.signaling.sendHangup()
    }
  }

  _stop() {
    if (this.pc) {
      this.pc.close()
      this.pc = null
      this.stream.stop()
      this.stream = null
      this._disconnected()
      return true
    }
    return false
  }

  _getMedia() {
    const mediaConstraints = {video: this.videoEnabled, audio: this.audioEnabled}
    return RTC.getMedia(mediaConstraints).then(stream => {
      this.stream = stream
      this.pc.addStream(this.stream)
      this.emit('self-stream', this.stream)
    })
  }

  _createPeerConnection() {
    var pc = new RTC.PeerConnection({iceServers: config.ICE_SERVERS})
    pc.onicecandidate = this._onIceCandidate.bind(this)
    pc.onaddstream = this._onRemoteStream.bind(this)
    this._waitFor('ice-candidate').then(this._onRemoteIceCandidate.bind(this))
    this._waitFor('hangup').then(this._stop.bind(this))
    pc.oniceconnectionstatechange = this._onIceCandidateStateChange.bind(this)
    return pc
  }

  _onRemoteStream(event) {
    if (event) {
      this.emit('remote-stream', event.stream)
    }
  }

  _onIceCandidate(event) {
    if (this.pc && event && event.candidate) {
      this.signaling.sendIceCandidate(event.candidate)
    }
  }

  _onRemoteIceCandidate(msg) {
    this.pc.addIceCandidate(new RTC.IceCandidate(msg.data))
  }

  _onIceCandidateStateChange() {
    if (this.pc && this.pc.iceConnectionState === 'disconnected') {
      console.debug('Peer disconnected')
      this._stop()
    }
  }

  _waitFor(type) {
    const event = 'receive-' + type
    console.debug('Waiting for:', event)
    return new Promise((resolve) => {
      this.signaling.once(event, (msg) => resolve(msg))
    })
  }

  _updateStreams({video, audio}) {
    if (this.active) {
      if (video !== this.videoEnabled) {
        // TODO: update current video stream.
        // http://stackoverflow.com/questions/22787549/accessing-multiple-camera-javascript-getusermedia
        // One solution would be to clone the media track then stop it. To re-enable, just add
        // the cloned media track to the stream (probably need to reset video.src)
      }
      if (audio !== this.audioEnabled) {
        // TODO: update current audio stream.
      }
    }
    this.videoEnabled = video
    this.audioEnabled = audio
  }

  _connected() {
    console.debug('Connected')
    this.emit('connected')
  }

  _disconnected() {
    console.debug('Disconnected')
    this.emit('disconnected')
  }
}

export class OutCall extends BaseCall {
  start() {
    this.pc = this._createPeerConnection()
    this._getMedia().then(this._initiate.bind(this))
    return this
  }

  _initiate() {
    this.pc.createOffer((sdp) => {
      this.pc.setLocalDescription(sdp)
      this.signaling.sendOffer(sdp)
      this._waitFor('answer').then(this._onAnswer.bind(this))
    }, this._stop.bind(this), config.SDP_CONSTRAINTS)
  }

  _onAnswer(msg) {
    this.pc.setRemoteDescription(new RTC.SessionDescription(msg.data))
    this._connected()
  }
}

export class InCall extends BaseCall {
  constructor(from, offer) {
    super(from)
    this.offer = offer
  }

  accept() {
    this._accepted()
    this.pc = this._createPeerConnection()
    this.pc.setRemoteDescription(new RTC.SessionDescription(this.offer))
    this._getMedia().then(this._respond.bind(this))
    return this
  }

  _respond() {
    this.pc.createAnswer((sdp) => {
      this.pc.setLocalDescription(sdp)
      this.signaling.sendAnswer(sdp)
      this._connected()
    }, this._stop.bind(this), config.SDP_CONSTRAINTS)
    return this
  }

  _accepted() {
    console.debug('Accepted call from:', this.user.id)
    this.emit('accepted')
  }
}
