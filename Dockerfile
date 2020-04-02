FROM heroku/heroku:18-build

ENV PORT=3000
ENV IS_DEV=false
EXPOSE 3000

WORKDIR /usr/src/app
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install libboost-all-dev -y

WORKDIR /usr/src/app/vendor
RUN git clone https://github.com/ServiceInnovationLab/rhubarb-lip-sync.git
RUN sed -i '/^add_subdirectory(\"extras/d' rhubarb-lip-sync/CMakeLists.txt
RUN cmake -Wno-dev --CDBoost_NO_BOOST_CMAKE=ON rhubarb-lip-sync
RUN cmake --build .

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD [ "npm", "start" ]
