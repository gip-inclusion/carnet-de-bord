ALTER TABLE "public"."notebook_event" DROP COLUMN "structure" cascade;
ALTER TABLE "public"."notebook_event" DROP COLUMN "event" cascade;
ALTER TABLE "public"."notebook_event" ALTER COLUMN "event_date" TYPE timestamptz;
ALTER TABLE "public"."notebook_event" add column "event" jsonb not null;

CREATE TABLE "public"."notebook_event_type" ("value" text NOT NULL, "comment" text NOT NULL, PRIMARY KEY ("value") , UNIQUE ("value"));

ALTER TABLE "public"."notebook_event" ADD COLUMN "event_type" text NOT NULL;

ALTER TABLE "public"."notebook_event"
  ADD CONSTRAINT "notebook_event_event_type_fkey"
  FOREIGN KEY ("event_type")
  REFERENCES "public"."notebook_event_type"
  ("value") ON UPDATE RESTRICT ON DELETE RESTRICT;

INSERT INTO "public"."notebook_event_type" (value, comment) VALUES ('action','Action d''un objectif');
INSERT INTO "public"."notebook_event_type" (value, comment) VALUES ('target','Objectif d''un parcours');
