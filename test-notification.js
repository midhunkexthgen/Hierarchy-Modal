const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  const message = { title: 'Test Notification', body: 'This is a test push notification.' };
  ws.send(JSON.stringify(message));
  console.log('Sent:', message);
  ws.close();
});
