# syntax=docker/dockerfile:experimental
FROM heroku/heroku:18-build
# Download public key for github.com
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
WORKDIR /usr/src/app
RUN --mount=type=ssh git clone git@github.com:ServiceInnovationLab/rhubarb-lip-sync.git
RUN mkdir vendor
RUN mv rhubarb-lip-sync/ vendor/.
COPY package*.json ./
CMD [ "npm", "start" ]
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install libboost-all-dev -y
RUN npm install --unsafe-perm
COPY . .
EXPOSE 3000
RUN npm build &
CMD [ "npm", "start" ]
