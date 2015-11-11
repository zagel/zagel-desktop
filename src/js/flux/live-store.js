import {Types as ActionTypes} from './actions';
import BaseStore from './base-store';

class LiveStore extends BaseStore {
  constructor() {
    super();
    this.list = [];
  }

  getList() {
    return this.list;
  }

  onDispatch({action}) {
    switch (action.type) {
      case ActionTypes.RECEIVE_SOCKET_MSG:
        const msg = action.data;
        if (msg.type === 'live') {
          this.list = msg.data || [];
          return true;
        }
    }
  }
}

export default new LiveStore();
