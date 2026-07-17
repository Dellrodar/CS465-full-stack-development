FROM node:24-slim AS dev

WORKDIR /usr/src/app

COPY travlr/package*.json ./

RUN npm install && npm audit fix --force

COPY travlr/ ./

CMD [ "npm", "start" ]