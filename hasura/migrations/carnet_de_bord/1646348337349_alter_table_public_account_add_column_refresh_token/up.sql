CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."account" add column "refresh_token" uuid
 null default gen_random_uuid();
