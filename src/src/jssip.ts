// JsSIP integration wrapper

import JsSIP from 'jssip';

export function createUA({ server, extension, password }: { server: string; extension: string; password: string }) {
  const socket = new JsSIP.WebSocketInterface(server);
  const configuration = {
    sockets: [socket],
    uri: `sip:${extension}@${server.replace(/^wss?:\/\//, '')}`,
    password,
  };
  const ua = new JsSIP.UA(configuration);

  // State
  let currentSession: any = null;
  let onCallState: (state: any) => void = () => {};

  // Audio element for media
  const audio = document.createElement('audio');
  audio.autoplay = true;
  document.body.appendChild(audio);

  // Register event listeners
  ua.on('registered', () => onCallState({ status: 'registered' }));
  ua.on('unregistered', () => onCallState({ status: 'unregistered' }));
  ua.on('registrationFailed', (e: any) => onCallState({ status: 'registrationFailed', error: e.cause }));

  ua.on('newRTCSession', (data: any) => {
    const session = data.session;
    currentSession = session;
    if (data.originator === 'remote') {
      // Incoming call
      onCallState({ status: 'incoming', session });
    }
    session.on('ended', () => {
      currentSession = null;
      onCallState({ status: 'idle' });
    });
    session.on('failed', () => {
      currentSession = null;
      onCallState({ status: 'idle' });
    });
    session.on('accepted', () => {
      onCallState({ status: 'in-call', session });
    });
    session.on('confirmed', () => {
      onCallState({ status: 'in-call', session });
    });
    session.on('peerconnection', (e: any) => {
      const pc = e.peerconnection;
      pc.ontrack = (ev: any) => {
        if (ev.streams && ev.streams[0]) {
          audio.srcObject = ev.streams[0];
        }
      };
    });
  });

  return {
    ua,
    start: () => ua.start(),
    isRegistered: () => ua.isRegistered(),
    onCallState: (cb: (state: any) => void) => { onCallState = cb; },
    call: (target: string) => {
      if (currentSession) return;
      currentSession = ua.call(target, {
        mediaConstraints: { audio: true, video: false },
        rtcOfferConstraints: { offerToReceiveAudio: true, offerToReceiveVideo: false },
      });
      onCallState({ status: 'calling', session: currentSession });
    },
    answer: () => {
      if (currentSession && currentSession.isInProgress()) {
        currentSession.answer({ mediaConstraints: { audio: true, video: false } });
      }
    },
    hangup: () => {
      if (currentSession) {
        currentSession.terminate();
        currentSession = null;
        onCallState({ status: 'idle' });
      }
    },
    getSession: () => currentSession,
  };
}
