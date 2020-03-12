FROM heroku/heroku:18-build
WORKDIR /usr/src/app
COPY package*.json ./
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install libboost-all-dev -y
RUN npm install --unsafe-perm
COPY . .
EXPOSE 3000
RUN npm build &
CMD [ "npm", "start" ]
