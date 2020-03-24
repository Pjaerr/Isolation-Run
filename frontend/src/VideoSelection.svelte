<script>
  export let selectedVideo = "DHq0pLFavyc";

  let userDefinedVideo = false;
</script>

<style>
  .video-list {
    display: flex;
    flex-direction: column;
    margin: 40px;
  }

  .video-list > label {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .option-switcher {
    margin-bottom: 40px;
  }
</style>

{#if userDefinedVideo}
  <button
    class="option-switcher"
    on:click={() => {
      userDefinedVideo = false;
      selectedVideo = 'DHq0pLFavyc';
    }}>
    Click here to choose from a list of videos
  </button>
  <div class="user-defined-video">
    <label>
      YouTube Video ID (eg: youtube.com/watch?v=
      <b>Hndf5JRwUL0</b>
      ):
      <input type="text" bind:value={selectedVideo} />
    </label>
  </div>
{:else}
  <button
    class="option-switcher"
    on:click={() => {
      userDefinedVideo = true;
      selectedVideo = '';
    }}>
    Click here to choose your own video
  </button>

  <b>
    All videos courtesy of
    <a href="https://www.youtube.com/channel/UCAcsAE1tpLuP3y7UhxUoWpQ">
      Rambalac
    </a>
  </b>

  <div class="video-list">
    <label>
      <input type="radio" bind:group={selectedVideo} value="DHq0pLFavyc" />
      Tokyo Okutama Mountains
    </label>

    <label>
      <input type="radio" bind:group={selectedVideo} value="1aqM14CYb4Y" />
      Midtown Roppongi Hills
    </label>

    <label>
      <input type="radio" bind:group={selectedVideo} value="PLnELXJ-tLs" />
      Yokosuka Countryside
    </label>

    <label>
      <input type="radio" bind:group={selectedVideo} value="jW7SxamQS9M" />
      Hirosaki Winter
    </label>

    <label>
      <input type="radio" bind:group={selectedVideo} value="8mQ454kcPJY" />
      Beppu
    </label>
  </div>
{/if}
