export default {
  PeerConnection: window.webkitRTCPeerConnection,
  SessionDescription: window.RTCSessionDescription,
  IceCandidate: window.RTCIceCandidate,

  getMedia(options) {
    return navigator.mediaDevices.getUserMedia(options)
  },
}
