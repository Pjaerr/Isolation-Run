<script>
  import { v4 as uuidv4 } from "uuid";
  import { isPaused } from "./stores.js";

  import VideoSelection from "./VideoSelection.svelte";
  import Video from "./Video.svelte";

  //The ID of this client's WebSocket
  let id = uuidv4();

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
      socket.send(
        JSON.stringify({
          id,
          connectionCode,
          messageType: "connection"
        })
      );
    };

    socket.onerror = e => {
      console.error(e);
    };

    socket.onmessage = e => {
      const data = JSON.parse(e.data);

      if (data.messageType === "connection") {
        if (data.connectionCode === connectionCode) {
          phoneHasConnected = true;
          phoneWebSocketID = data.id;

          socket.send(
            JSON.stringify({
              id,
              connectionCode: connectionCode,
              messageType: "connection"
            })
          );
        }
      } else if (
        data.messageType === "connectionclosed" &&
        data.id === phoneWebSocketID
      ) {
        phoneHasConnected = false;
        phoneWebSocketID = "";
        socket.send(
          JSON.stringify({
            id,
            messageType: "connectionclosed"
          })
        );
        socket.close();
        location.reload();
      } else if (
        data.messageType === "playvideo" &&
        data.id === phoneWebSocketID
      ) {
        isPaused.set(false);
        console.log($isPaused);
      } else if (
        data.messageType === "pausevideo" &&
        data.id === phoneWebSocketID
      ) {
        isPaused.set(true);
        console.log($isPaused);
      }
    };

    window.onbeforeunload = () => {
      socket.send(
        JSON.stringify({
          id,
          messageType: "connectionclosed"
        })
      );
      socket.close();
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
</style>

{#if hasChosenVideo}
  {#if phoneHasConnected}
    <Video youtubeVideoID={selectedVideo} />
  {:else}
    <h1>Enter the following code on your phone to connect:</h1>
    <h1 class="code">{connectionCode}</h1>
  {/if}
{:else}
  <h1>Choose predefined video/scene, or use your own:</h1>
  <VideoSelection bind:selectedVideo />
  <button
    on:click={() => {
      hasChosenVideo = true;
      openConnection();
    }}>
    Choose Video
  </button>
{/if}
