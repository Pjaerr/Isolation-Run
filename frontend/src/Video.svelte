<script>
  import { isPaused } from "./stores.js";

  export let youtubeVideoID;

  $: if ($isPaused === true) {
    if (window.YOUTUBE_PLAYER_ISREADY) window.YOUTUBE_PLAYER.pauseVideo();
  }

  $: if ($isPaused === false) {
    if (window.YOUTUBE_PLAYER_ISREADY) window.YOUTUBE_PLAYER.playVideo();
  }
</script>

<style>
  #youtube_player_iframe {
    cursor: none;
  }
</style>

<svelte:head>
  <script src="https://www.youtube.com/iframe_api">

  </script>
  <script>
    window.onYouTubeIframeAPIReady = function() {
      window.YOUTUBE_PLAYER = new YT.Player("youtube_player_iframe", {
        events: {
          onReady: function() {
            window.YOUTUBE_PLAYER_ISREADY = true;

            setTimeout(function() {
              window.YOUTUBE_PLAYER.pauseVideo();
            }, 1000);
          }
        }
      });
    };
  </script>
</svelte:head>

<iframe
  title="youtube video"
  id="youtube_player_iframe"
  width="100%"
  height="100%"
  src="https://www.youtube.com/embed/{youtubeVideoID}?enablejsapi=1&origin=https://{location.host}&autoplay=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&color=white&controls=1"
  frameborder="0"
  allow="autoplay; encrypted-media;" />
