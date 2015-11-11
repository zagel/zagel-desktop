import Actions from './flux/actions';
import JsonSocket from './util/json-socket';
import Subscriber from './util/subscriber';
import config from './config';

var instance;

class RawSignaling extends Subscriber {
  static get() {
    if (!instance) {
      instance = new RawSignaling();
    }
    return instance;
  }

  connect() {
    if (this.socket) {
      return this;
    }
    this.socket = new JsonSocket(config.WEBSOCKET_URL, {retry: true}).connect();
    this.socket.on('message', this._onMessage.bind(this));
    this.socket.on('close', this._onDisconnect.bind(this));
    return this;
  }

  send(msg) {
    this.socket.send(msg);
    console.debug('Sending: "' + msg.type + '" to ID:', msg.to.id);
  }

  _onMessage(msg) {
    Actions.receiveSocketMessage(msg);
    this.emit('msg', msg);
  }

  _onDisconnect(event) {
    // this.socket = null;
  }
}

window.signaling = RawSignaling.get();

export class GlobalSignaling extends Subscriber {
  constructor() {
    super();
    RawSignaling.get().connect().on('msg', this._onMessage.bind(this));
  }

  _onMessage(msg) {
    this.emit('receive-' + msg.type, msg);
  }
}

/**
 * Events: 'receive-offer', 'receive-answer', 'receive-ice-candidate',
 */
export class SignalingWithUser extends GlobalSignaling {
  constructor(withUser) {
    super();
    this.withUser = withUser;
  }

  sendOffer({sdp, type}) {
    return this.send('offer', {sdp, type});
  }

  sendAnswer({sdp, type}) {
    return this.send('answer', {sdp, type});
  }

  sendIceCandidate({candidate, sdpMLineIndex}) {
    return this.send('ice-candidate', {candidate, sdpMLineIndex});
  }

  sendHangup() {
    return this.send('hangup');
  }

  send(type, data) {
    return RawSignaling.get().send({to: this.withUser, type, data});
  }

  _onMessage(msg) {
    if (!msg.from || msg.from.id !== this.withUser.id) {
      return;
    }
    console.debug('Received: "' + msg.type + '" from ID:', this.withUser.id);
    super._onMessage(msg);
  }
}
