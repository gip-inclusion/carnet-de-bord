FROM hasura/graphql-engine:v2.0.10.cli-migrations-v3

ENV HASURA_GRAPHQL_V1_BOOLEAN_NULL_COLLAPSE=true

ENV HASURA_GRAPHQL_ENABLE_TELEMETRY=false
ENV HASURA_GRAPHQL_MIGRATIONS_SERVER_TIMEOUT=180
ENV HASURA_GRAPHQL_SHOW_UPDATE_NOTIFICATION=falses
ENV HASURA_GRAPHQL_SERVER_PORT=80

CMD ["graphql-engine", "serve"]

COPY hasura/metadata /hasura-metadata
COPY hasura/migrations /hasura-migrations
