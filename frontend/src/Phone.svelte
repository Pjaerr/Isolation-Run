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
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }

  let yGravity = 0;
  let threshold = 0.3;
  let deviceWasLastMovingUpwards = false;
  let deviceWasMoving = true;
  let isDeviceMoving = false;

  function handleDeviceMotion(e) {
    yGravity = e.accelerationIncludingGravity.y;
  }

  function handleDeviceOrientation(e) {
    if (yGravity - 10 * Math.sin((e.beta * Math.PI) / 180) > threshold) {
      //We are moving the device up

      deviceWasLastMovingUpwards = true;
    } else if (
      yGravity - 10 * Math.sin((e.beta * Math.PI) / 180) <
      -threshold
    ) {
      //We are moving the device down

      if (deviceWasLastMovingUpwards) {
        //We have taken a "step"

        isDeviceMoving = true;
      }

      deviceWasLastMovingUpwards = false;
    } else {
      isDeviceMoving = false;
    }

    if (isDeviceMoving && !deviceWasMoving) {
      //Send "playvideo" event
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            partnerID: desktopWebSocketID,
            messageType: "playvideo"
          })
        );
      }
    } else if (!isDeviceMoving && deviceWasMoving) {
      //Send "pausevideo" event
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            partnerID: desktopWebSocketID,
            messageType: "pausevideo"
          })
        );
      }
    }

    deviceWasMoving = isDeviceMoving;
  }

  $: if (socketIsOpen && desktopHasConnected) {
    window.addEventListener("devicemotion", handleDeviceMotion);
    window.addEventListener("deviceorientation", handleDeviceOrientation);
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

  .back-button {
    margin-bottom: 40px;
  }
</style>

{#if !desktopHasConnected}
  <a class="back-button" href="/">Go back</a>
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
    autocomplete="off"
    autofocus />

  <button on:click={openConnection}>Connect</button>
{:else}
  <h1>Keep your phone screen unlocked and start running! 🏃‍♀️</h1>
  <img src={gif} alt="Gif of somebody running" />
{/if}
