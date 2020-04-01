<script>
  import { v4 as uuidv4 } from "uuid";
  import { isPaused } from "./stores.js";

  import VideoSelection from "./VideoSelection.svelte";
  import Video from "./Video.svelte";

  let hasChosenVideo = false;
  let selectedVideo;

  const connectionCode = uuidv4().substring(0, 8);

  let phoneWebSocketID = "";
  let phoneHasConnected = false;

  let socket;
  let socketIsOpen = false;

  function openConnection() {
    socket = new WebSocket("wss://" + location.host);

    socket.onopen = e => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            connectionCode,
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
        phoneHasConnected = true;
        phoneWebSocketID = data.id;

        if (socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              connectionCode: connectionCode,
              messageType: "connection"
            })
          );
        }
      } else if (data.messageType === "playvideo") {
        isPaused.set(false);
      } else if (data.messageType === "pausevideo") {
        isPaused.set(true);
      }
    };

    window.onbeforeunload = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            partnerID: phoneWebSocketID,
            messageType: "connectionclosed"
          })
        );
      }
    };
  }
</script>

<style>
  h1 {
    text-align: center;
  }

  .code {
    color: #333;
    font-size: 3em;
  }

  button {
    margin-top: 20px;
    font-size: 2em;
    width: 10em;
    max-width: 95%;
  }

  .back-button {
    margin-bottom: 40px;
  }
</style>

{#if !phoneHasConnected}
  <a class="back-button" href="/">Go back</a>
{/if}

{#if hasChosenVideo}
  {#if phoneHasConnected}
    <Video
      youtubeVideoID={selectedVideo.id}
      startTime={selectedVideo.startTime} />
  {:else}
    <h1>Enter the following code on your phone to connect:</h1>
    <h1 class="code">{connectionCode}</h1>
  {/if}
{:else}
  <h1>Choose your video:</h1>
  <VideoSelection bind:selectedVideo />
  <button
    on:click={() => {
      hasChosenVideo = true;
      openConnection();
    }}>
    Go!
  </button>
{/if}
