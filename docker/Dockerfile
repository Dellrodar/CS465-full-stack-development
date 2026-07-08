FROM node:24-slim AS dev

WORKDIR /usr/src/app

COPY travlr/ ./

RUN npm install && npm audit fix --force

CMD [ "npm", "start" ]
