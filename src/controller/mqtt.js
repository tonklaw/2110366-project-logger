const mqtt = require('mqtt');

const connectMQTT = () => {
  const mqtt_uri = `mqtts://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`;

  const client = mqtt.connect(mqtt_uri, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  });
  
  const topic = "raw";
  
  client.on("connect", () => {
    client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${topic}!`);
      }
    });
  });

  return client;
}

module.exports = connectMQTT;