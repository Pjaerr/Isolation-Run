const path = require("path");
const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "../frontend/public")));

const WebSocketServer = new WebSocket.Server({ server });

let connections = [];

WebSocketServer.on("connection", ws => {
  //Store websocket and then in the below code, send a message to all web sockets
  console.log("Somebody has connected!");
  connections.push(ws);

  ws.on("message", msg => {
    const message = JSON.parse(msg);

    if (message.messageType === "connectionclosed") {
      //Remove it from the connections
      connections = connections.filter(connection => {
        return connection !== ws;
      });

      console.log("Remaining Connections: " + connections.length);
    }

    //Forward this message to all other connections
    connections.forEach(connection => {
      if (connection !== ws) {
        connection.send(msg);
      }
    });
  });
});

server.listen(3000);
