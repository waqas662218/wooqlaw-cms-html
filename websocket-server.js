const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Handle incoming WebSocket connections
wss.on('connection', (ws) => {
  // Send initial todos to the client when connected
  ws.send(JSON.stringify({ type: 'initialTodos', todos: ['Todo 1', 'Todo 2'] }));

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    let data;

    try {
      // Check if message is Blob object and convert it to string if necessary
      if (typeof message === 'object' && message instanceof Blob) {
        const reader = new FileReader();
        reader.onloadend = function() {
          const textData = reader.result;
          processMessage(textData);
        };
        reader.readAsArrayBuffer(message);
      } else {
        processMessage(message);
      }
    } catch(error) {
      console.error("Failed to parse message:", error);
    }

    function processMessage(dataString) {
      try {
        data = JSON.parse(dataString);

        if (data.type === "addTodo") {          
          console.log(`Received new todo: ${data.todo}`);
          
          // Process and store the received todo
          
          // Broadcast updated todos to all clients connected
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'todos', todos: ['Updated Todo List'] }));
            }
          });
        }
      } catch(error) {
        console.error("Failed to parse message as JSON:", error);
      }
    }

  });
});