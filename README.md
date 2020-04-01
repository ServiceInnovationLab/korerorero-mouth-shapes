# korerorero-mouth-shapes

Exposing DanielSWolf / rhubarb-lip-sync as a service

## Docker setup

```bash
docker build -t rhubarb-lip-sync:latest .
```

To run

```bash
docker run -p 3000:3000 rhubarb-lip-sync:latest
```

Debug / to get a shell

```bash
docker run -it rhubarb-lip-sync:latest /bin/bash
```

To run

```bash
docker run -p 3000:3000 rhubarb-lip-sync:latest
```

To use as a development environment:

Changes in local `dist` folder are mapped into docker container.

```bash
docker run -p 3000:3000 -v $PWD/dist:/usr/src/app/dist rhubarb-lip-sync:latest
```

## Installation

Cmake is an external dependency, the OSX version is available here: <https://cmake.org/download/>

This code was tested against `cmake-3.17.0-rc2-Darwin-x86_64.dmg`

```bash
nvm use
cp .env.example .env
npm i
```

## Development

Build and watch files for changes, and start the express server with hot swapping enabled

```bash
npm run build & npm start
```

Visit <http://localhost:3000/> and you should see the Rhubarb version installed.
