<script>
  export let selectedVideo = "DHq0pLFavyc";

  let isUserDefinedOption = false;

  $: if (isUserDefinedOption) {
    selectedVideo = "";
  }
</script>

<style>
  .video-selection {
    margin-top: 40px;
    margin-bottom: 40px;
  }
  .mode-input {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 40px;
  }

  .mode-input > :first-child {
    margin-right: 20px;
  }

  .mode-input > :last-child {
    margin-left: 20px;
  }

  .option-input {
    margin: 20px;
  }
</style>

<section class="video-selection">
  <div class="mode-input">
    <label>
      <input type="radio" bind:group={isUserDefinedOption} value={false} />
      Choose a predefined video
    </label>
    <label>
      <input type="radio" bind:group={isUserDefinedOption} value={true} />
      Choose your own video
    </label>
  </div>

  <div class="option-input">
    {#if isUserDefinedOption}
      <label>
        Video ID (eg: youtube.com/watch?v=
        <b>Hndf5JRwUL0</b>
        ) :
        <input type="text" bind:value={selectedVideo} />
      </label>
    {:else}
      <label>
        Choose Scene:
        <select bind:value={selectedVideo}>
          <option value="1aqM14CYb4Y">Mountains</option>
          <option value="1aqM14CYb4Y">Hills</option>
          <option value="PLnELXJ-tLs">Countryside</option>
          <option value="jW7SxamQS9M">Winter Walk</option>
          <option value="8mQ454kcPJY">City</option>
        </select>
      </label>
    {/if}
  </div>
</section>
