FROM node:16

WORKDIR /app

COPY package*.json ./

COPY . .

ENV PORT = 4000

CMD [ "node", "server/server.mjs" ]

EXPOSE 4000