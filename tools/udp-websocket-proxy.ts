/* eslint-disable no-console */
/* eslint-disable max-classes-per-file */
import process from 'node:process';
import udp from 'node:dgram';
import net from 'node:net';
import http from 'node:http';
import WebSocket, { WebSocketServer } from 'ws';

function parseIntWithDefault(s: unknown, defaultValue: number) {
  if (typeof s !== 'string') return defaultValue;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : defaultValue;
}

const UDP_PORT = parseIntWithDefault(process.env.UDP_PORT, 3333);
const UDP_ADDRESSES = (process.env.UDP_ADDRESSES ?? '127.0.0.1,::1').split(',');
const WEBSOCKET_PORT = parseIntWithDefault(process.env.WS_PORT, 3339);
const WEBSOCKET_ADDRESSES = (
  process.env.WEBSOCKET_ADDRESSES ?? '127.0.0.1,::1'
).split(',');

const CLIENT_TIMEOUT_MS = 30000;
const HEARTBEAT_INTERVAL_MS = 1000;

function isAddressInfo(obj: unknown): obj is net.AddressInfo {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'address' in obj &&
    typeof obj?.address === 'string' &&
    'port' in obj &&
    typeof obj?.port === 'number' &&
    'family' in obj &&
    (obj?.family === 'IPv4' || obj?.family === 'IPv6')
  );
}

function addressInfoToString({ address, port, family }: net.AddressInfo) {
  return `${address}:${port} (${family})`;
}

type SendFunc = (message: Buffer) => void;

const sendFunctions = new Map<string, SendFunc>();

function idForUdpClient(host: string, port: number, serverSocket: udp.Socket) {
  return `udp://${serverSocket.address().address}:${serverSocket.address().port} <-> udp://${host}:${port}`;
}

function idForWebSocketClient(
  { address, port }: net.AddressInfo,
  wss: WebSocketServer,
) {
  return `ws://${wss.options.host}:${wss.options.port} <-> ws://${address}:${port}`;
}

function broadcast(message: Buffer, originId: string) {
  [...sendFunctions.entries()]
    .filter(([id]) => originId !== id)
    .forEach(([_, send]) => send(message));
}

// *********** UDP part ***********

const activeUdpClients = new Map<string, NodeJS.Timeout>();

function handleUdpServerError(udps: udp.Socket, error: Error) {
  console.log(`UDP server error: ${error.toString()}`);
  udps.close();
}

function udpHeartbeat(id: string) {
  clearTimeout(activeUdpClients.get(id));
  activeUdpClients.set(
    id,
    setTimeout(() => {
      console.log(`UDP client timeout: ${id}`);
      activeUdpClients.delete(id);
    }, CLIENT_TIMEOUT_MS),
  );
}

function handleUdpServerMessage(
  udps: udp.Socket,
  message: Buffer,
  info: udp.RemoteInfo,
) {
  const id = idForUdpClient(info.address, info.port, udps);
  const send = sendFunctions.get(id);
  if (typeof send === 'undefined') {
    const newSendFunc = (msg: Buffer) =>
      udps.send(msg, info.port, info.address);
    sendFunctions.set(id, newSendFunc);
  }
  udpHeartbeat(id);
  broadcast(message, id);
}

