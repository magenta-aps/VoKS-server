FROM node:12

WORKDIR /var/www/html/server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9001

CMD ["node", "run.js"]
