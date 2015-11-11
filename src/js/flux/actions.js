import Dispatcher from './dispatcher';

export const Types = {
  RECEIVE_SOCKET_MSG: 'RECEIVE_SOCKET_MSG',
};

export default {
  receiveSocketMessage(msg) {
    Dispatcher.serverAction({
      type: Types.RECEIVE_SOCKET_MSG,
      data: msg,
    });
  },
};
