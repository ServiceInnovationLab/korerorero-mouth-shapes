# Korerorero / Mouth Shapes

This project is a component of korerorero-reverse-proxy project: <https://github.com/ServiceInnovationLab/korerorero-reverse-proxy>

Exposing DanielSWolf / rhubarb-lip-sync as a service

## .env setup

```bash
cp .env.example .env
```

## Docker setup

```bash
docker build -t korerorero-mouth-shapes:latest .
```

__To run__

```bash
docker run -p 3000:3000 korerorero-mouth-shapes:latest
```

__To run tests on local code changes__

```bash
docker run -it  -v $PWD/src:/usr/src/app/src korerorero-mouth-shapes:latest /usr/bin/npm test
```

__Debug / to get a shell__

```bash
docker run -it korerorero-mouth-shapes:latest /bin/bash
```

__To use as a development environment__

Changes in local project folder are mapped into docker container.

```bash
docker run -p 3000:3000 -v $PWD:/usr/src/app korerorero-mouth-shapes:latest
```

## Installation

Use the docker instructions above. It's a whole thing to set up this environment on your local machine.

Visit <http://localhost:3000/> and you should see the Rhubarb version installed.

## Development

(From within a docker instance)

Build and watch files for changes, and start the express server with hot swapping enabled

```bash
npm run build & npm start
```
