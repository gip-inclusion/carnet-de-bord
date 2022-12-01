ARG HASURA_VERSION=2.15.2
FROM hasura/graphql-engine:v${HASURA_VERSION}-ce.cli-migrations-v3

ENV HASURA_GRAPHQL_ENABLE_TELEMETRY=false
ENV HASURA_GRAPHQL_SHOW_UPDATE_NOTIFICATION=false
ENV HASURA_GRAPHQL_SERVER_PORT=8080

CMD ["graphql-engine", "serve"]

COPY hasura/metadata /hasura-metadata
COPY hasura/migrations /hasura-migrations

USER 1001
