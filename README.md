# QuaRUNtine
A silly website that helps you keep up your running habit whilst in lockdown/quarantine made using Svelte, Node and WebSockets.

This was inspired by a [tweet](https://twitter.com/devdevcharlie/status/1241812642852995074) by @devdevcharlie where they did this with pose detection!

You can view a live demo at the following link: NOT LIVE YET

## Getting Setup Locally

1. Clone this repository

2. CD into `/frontend` and run `npm install`

3. Next, run `npm run dev` or `npm run build` so that the `/frontend/public` folder can be populated

4. CD into `/backend` and run `npm install`

5. Next, run `node main` to start a local server.

You should now be able to see the site at `http://localhost:3000`. That won't be much use, so you should probably install [ngrok](https://ngrok.com/) so that you can access your local host on both your computer and your phone.

*This project makes use of WebSockets and will require a secure HTTPS connection, ngrok supports this but for other development environments (such as chrome port forwarding) you may need to set it up yourself.*

## TODO

This project isn't finished yet, but is almost there. The following are tasks that I've got to finish before publishing. Any tasks beyond these will be added as github issues.

[ ] Add a "how-to" modal to the homescreen to explain how the site works

[ ] Improve the code in `frontend/src/Phone.svelte` that determines if a user is actually running

[ ] Implement dynamic video speed depending upon how fast the user is running (if possible)

[ ] Look into sending WebSocket messages to only a specific client (to avoid potential 100s of messages being sent if lots of users are using the site at one time)

[ ] Improve the UX of the video selection page/component