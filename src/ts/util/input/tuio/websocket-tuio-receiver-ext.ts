import * as osc from 'osc/dist/osc-browser';
import { TuioReceiver } from '../../../../vendor/InteractiveScapeGmbh/tuio_client_js/src';

/**
 * The Interactive Scape WebsocketTuioReceiver does not handle connection errors at all.
 * This is an attempt to implement a more robust version of the WebsocketTuioReceiver with automatic reconnect.
 */
export class WebsocketTuioReceiverExt extends TuioReceiver {
  protected _url: string;

  protected _oscPort: osc.WebSocketPort;

  protected _isConnected: boolean = false;

  protected _reconnectIntervalMs: number;

  protected _reconnectTimeout: number;

  protected _handleOscMessage: (oscMessage: osc.OscMessage) => void;

  protected _handleOscReady: () => void;

  protected _handleOscClose: (event: CustomEvent) => void;

  protected _handleOscError: (oscError: unknown) => void;

  constructor(url: string, reconnectIntervalMs: number) {
    super();
    this._url = url;
    this._reconnectIntervalMs = reconnectIntervalMs;
    this._oscPort = new osc.WebSocketPort({
      url,
      metadata: true,
    });

    this._reconnectTimeout = 0;
    this._handleOscMessage = this.onOscMessage.bind(this);
    this._handleOscReady = this.onOscReady.bind(this);
    this._handleOscClose = this.onOscClose.bind(this);
    this._handleOscError = this.onOscError.bind(this);
  }

  scheduleReconnect() {
    this.disconnect();
    console.warn(`Attempting reconnection in ${this._reconnectIntervalMs}ms`);
    clearTimeout(this._reconnectTimeout);
    this._reconnectTimeout = setTimeout(
      () => this.connect(),
      this._reconnectIntervalMs,
    );
  }

  protected onOscReady() {
    this._isConnected = true;
    this._oscPort.on('message', this._handleOscMessage);
    console.log(`TUIO connection to ${this._url} established`);
  }

  protected onOscClose(event: unknown) {
    console.warn(`TUIO connection to ${this._url} closed`, event);
    this.scheduleReconnect();
  }

  protected onOscError(error: unknown) {
    console.error('TUIO error: ', error);
    console.warn(`Terminating TUIO connection ${this._url}`);
    this.scheduleReconnect();
  }

  connect() {
    console.log(`Connecting to TUIO server ${this._url}`);

    this._oscPort.once('ready', this._handleOscReady);
    this._oscPort.once('close', this._handleOscClose);
    this._oscPort.once('error', this._handleOscError);
    this._oscPort.once('wsClient', this._handleOscError);

    this._oscPort.open();
  }

  disconnect() {
    this._oscPort.off('ready', this._handleOscReady);
    this._oscPort.off('message', this._handleOscMessage);
    this._oscPort.off('close', this._handleOscClose);
    this._oscPort.off('error', this._handleOscError);
    this._oscPort.off('wsClient', this._handleOscError);
    this._oscPort.close();
    this._isConnected = false;
  }
}
