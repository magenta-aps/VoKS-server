FROM node:12

WORKDIR /var/www/html/server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9001

RUN chmod +x ./docker/entrypoint.sh
ENTRYPOINT [ "./docker/entrypoint.sh" ]

CMD ["node", "run.js"]
