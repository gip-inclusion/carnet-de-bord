
CREATE TABLE "public"."rome_codes" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "code" text NOT NULL, "description" text NOT NULL, "label" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."rome_codes" add constraint "rome_codes_label_key" unique ("label");
