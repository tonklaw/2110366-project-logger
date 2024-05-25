const ws = require('ws');
const {getPayload} = require('../utils.js');

let wss = null;

const establishWS = () => {
  
  wss = new ws.Server({ port: 8080 });

  wss.on('listening', () => {
    console.log('Websocket server listening on port 8080');
  });

  wss.getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
  };

  wss.on('connection', (ws) => {
    ws.id = wss.getUniqueID();
    console.log(`Client connected with ID: ${ws.id}`);

    ws.on('close', () => {
      console.log('Client disconnected');
    });

    ws.on('message', (message) => {
      console.log(`Received message: ${message} from ${ws.id}`);

      const data = JSON.parse(message);

      if (data.rate) {
        console.log(`Setting ${ws.id} rate to ${data.rate}`);
        ws.rate = data.rate;
        
      }
    });
  });

  return wss;
};

const getWSS = () => {
  if (!wss) {
    throw new Error('Websocket server not established');
  }
  return wss;
};

const broadcastWSS = (wss, e) => {
  wss.clients.forEach(async (client) => {
    if (client.readyState === ws.OPEN) {

      const data = { ...e }

      data.clientID = client.id;

      if (client.rate) {
        console.log(`Sending data to ${client.id} with rate ${client.rate}`);
        const payload = await getPayload(client.rate);

        data.payload = payload;
      }
      
      console.log(`Sending data to ${client.id}`);
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = {
  establishWS,
  getWSS, 
  broadcastWSS, 
};