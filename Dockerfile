FROM node:13.5-alpine

WORKDIR /app

COPY package.json .

RUN apk add --no-cache make gcc g++ python && \
  npm install --production --silent && \
  apk del make gcc g++ python

COPY . .

EXPOSE 3000

CMD npm run start