// Local
const HOST = 'localhost'; const PORT = process.env.PORT || 5000

// Heroku
// const HOST = 'zagel-server.herokuapp.com'; const PORT = process.env.PORT || 80

const STUNs = [
  { url: "stun:stun.l.google.com:19302" },
  // {url: "stun:stun1.l.google.com:19302"},
  // {url: "stun:stun2.l.google.com:19302"},
  // {url: "stun:stun3.l.google.com:19302"},
  // {url: "stun:stun4.l.google.com:19302"},
  // {url: "stun:stunserver.org"},
]

const TURNs = [
  // {
  //   url: "turn:homeo@turn.bistri.com:80",
  //   credential: "homeo",
  // },
  // {
  //   url: "turn:numb.viagenie.ca",
  //   credential: "muazkh",
  //   username: "webrtc@live.com",
  // },
]

const SDP_CONSTRAINTS = {
  optional: [],
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
  },
}

export default {
  SDP_CONSTRAINTS,
  ICE_SERVERS: STUNs.concat(TURNs),
  AUTH_URL: `http://${HOST}:${PORT}/auth`,
  WEBSOCKET_URL: `ws://${HOST}:${PORT}`,
}
