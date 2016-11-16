import React, { Component } from 'react'

import Session from '../session'
import CallManager from '../call-manager'
import LiveContacts from './LiveContacts'
import Call from './Call'


export default class App extends Component {
  state = {
    me: null,
    activeCall: null,
  }

  componentWillMount() {
    const randomID = Math.random().toString(36).substring(8)
    new Session().auth(randomID).then(() => {
      this.setState({ me: randomID })
      this.callManager = new CallManager()
      this.callManager.on('receive-call', this.receiveCall)
    })
  }

  componentWillUnmount() {
    if (this.callManager) {
      this.callManager.stopAll()
      this.callManager.removeAllListeners()
      this.callManager = null
    }
  }

  render() {
    const { me, activeCall } = this.state

    if (!me) {
      return <div>Authenticating...</div>
    }

    return (
      <div>
        <h2>Zagel <small>({ me })</small></h2>
        <LiveContacts onCall={this.makeCall} />
        {activeCall && <Call key={activeCall.user.id} call={activeCall} />}
      </div>
    )
  }

  makeCall = (contact) => {
    const call = this.callManager.call(contact)
    this.setActiveCall(call)
  }

  receiveCall = (call) => {
    // TODO: Wait until user accepts call.
    call.accept()
    this.setActiveCall(call)
  }

  setActiveCall = (activeCall) => {
    this.setState({ activeCall })
    activeCall.on('disconnected', () => this.callDisconnected(activeCall))
  }

  callDisconnected = (call) => {
    if (call === this.state.activeCall) {
      this.setState({ activeCall: null })
    }
  }
}
