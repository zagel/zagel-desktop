import React, { Component, PropTypes } from 'react'
import LiveStore from '../flux/live-store'

export default class LiveContacts extends Component {
  static propTypes = {
    onCall: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.unsubscribe = LiveStore.subscribe(() => {
      this.forceUpdate()
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const contacts = LiveStore.getList()
    const { onCall } = this.props
    return (
      <ul className="live-contacts">
        {contacts.map(contact =>
          <li key={contact.id} className="live-contact" onClick={() => onCall(contact)}>
            {contact.name}
          </li>
        )}
      </ul>
    )
  }
}
