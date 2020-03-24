<script>
  import Computer from "./Computer.svelte";
  import Phone from "./Phone.svelte";
  let mode;
</script>

<style>
  main {
    width: 100%;
    height: 100%;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  em {
    color: red;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
    width: 10em;
    max-width: 95%;
  }

  button > svg {
    margin-right: 5px;
  }
</style>

<main>
  {#if mode === 'COMPUTER'}
    <Computer />
  {:else if mode === 'PHONE'}
    <Phone />
  {:else}
    <h1>
      Welcome to Qua
      <em>run</em>
      tine. You'll need a phone and a computer to get started!
    </h1>

    <h2>Which device is this?</h2>

    <button on:click={() => (mode = 'COMPUTER')}>
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path
          fill="#333"
          d="M21,14H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0
          3,18H10L8,21V22H16V21L14,18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z" />
      </svg>
      Computer
    </button>

    <button on:click={() => (mode = 'PHONE')}>
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path
          fill="#333"
          d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0
          0,0 19,21V3C19,1.89 18.1,1 17,1Z" />
      </svg>
      Phone
    </button>
  {/if}
</main>
