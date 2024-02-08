FROM node:alpine

WORKDIR /client

COPY package*.json .

RUN npm i

COPY . .

EXPOSE 9000

CMD ["node", "index.js"]