import React, { Component, PropTypes } from 'react'

export default class Video extends Component {
  static propTypes = {
    className: PropTypes.string,
    stream: PropTypes.object.isRequired,
    muted: PropTypes.bool,
  }

  state = {
    src: window.URL.createObjectURL(this.props.stream),
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.stream !== nextProps.stream) {
      this.setState({
        src: window.URL.createObjectURL(nextProps.stream)
      })
    }
  }

  componentWillUnmount() {
    // TODO: are these necessary?
    // video.pause()
    // video.removeAttribute('src')
  }

  render() {
    const { className, muted } = this.props
    const { src } = this.state
    return (
      <video
        className={className}
        src={src}
        muted={muted}
        autoPlay="autoplay"
      />
    )
  }
}

// var vid = document.createElement('video')
// vid.setAttribute('class', klass)
// vid.setAttribute('src', window.URL.createObjectURL(stream))
// vid.setAttribute('autoplay', 'autoplay')
// if (muted) {
//   vid.setAttribute('muted', 'muted')
// }
