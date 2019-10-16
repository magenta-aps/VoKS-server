FROM node:12

WORKDIR /var/www/html/server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9001

ARG WS_SERVER_DEBUG=true
ENV WS_SERVER_DEBUG=${WS_SERVER_DEBUG}

RUN chmod +x ./docker/entrypoint.sh
ENTRYPOINT [ "./docker/entrypoint.sh" ]