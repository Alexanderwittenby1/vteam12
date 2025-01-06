let ws: WebSocket;
let messageHandler: ((data: any) => void) | null = null;

const connectWebSocket = () => {
  ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    console.log('Connected to WebSocket server');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (messageHandler) {
        messageHandler(data);
      }
    } catch (error) {
      console.error('Error parsing message from server:', error);
    }
  };

  ws.onclose = () => {
    console.warn('WebSocket closed.');
    setTimeout(connectWebSocket, 5000); // Försök återansluta efter 5 sekunder
  };
};

connectWebSocket();

const sendMessage = (message: any) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.warn('WebSocket is not open. Ready state:', ws.readyState);
  }
};

const registerMessageHandler = (handler: (data: any) => void) => {
  messageHandler = handler;
};

export { sendMessage, registerMessageHandler, connectWebSocket };