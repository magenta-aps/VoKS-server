## Instructions for building Docker image

#### Certificates
Place certificates in `dev-environment/certs/`. And ensure the filenames match the ones specified in `dev-environment/configs/http.js`.
The docker application will fail on startup if these are not present.

#### Configuration
Dev environment config files are copied to the relevant folder during the entrypoint process if application is in debug mode.

#### Commands to run
From project root: `docker build -f docker/Dockerfile -t bcs-ws-server:dev .` builds the Docker image
From anywhere: `docker run -p 9001:9001 --rm bcs-ws-server:dev`

#### Testing
You should be able to communicate with the server (and make it crash) by sending an empty request to wss://loc.bcomesafe.com:9001.
Browser dev console example:
```ws = new WebSocket("wss://loc.bcomesafe.com:9001");```