import Promise from 'bluebird'

// navigator.getUserMedia
const _getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia ||
                      navigator.webkitGetUserMedia || navigator.msGetUserMedia
// RTCPeerConnection
const PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||
                       window.webkitRTCPeerConnection || window.msRTCPeerConnection
// RTCSessionDescription
const SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription ||
                           window.webkitRTCSessionDescription || window.msRTCSessionDescription

const IceCandidate = window.RTCIceCandidate

export default {
  PeerConnection,
  SessionDescription,
  IceCandidate,

  getMedia(options) {
    return new Promise((resolve, reject) => _getUserMedia.call(navigator, options, resolve, reject))
  },
}
