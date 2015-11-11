import Promise from 'bluebird';
import qwest from 'qwest';
import config from './config';

export default class Session {
  constructor() {}

  auth(username) {
    return qwest.get(config.AUTH_URL, {username: username});
  }
}
