
CREATE TABLE "public"."ref_situation" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "description" varchar NOT NULL, "theme" varchar NOT NULL, PRIMARY KEY ("id") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."ref_target" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "description" varchar NOT NULL, "situation_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("situation_id") REFERENCES "public"."ref_situation"("id") ON UPDATE restrict ON DELETE cascade);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."ref_action" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "description" varchar NOT NULL, "target_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("target_id") REFERENCES "public"."ref_target"("id") ON UPDATE restrict ON DELETE cascade);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."ref_target" drop column "situation_id" cascade;

alter table "public"."ref_target" add column "theme" varchar
 null;
