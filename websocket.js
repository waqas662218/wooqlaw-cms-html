const WebSocket = require('ws');

// Create a new WebSocket server instance
const wss = new WebSocket.Server({ port: 8080 });

// Store connected clients in an array
let clients = [];

// Event listener for new connections
wss.on('connection', function connection(ws) {
  console.log('New client connected');
  
  // Add the newly connected client to the clients array
  clients.push(ws);

  // Broadcast updated client count to all connected clients
  broadcastClientCount();

   // Event listener for incoming messages from clients
   ws.on('message', function incoming(message) {
     console.log('Received message:', message);
 
     // Broadcast received message along with current client count to all connected clients except sender
     const data = { message, count: getClientsCount() };
     broadcast(JSON.stringify(data), ws);
   });
 
    // Event listener for closing connections
    ws.on('close', function close() {    
      console.log('Client disconnected');
      
      // Remove disconnected client from the clients array 
      const index = clients.indexOf(ws);
      if (index > -1) {
        clients.splice(index, 1);
      }
      
      // Broadcast updated client count after disconnection occurs
      broadcastClientCount();
    });
});

function getClientsCount() {
  return wss.clients.size;
}

function broadcast(message, senderWs) {
  wss.clients.forEach(function each(client) {
    if (client !== senderWs && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
});
}

function broadcastClientCount() {
   const data = {count: getClientsCount()};
   broadcast(JSON.stringify(data));
}


// // Simple demo

// // Event listener for new connections
// wss.on('connection', function connection(ws) {
//   console.log('New client connected');

//   // Event listener for incoming messages from clients
//   ws.on('message', function incoming(message) {
//     console.log('Received message:', message);

//     // Broadcast the received message to all connected clients
//     wss.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });

//   // Event listener for closing connections
//   ws.on('close', function close() {
//     console.log('Client disconnected');
//   });
// });