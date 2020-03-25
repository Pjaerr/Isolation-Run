const uuidv4 = require("uuid/v4");
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
  console.log("New Connection!");

  connections.push({
    ws,
    id: uuidv4()
  });

  ws.on("message", msg => {
    //Get this websocket from the connections array
    client = connections.filter(connection => {
      return connection.ws === ws;
    })[0];

    let message = JSON.parse(msg);

    //Store the ID of this websocket along with the message
    message.id = client.id;

    //If this websocket has been closed, remove it from our array of connections (this message will still be sent to the relevant partner client so it can also close its connection)
    if (message.messageType === "connectionclosed") {
      connections = connections.filter(connection => {
        return connection.id !== client.id;
      });

      console.log("Remaining Connections: " + connections.length);
    }

    //If this is the first time a device has connected, we need to loop through the existing clients
    //and check if any of them have the same connection code so we can send the initial connection message.
    if (message.messageType === "connection") {
      connections[connections.indexOf(client)].connectionCode =
        message.connectionCode;

      connections.forEach(connection => {
        if (connection !== client) {
          if (
            connection.connectionCode &&
            connection.connectionCode === message.connectionCode
          ) {
            connection.ws.send(JSON.stringify(message));
          }
        }
      });
    } else {
      //Forward this message to this client's partner whose connection we have already established.
      connections.forEach(connection => {
        if (connection.id === message.partnerID) {
          connection.ws.send(JSON.stringify(message));
        }
      });
    }
  });
});

server.listen(3000);
