FROM node:16-slim

WORKDIR /app

ARG VITE_MATOMO_URL
ARG VITE_MATOMO_SITE_ID
ARG VITE_NO_LOGIN

ENV VITE_MATOMO_URL=$VITE_MATOMO_URL
ENV VITE_MATOMO_SITE_ID=$VITE_MATOMO_SITE_ID
ENV VITE_NO_LOGIN=$VITE_NO_LOGIN

COPY ./package.json package.json
COPY ./yarn.lock yarn.lock

# TODO: Sort dependencies and add "--production" install flag
RUN yarn --frozen-lockfile && yarn cache clean

COPY ./src src
COPY ./static static
COPY ./svelte.config.js svelte.config.js
COPY ./tsconfig.json tsconfig.json
COPY ./tailwind.config.cjs tailwind.config.cjs
COPY ./postcss.config.cjs postcss.config.cjs

RUN yarn build

EXPOSE 3000

CMD [ "node", "build" ]
