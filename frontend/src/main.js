import App from "./App.svelte";

//Redirect here as if http is forced it doesn't really pose a security risk and doing in node causing issues.
if (location.protocol === "http:") {
  location.replace("https://" + location.host);
}

const app = new App({
  target: document.body
});

export default app;
