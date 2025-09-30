import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  // Send a notification every 10 seconds
  const interval = setInterval(() => {
    ws.send(
      JSON.stringify({
        title: "New Notification",
        body: "This is a push notification from the server.",
      })
    );
  }, 100);

  ws.on("close", () => {
    clearInterval(interval);
  });
});

console.log("WebSocket server started on port 8080");
