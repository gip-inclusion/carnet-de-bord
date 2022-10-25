FROM node:16-slim

WORKDIR /app

ARG PUBLIC_MATOMO_URL
ARG PUBLIC_MATOMO_SITE_ID
ARG PUBLIC_CRISP_WEBSITE_ID

ENV PUBLIC_MATOMO_URL=$PUBLIC_MATOMO_URL
ENV PUBLIC_MATOMO_SITE_ID=$PUBLIC_MATOMO_SITE_ID
ENV PUBLIC_CRISP_WEBSITE_ID=$PUBLIC_CRISP_WEBSITE_ID

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

USER 1000

CMD [ "node", "build" ]
