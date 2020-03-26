const uuidv4 = require("uuid").v4;
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
  //Store the new connection alongside a generated GUID.
  console.log("New Connection");

  connections.push({
    ws,
    id: uuidv4()
  });

  //When this websocket closes, remove it from the connections array
  ws.on("close", () => {
    connections = connections.filter(connection => {
      return connection.ws !== ws;
    });

    console.log(
      "Connection Closed | Remaining Connections: " + connections.length
    );
  });

  ws.on("message", msg => {
    let message = JSON.parse(msg);

    //Get this websocket from the connections array so we can reference its ID
    client = connections.filter(connection => {
      return connection.ws === ws;
    })[0];

    //Store the ID of this websocket along with the message
    message.id = client.id;

    //If this websocket has been closed, remove it from our array of connections (this message will still be sent to the relevant partner client so it can also close its connection)
    if (message.messageType === "connectionclosed") {
      partnerConnection = connections.filter(connection => {
        return connection.id === message.partnerID;
      })[0];

      //If our partner has already closed their connection.
      if (partnerConnection) {
        partnerConnection.ws.close();
      }

      ws.close();

      //We don't need to send this message to the other client as we just closed it
      return;
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

server.listen(process.env.PORT || 3000);
