const WebSocket = require('ws');
const db = require("./config/dbConfig");

let timers = {};
let startTimes = {};
let startLocations = {};

const handleWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  console.log("WebSocket server is running");

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      console.log(`Received message => ${message}`);
      try {
        const parsedMessage = JSON.parse(message);
        console.log('Action:', parsedMessage.action);

        if (parsedMessage.action === 'start_ride') {
          console.log('Starting the ride');
          const startTime = Date.now();
          startTimes[ws] = startTime;
          startLocations[ws] = parsedMessage.startLocation;
          timers[ws] = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const readableStartTime = new Date(startTime).toLocaleTimeString('sv-SE', { timeZone: 'Europe/Stockholm' }); 
            ws.send(JSON.stringify({ action: 'ride_update', elapsedTime, readableStartTime }));
          }, 1000); // Uppdatera varje sekund
        }

        if (parsedMessage.action === 'end_ride') {
          console.log('Ending the ride');
          if (timers[ws]) {
            clearInterval(timers[ws]);
            delete timers[ws];
          }
          if (startTimes[ws]) {
            const endTime = Date.now();
            const readableEndTime = new Date(endTime).toLocaleTimeString('sv-SE', { timeZone: 'Europe/Stockholm' });
            const totalTime = endTime - startTimes[ws];
            const readableStartTime = new Date(startTimes[ws]).toLocaleTimeString('sv-SE', { timeZone: 'Europe/Stockholm' });
            const userId = parsedMessage.userId;
            const scooterId = parsedMessage.scooterId;
            const startLocation = startLocations[ws];
            const endLocation = parsedMessage.endLocation;
            const distance = parsedMessage.distance;

            console.log('Distance:', distance);
            
            
            const sql = `INSERT INTO Trip (user_id, distance, payment_status, start_location, end_location, scooter_id, start_time, end_time) VALUES (?, ?,'paid', ST_PointFromText(?), ST_PointFromText(?), ?, ?, ?)`;
            db.query(sql, [userId,distance, startLocation, endLocation, scooterId, new Date(startTimes[ws]), new Date(endTime)], (error, result) => {
              if (error) {
                console.error('Error inserting trip into database:', error);
              } else {
                console.log('Trip inserted into database:', result);
                ws.send(JSON.stringify({ action: 'ride_ended', totalTime: totalTime / 1000, startTime: readableStartTime, endTime: readableEndTime }));
              }
            });

            delete startTimes[ws];
            delete startLocations[ws];
          }
        }

        // Hantera andra inkommande meddelanden 
        ws.send(JSON.stringify({ message: 'Message received' }));
      } catch (error) {
        console.error('Error parsing message from client:', error);
        ws.send(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      if (timers[ws]) {
        clearInterval(timers[ws]);
        delete timers[ws];
      }
      if (startTimes[ws]) {
        delete startTimes[ws];
      }
      if (startLocations[ws]) {
        delete startLocations[ws];
      }
    });
  });
};

module.exports = handleWebSocket;