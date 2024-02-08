FROM node:alpine

WORKDIR /client

COPY package*.json .

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "start"]