<script>
  import { slide } from "svelte/transition";
  import { quintInOut } from "svelte/easing";

  export let onClose;
</script>

<style>
  .modal-overlay {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: #333;
    opacity: 0.5;
    z-index: 5;
  }

  .container {
    position: fixed;
    z-index: 10;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .modal {
    padding: 10px;
    overflow-y: scroll;
    text-align: center;
    border-radius: 7px;
    background-color: #fff;
    box-shadow: 0px 0.5px 2px rgba(0, 0, 0, 0.25);
    height: 420px;
  }

  @media (min-width: 400px) {
    .modal {
      height: 520px;
    }
  }

  @media (min-width: 820px) {
    .container {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal {
      width: 820px;
      height: 580px;
    }
  }

  .header {
    margin-bottom: 20px;
  }

  .header-back-button {
    position: absolute;
  }

  .header-back-button > button {
    width: 32px;
    height: 32px;
    padding: 0;
    background: #f5f5f5;
  }

  .header-title {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .header-title > h1 {
    margin: 0;
    font-size: 1.4em;
  }

  .body {
    display: flex;
    flex-direction: column;
    font-size: 1.2em;
    padding: 20px;
  }

  .body-intro {
    margin: 20px;
  }

  .body-outro {
    margin-top: 80px;
  }

  .body-tech {
    margin-top: 20px;
  }

  .body-intro > em {
    color: red;
  }

  .body-steps {
    display: flex;
    flex-direction: column;
  }
</style>

<div class="modal-overlay" />
<section
  class="container"
  transition:slide={{ duration: 200, easing: quintInOut }}>
  <div class="modal">
    <header class="header">
      <div class="header-back-button">
        <button on:click={onClose}>
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path
              fill="#333"
              d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
          </svg>
        </button>
      </div>
      <div class="header-title">
        <h1>How does this work?</h1>
      </div>
    </header>
    <section class="body">
      <div class="body-intro">
        Isolation Run is a fun little website that lets you watch a video on
        your computer but only when your phone detects that you are running.
        Hopefully a fun way to keep fit whilst locked indoors!
      </div>

      <div class="body-steps">
        <div class="body-steps-step">
          <h2>Step 1:</h2>
          On your computer (or whatever screen you want to watch the video on),
          open this website and click on the
          <b>Computer</b>
          button.
        </div>
        <div class="body-steps-step">
          <h2>Step 2:</h2>
          You can then select from a list of predefined videos of walks through
          scenery, cities etc or you can select your own video by pasting in the
          youtube video ID.
        </div>
        <div class="body-steps-step">
          <h2>Step 3:</h2>
          Once you've done that, you should be presented with a code. Now you
          must open this website on your phone and click
          <b>Phone</b>
          and then enter in the code you see on your computer.
        </div>

        <div class="body-outro">
          You can now start running with your phone in your hand and the video
          will play! Remember to keep your phone screen unlocked for this to
          work.
        </div>

        <div class="body-tech">
          This site was made using Svelte and Nodejs. It uses WebSockets to
          connect your computer to your phone and sends a message over the
          network when your phone's accelerometer detects that you're running.
          <br />
          <br />
          The source code can be found
          <a href="https://github.com/Pjaerr/Isolation-Run">here</a>
        </div>
      </div>
    </section>
  </div>
</section>
