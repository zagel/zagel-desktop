import React, { Component, PropTypes } from 'react'
import Video from './Video'

export default class Call extends Component {
  static propTypes = {
    call: PropTypes.object.isRequired,
  }

  state = {
    localStream: null,
    remoteStream: null,
  }

  componentWillMount() {
    const { call } = this.props
    call.on('local-stream', stream => {
      this.setState({ localStream: stream })
      // container.appendChild(makeVideo(stream, 'self-view', true))
    })
    call.on('remote-stream', stream => {
      this.setState({ remoteStream: stream })
      // container.appendChild(makeVideo(stream, 'remote-view'))
    })
  }

  componentWillUnmount() {
    // TODO: only remove my listeners.
    this.props.call.removeAllListeners()
  }

  render() {
    const { localStream, remoteStream } = this.state
    return (
      <div className="call">
        {localStream &&
          <Video className="local-view" stream={localStream} muted={true} />
        }
        {remoteStream &&
          <Video className="remote-view" stream={remoteStream} />
        }
      </div>
    )
  }
}