function handleUdpServerListening(udps: udp.Socket) {
  console.log(
    `UDP server listening on: ${addressInfoToString(udps.address())}`,
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleUdpServerClose(udps: udp.Socket) {
  console.log('UDP server shut down');
}

UDP_ADDRESSES.forEach((address) => {
  const family = net.isIP(address);
  if (family !== 4 && family !== 6) {
    console.error(`Invalid or unsupported IP address for UDP: ${address}`);
    return;
  }

  const udpServerType = family === 4 ? 'udp4' : 'udp6';
  const udpServer = udp.createSocket(udpServerType);
  udpServer.on('error', (error) => handleUdpServerError(udpServer, error));
  udpServer.on('listening', () => handleUdpServerListening(udpServer));
  udpServer.on('close', () => handleUdpServerClose(udpServer));
  udpServer.on('message', (buffer, info) =>
    handleUdpServerMessage(udpServer, buffer, info),
  );
  udpServer.bind(UDP_PORT, address);
});
// *********** WebSocket part ***********

const activeWebSocketClients = new Map<
  string,
  { ws: WebSocket; timeoutId: NodeJS.Timeout }
>();

function webSocketHeartbeat(id: string, ws: WebSocket) {
  clearTimeout(activeWebSocketClients.get(id)?.timeoutId);
  const timeoutId = setTimeout(() => {
    console.log(`WebSocket client timeout: ${id}`);
    activeWebSocketClients.delete(id);
    ws.terminate();
  }, CLIENT_TIMEOUT_MS);
  activeWebSocketClients.set(id, { ws, timeoutId });
}

function handleWebSocketError(
  wss: WebSocketServer,
  ws: WebSocket,
  id: string,
  error: Error,
) {
  console.error('WebSocket error', error);
  console.error(`Closing WebSocket connection ${id}`);
  ws.close();
}

function handleWebSocketClose(wss: WebSocketServer, ws: WebSocket, id: string) {
  sendFunctions.delete(id);
  console.log(`WebSocket client disconnected: ${id}`);
}

function convertWebSocketRawDataToBuffer(message: WebSocket.RawData): Buffer {
  if (Buffer.isBuffer(message)) return message; // Buffer
  if (message instanceof ArrayBuffer) return Buffer.from(message); // ArrayBuffer
  return Buffer.concat(message); // Buffer[]
}

function handleWebSocketPingPong(
  wss: WebSocketServer,
  ws: WebSocket,
  id: string,
) {
  webSocketHeartbeat(id, ws);
}

function handleWebSocketMessage(
  wss: WebSocketServer,
  ws: WebSocket,
  id: string,
  message: WebSocket.RawData,
) {
  webSocketHeartbeat(id, ws);
  const buffer = convertWebSocketRawDataToBuffer(message);
  broadcast(buffer, id);
}

function handleWebSocketServerListening(wss: WebSocketServer) {
  console.log(
    `WebSocket server listening on: ws://${wss.options.host}:${wss.options.port}`,
  );
}

function handleWebSocketServerConnection(
  wss: WebSocketServer,
  ws: WebSocket,
  request: http.IncomingMessage,
) {
  const { socket } = request;

  const addressInfo = {
    address: socket.remoteAddress,
    port: socket.remotePort,
    family: socket.remoteFamily,
  };
  if (!isAddressInfo(addressInfo)) {
    console.error('Invalid remote address or port', ws);
    ws.close();
    return;
  }

  const id = idForWebSocketClient(addressInfo, wss);
  const send = (message: Buffer) => ws.send(message);
  sendFunctions.set(id, send);
  console.log(`WebSocket client connected: ${id}`);
  ws.on('ping', () => handleWebSocketPingPong(wss, ws, id));
  ws.on('pong', () => handleWebSocketPingPong(wss, ws, id));
  ws.on('error', (error) => handleWebSocketError(wss, ws, id, error));
  ws.on('close', () => handleWebSocketClose(wss, ws, id));
  ws.on('message', (message) => handleWebSocketMessage(wss, ws, id, message));
  setInterval(() => ws.ping(), HEARTBEAT_INTERVAL_MS);
}

function handleWebSocketServerError(wss: WebSocketServer, error: Error) {
  console.error('WebSocket server error', error);
  console.error('Shutting down WebSocket server');
  wss.close();
}

function handleWebSocketServerWsClientError(
  wss: WebSocketServer,
  error: Error,
) {
  console.error('WebSocket server error', error);
  console.error('Shutting down WebSocket server');
  wss.close();
}

WEBSOCKET_ADDRESSES.forEach((address) => {
  const family = net.isIP(address);
  if (family === 0) {
    console.error(`Invalid IP address for WebSockets: ${address}`);
    return;
  }

  const webSocketServerOptions = {
    port: WEBSOCKET_PORT,
    host: address,
    clientTracking: true,
  };
  const webSocketServer = new WebSocketServer(webSocketServerOptions);
  webSocketServer.on('listening', () =>
    handleWebSocketServerListening(webSocketServer),
  );
  webSocketServer.on(
    'connection',
    (ws: WebSocket, request: http.IncomingMessage) =>
      handleWebSocketServerConnection(webSocketServer, ws, request),
  );
  webSocketServer.on('error', (error) =>
    handleWebSocketServerError(webSocketServer, error),
  );
  webSocketServer.on('wsClientError', (error: Error) =>
    handleWebSocketServerWsClientError(webSocketServer, error),
  );
});
