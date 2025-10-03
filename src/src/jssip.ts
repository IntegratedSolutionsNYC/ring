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
  return ua;
}
