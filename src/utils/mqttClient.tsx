import React from 'react';
import mqtt, {IMqttClient} from 'sp-react-native-mqtt';

var MQTTClient: IMqttClient;
class MQTT {
  init(uri: string) {
    mqtt
      .createClient({
        uri: uri,
        clientId: 'your_client_id',
      })
      .then(function (client) {
        MQTTClient = client;
      })
      .catch(function (err) {
        console.log(err);
      });

    return true;
  }
}

export default new MQTT();
