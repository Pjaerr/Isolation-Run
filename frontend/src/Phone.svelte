<script>
  import { accelerometer } from "./accelerometer";
  import { disableShakeToUndo } from "./disableShakeToUndo";
  import gifs from "./gifs.js";

  const gif = gifs[Math.floor(Math.random() * (gifs.length - 1 + 1))];

  let connectionCode = "";
  let desktopHasConnected = false;
  let desktopWebSocketID = "";
  let socketIsOpen = false;

  let inputField;

  let socket;

  function openWebSocket() {
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
    };
  }

  function openConnection() {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === "granted") {
            openWebSocket();
          }
        })
        .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
      openWebSocket();
    }
  }

  const playVideo = () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          partnerID: desktopWebSocketID,
          messageType: "playvideo"
        })
      );
    }
  };

  const pauseVideo = () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          partnerID: desktopWebSocketID,
          messageType: "pausevideo"
        })
      );
    }
  };

  let deviceWasMoving = true;

  $: if (socketIsOpen && desktopHasConnected) {
    window.addEventListener("keydown", e => {
      e.stopPropagation();
      e.preventDefault();
    });

    accelerometer(
      deviceHasMoved => {
        if (deviceHasMoved && !deviceWasMoving) {
          playVideo();
        } else if (!deviceHasMoved && deviceWasMoving) {
          pauseVideo();
        }

        deviceWasMoving = deviceHasMoved;
      },
      1.5,
      500
    );
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
    autocapitalize="off"
    autocomplete="off"
    autofocus
    bind:value={connectionCode}
    use:disableShakeToUndo
    on:inputChanged={({ detail }) => {
      connectionCode = detail;
    }} />

  <button on:click={openConnection}>Connect</button>
{:else}
  <h1>Keep your phone screen unlocked and start running! 🏃‍♀️</h1>
  <img src={gif} alt="Gif of somebody running" />
{/if}
