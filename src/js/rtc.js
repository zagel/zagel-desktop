import Promise from 'bluebird';

// navigator.getUserMedia
var _getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia ||
                   navigator.webkitGetUserMedia || navigator.msGetUserMedia;
// RTCPeerConnection
var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||
                     window.webkitRTCPeerConnection || window.msRTCPeerConnection;
// RTCSessionDescription
var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription ||
                         window.webkitRTCSessionDescription || window.msRTCSessionDescription;

var IceCandidate = window.RTCIceCandidate;

export default {
  PeerConnection,
  SessionDescription,
  IceCandidate,

  getMedia(options) {
    return new Promise(function(resolve, reject) {
      _getUserMedia.call(navigator, options, resolve, reject);
    });
  },
};
