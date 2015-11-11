import Subscriber from '../util/subscriber';
import Dispatcher from './dispatcher';

var CHANGE_EVENT = 'change';
var DEBUGGING_PREFIX = 'debug__';

export default class BaseStore extends Subscriber {
  constructor() {
    super();
    this._registerForDebugging();
    this.dispatchToken = Dispatcher.register(
      payload => this._baseDispatchHandler(payload)
    );
  }

  subscribe(fn) {
    return this.on(CHANGE_EVENT, fn);
  }

  onDispatch() {}

  getDebugName() {
    return this.constructor.name;
  }

  _registerForDebugging() {
    var name = this.getDebugName();
    window[DEBUGGING_PREFIX + name] = this;
  }

  _baseDispatchHandler(payload) {
    if (this.onDispatch(payload)) {
      this.emit(CHANGE_EVENT);
    }
  }
}
