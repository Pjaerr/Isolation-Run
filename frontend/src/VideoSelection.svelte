<script>
  export let selectedVideo = { id: "lij9G5z1xZE", startTime: "240" };

  let isUserDefinedOption = false;
  let userDefinedOption = "";

  $: {
    if (isUserDefinedOption) {
      selectedVideo = { id: userDefinedOption, startTime: "0" };
    } else {
      selectedVideo = { id: "lij9G5z1xZE", startTime: "240" };
    }
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
        <input type="text" bind:value={userDefinedOption} />
      </label>
    {:else}
      <p>
        All Predefined Videos are taken from the
        <a href="https://www.youtube.com/channel/UCq5O2ZfzRQChMdahnpKpGVg">
          Treadmill TV
        </a>
        channel
      </p>
      <label>
        Choose Scene:
        <select bind:value={selectedVideo}>
          <option value={{ id: 'lij9G5z1xZE', startTime: '240' }}>
            London
          </option>
          <option value={{ id: 'ngAbdEQA9nQ', startTime: '157' }}>
            High Banks Metro Park, Ohio
          </option>
          <option value={{ id: 'wBpzSRasvtk', startTime: '47' }}>
            Lisbon, Ohio
          </option>
          <option value={{ id: 'iKwzffVt16M', startTime: '57' }}>
            Torquay, Australia
          </option>
          <option value={{ id: 'qYD68Zvw8UE', startTime: '60' }}>Paris</option>
          <option value={{ id: 'x_buQ7zYqHE', startTime: '120' }}>
            Hawaii
          </option>

        </select>
      </label>
    {/if}
  </div>
</section>
