alter table "public"."notebook_event" drop column "structure" cascade;
alter table "public"."notebook_event" drop column "event" cascade;
ALTER TABLE "public"."notebook_event" ALTER COLUMN "event_date" TYPE timestamptz;
alter table "public"."notebook_event" add column "event" jsonb not null;

CREATE TABLE "public"."notebook_event_type" ("value" text NOT NULL, "comment" text NOT NULL, PRIMARY KEY ("value") , UNIQUE ("value"));

alter table "public"."notebook_event" add column "event_type" text not null;

alter table "public"."notebook_event"
  add constraint "notebook_event_event_type_fkey"
  foreign key ("event_type")
  references "public"."notebook_event_type"
  ("value") on update restrict on delete restrict;
