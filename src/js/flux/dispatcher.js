import {Dispatcher as FluxDispatcher} from 'flux';

const PayloadSources = {
  SERVER: 'SERVER',
  VIEW: 'VIEW',
};

class Dispatcher extends FluxDispatcher {
  serverAction(action) {
    this.dispatch({action, source: PayloadSources.SERVER});
  }

  viewAction(action) {
    this.dispatch({action, source: PayloadSources.VIEW});
  }
}

export default new Dispatcher();
