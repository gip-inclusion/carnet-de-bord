CREATE TABLE "public"."notebook_target" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "focus_id" uuid NOT NULL, "target" varchar NOT NULL, "creation_date" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("focus_id") REFERENCES "public"."notebook_focus"("id") ON UPDATE restrict ON DELETE cascade);
CREATE EXTENSION IF NOT EXISTS pgcrypto;
