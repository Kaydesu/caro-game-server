import mqtt, { Client as MQTTClient } from 'mqtt';

const HOST = 'ws://broker.emqx.io:8083/mqtt'

const LOBBY_TOPIC = 'lobby/caro-dual'

class MQTTService {
  private _client: MQTTClient;
  private _connectionStatus: 'not-connect' | 'connect';

  constructor() {
    this._connectionStatus = 'not-connect';
    this._client = this.connect();
    this._client.on('connect', () => {
      console.log("Connect successfully, subscribe to: ", LOBBY_TOPIC);

      this._connectionStatus = 'connect';
      Promise.all(this.sub([LOBBY_TOPIC])).then(res => {
        this._client.on('message', (topic, payload) => {
          const data = JSON.parse(payload.toString());
          this.handleTopic(topic, data);
        })
      }).catch(err => {
        console.log(err);
      });
    })
  }

  connect() {
    return mqtt.connect(HOST, {
      keepalive: 30,
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
      },
      rejectUnauthorized: false,
    });
  }

  pub(topic: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (this._client) {
        this._client.subscribe(topic, { qos: 0 }, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(null);
          }
        });
      } else {
        reject('Something when wrong');
      }
    })
  }

  sub(topics: string[]): Promise<unknown>[] {
    const promises = topics.map(topic => new Promise((resolve, reject) => {
      if (this._client) {
        this._client.subscribe(topic, { qos: 0 }, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(null);
          }
        });
      } else {
        reject('Something when wrong');
      }
    }))
    return promises;
  }

  handleTopic(topic: string, data: any) {
    console.log("Receive message from topic: ", topic);
    console.log(data);
  }
}

export default new MQTTService();