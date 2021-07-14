FROM node:16-slim

WORKDIR /app

COPY ./package.json package.json
RUN yarn --frozen-lockfile

COPY ./src src
COPY ./static static
COPY ./knexfile.js knexfile.js
COPY ./svelte.config.js svelte.config.js
COPY ./tsconfig.json tsconfig.json

RUN yarn build

EXPOSE 3000

CMD [ "node", "build" ]

