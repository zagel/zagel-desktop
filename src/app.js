import CallManager from './js/call-manager';
import RTC from './js/rtc';
import Session from './js/session';
import LiveStore from './js/flux/live-store';

var callManager;
const randomID = Math.random().toString(36).substring(8);
new Session().auth(randomID).then(setup);
// new Session().auth('mouad').then(setup);
// new Session().auth('ourida').then(setup);

var liveContacts = document.querySelector('.live-contacts');

LiveStore.subscribe(() => {
  liveContacts.innerHTML = '';
  LiveStore.getList().map(one).forEach((elem) => {
    liveContacts.appendChild(elem);
  });

  function one(contact) {
    var elem = document.createElement('A');
    elem.setAttribute('href', '#');
    elem.setAttribute('class', 'live-contact');
    elem.setAttribute('id', 'live-' + contact.id);
    elem.setAttribute('data-user', JSON.stringify(contact));
    elem.textContent = contact.name;
    return elem;
  }
});




function setup() {
  callManager = new CallManager();
  liveContacts.addEventListener('click', (e) => {
    if (e.target && e.target.nodeName === 'A') {
      const link = e.target;
      const contact = JSON.parse(link.getAttribute('data-user'));
      contactClicked(link, contact);
    }
  });

  callManager.on('receive-call', (call) => {
    call.accept();
    hookCallMedia(call);
  });
}

function contactClicked(link, contact) {
  const call = callManager.getCall(contact);
  if (call) {
    call.hangup();
  } else {
    hookCallMedia(callManager.call(contact));
  }
}

function hookCallMedia(call) {
  var container = document.querySelector('.container');
  var contactLink = document.querySelector('#live-' + call.user.id);
  contactLink.setAttribute('class', 'live-contact-connected');

  call.on('self-stream', stream => {
    container.appendChild(makeVideo(stream, 'self-view', true));
  });
  call.on('remote-stream', stream => {
    container.appendChild(makeVideo(stream, 'remote-view'));
  });

  call.on('disconnected', () => {
    contactLink.setAttribute('class', 'live-contact');
    while (container.lastChild) {
      killVideo(container.lastChild);
    }
  });

  function makeVideo(stream, klass, muted) {
    var vid = document.createElement('video');
    vid.setAttribute('class', klass);
    vid.setAttribute('src', window.URL.createObjectURL(stream));
    vid.setAttribute('autoplay', 'autoplay');
    if (muted) {
      vid.setAttribute('muted', 'muted');
    }
    return vid;
  }

  function killVideo(video) {
    video.pause();
    video.removeAttribute('src');
    video.parentNode.removeChild(video);
  }
}
