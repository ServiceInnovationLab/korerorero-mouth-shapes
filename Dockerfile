FROM heroku/heroku:18-build

ENV PORT=3000
ENV IS_DEV=false
EXPOSE 3000

WORKDIR /usr/src/app
COPY package*.json ./
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install libboost-all-dev -y
RUN npm install --unsafe-perm
COPY . .
RUN npm run build
CMD [ "npm", "start" ]
