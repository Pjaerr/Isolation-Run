<script>
  import gifs from "./gifs.js";

  const gif = gifs[Math.floor(Math.random() * (gifs.length - 1 + 1))];

  let connectionCode = "";
  let desktopHasConnected = false;
  let desktopWebSocketID = "";
  let socketIsOpen = false;

  let socket;

  function openConnection() {
    socket = new WebSocket("wss://" + location.host);
    socket.onopen = e => {
      socketIsOpen = true;

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            connectionCode: connectionCode,
            messageType: "connection"
          })
        );
      }
    };

    socket.onclose = e => {
      location.reload();
    };

    socket.onmessage = e => {
      const data = JSON.parse(e.data);

      console.log("Received a message");

      if (data.messageType === "connection") {
        desktopHasConnected = true;
        desktopWebSocketID = data.id;
      }
    };

    window.onbeforeunload = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            partnerID: desktopWebSocketID,
            messageType: "connectionclosed"
          })
        );
      }

      window.removeEventListener("devicemotion", handleDeviceMotion);
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
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            partnerID: desktopWebSocketID,
            messageType: "playvideo"
          })
        );
      }
    } else if (!isRunning && wasRunningPreviously) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            partnerID: desktopWebSocketID,
            messageType: "pausevideo"
          })
        );
      }
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

{#if !desktopHasConnected}
  <a href="/">Go back</a>
{/if}

{#if !socketIsOpen || !desktopHasConnected}
  <h1>
    Visit this website on your desktop to find the code you need to enter here:
  </h1>

  <!-- svelte-ignore a11y-autofocus -->
  <input
    type="text"
    name="connectionCode"
    bind:value={connectionCode}
    autocapitalize="off"
    autofocus />

  <button on:click={openConnection}>Connect</button>
{:else}
  <h1>Keep your phone screen unlocked and start running! 🏃‍♀️</h1>
  <img src={gif} alt="Gif of somebody running" />
{/if}
