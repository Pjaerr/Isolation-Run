<script>
  import { v4 as uuidv4 } from "uuid";
  import gifs from "./gifs.js";

  const gif = gifs[Math.floor(Math.random() * (gifs.length - 1 + 1))];

  let id = uuidv4();
  let connectionCode = "";
  let desktopHasConnected = false;
  let desktopWebSocketID = "";
  let socketIsOpen = false;

  let socket;

  function openConnection() {
    socket = new WebSocket("wss://" + location.host);
    socket.onopen = e => {
      socketIsOpen = true;
      socket.send(
        JSON.stringify({
          id,
          connectionCode: connectionCode,
          messageType: "connection"
        })
      );
    };

    socket.onmessage = e => {
      const data = JSON.parse(e.data);

      if (
        data.messageType === "connection" &&
        data.connectionCode === connectionCode
      ) {
        desktopHasConnected = true;
        desktopWebSocketID = data.id;
      } else if (
        data.messageType === "connectionclosed" &&
        data.id === desktopWebSocketID
      ) {
        desktopWebSocketID = "";
        desktopHasConnected = false;

        socket.send(
          JSON.stringify({
            id,
            messageType: "connectionclosed"
          })
        );

        socket.close();
        window.removeEventListener("devicemotion", handleDeviceMotion);
        location.reload();
      }
    };

    window.onbeforeunload = () => {
      socket.send(
        JSON.stringify({
          id,
          messageType: "connectionclosed"
        })
      );

      window.removeEventListener("devicemotion", handleDeviceMotion);

      socket.close();
    };
  }

  let wasRunningPreviously = false;
  let isRunning = false;

  function handleDeviceMotion(e) {
    const acceleration = e.acceleration;

    let res = acceleration.x + acceleration.y + acceleration.z;

    if (res > 5 || res < -5) {
      isRunning = true;
    } else {
      isRunning = false;
    }

    if (isRunning && !wasRunningPreviously) {
      socket.send(
        JSON.stringify({
          id,
          messageType: "playvideo"
        })
      );
    } else if (!isRunning && wasRunningPreviously) {
      socket.send(
        JSON.stringify({
          id,
          messageType: "pausevideo"
        })
      );
    }

    wasRunningPreviously = isRunning;
  }

  $: if (socketIsOpen && desktopHasConnected) {
    window.addEventListener("devicemotion", handleDeviceMotion);
  }
</script>

<style>
  h1 {
    text-align: center;
  }

  input {
    width: 20em;
    height: 4em;
    max-width: 95%;
  }

  button {
    font-size: 2em;
    width: 10em;
    max-width: 95%;
  }
</style>

{#if !socketIsOpen || !desktopHasConnected}
  <h1>
    Visit this website on your desktop to find the code you need to enter here:
  </h1>

  <input
    type="text"
    name="connectionCode"
    bind:value={connectionCode}
    autocapitalize="off"
    autofocus />

  <button on:click={openConnection}>Connect</button>
{:else}
  <h1>Keep your phone screen unlocked! 🏃‍♀️</h1>
  <img src={gif} alt="Gif of somebody running" />
{/if}
