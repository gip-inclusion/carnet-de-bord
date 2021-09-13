CREATE TABLE "public"."notebook_focus" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "theme" varchar NOT NULL, "situations" jsonb, "creator_id" uuid NOT NULL, "notebook_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("creator_id") REFERENCES "public"."professional"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("notebook_id") REFERENCES "public"."notebook"("id") ON UPDATE restrict ON DELETE cascade);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."notebook_focus" add column "creation_date" timestamptz
 not null default now();
