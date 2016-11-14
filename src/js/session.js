import qwest from 'qwest'
import config from './config'

export default class Session {
  auth(username) {
    return qwest.get(config.AUTH_URL, { username })
  }
}
