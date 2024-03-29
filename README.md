# Isolation Run
A silly website that helps you keep up your running habit whilst in isolation/lockdown/quarantine made using Svelte, Node and WebSockets.

This was inspired by a [tweet](https://twitter.com/devdevcharlie/status/1241812642852995074) by @devdevcharlie where they did this with pose detection!

You can view a live demo at the following link: https://isolation-run.onrender.com

## Getting Setup Locally

1. Clone this repository

2. Run `npm run setup` to install all dependencies and build the frontend

3. Run `npm start` to start the backend/local server

You should now be able to see the site at `http://localhost:3000`. That won't be much use, so you should probably install something like [ngrok](https://ngrok.com/) so that you can access your local host on both your computer and your phone.

*This project makes use of WebSockets and will require a secure HTTPS connection, ngrok supports this but for other development environments (such as chrome port forwarding) you may need to set it up yourself.*

## Contributing

If you feel like contributing please check the Issues page for features/bugs, or raise your own issue with ideas or any bugs you encounter.
