# korerorero-mouth-shapes

Exposing DanielSWolf / rhubarb-lip-sync as a service

## Docker setup

```Bash
docker build -t rhubarb-lip-sync:latest . 
```

To get a shell
```Bash
docker run -it rhubarb-lip-sync:latest  /bin/bash   
```

## Installation

Cmake is an external dependency, the OSX version is available here: https://cmake.org/download/

This code was tested against `cmake-3.17.0-rc2-Darwin-x86_64.dmg`

```bash
nvm use
cp .env.example .env 
npm i
```

## Development

Build and watch files for changes, and start the express server with hot swapping enabled

```
npm run build & npm start
```

Visit http://localhost:3000/ and you should see the Rhubarb version installed.
