const mqtt = require('mqtt');
const Data = require('./models/data');
const connectDB = require('./config/mongo');

require('dotenv').config();

connectDB();

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

client.on("message", (topic, message) => {
  // message is Buffer
  const raw = (message.toString()).split(" ");

  const data = {
    aqi: raw[0],
    dust: raw[1],
  };

  console.log(Date.now(), data);
  const newData = new Data({
    data,
  });
  newData.save();
});