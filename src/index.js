
const connectDB = require('./controller/mongo');
const { establishWS, broadcastWSS } = require('./controller/websocket');
const connectMQTT = require('./controller/mqtt');

const Data = require('./models/data');

require('dotenv').config();
connectDB();

const wss = establishWS();
const mqClient = connectMQTT();

let data;
  
mqClient.on("message", (topic, message) => {
  // message is Buffer
  const raw = (message.toString()).split(" ");

  data = {
    timestamp: Date.now(),
    aqi: parseFloat(raw[0]).toFixed(2),
    dust: (parseFloat(raw[1]) * 100).toFixed(2),
    // aqi: (Math.random() * 200).toFixed(2),
    // dust: (Math.random() * 100).toFixed(2),
  };

  console.log(Date.now(), data);
  const newData = new Data({
    aqi: data.aqi,
    dust: data.dust,
  });
  newData.save();

  broadcastWSS(wss, data);
});

// const {getData} = require('./utils');

// setInterval(async () => {
//   console.log(await getData(5));
// }, 5000);