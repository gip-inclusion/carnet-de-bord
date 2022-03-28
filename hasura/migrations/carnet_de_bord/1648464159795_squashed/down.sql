alter table "public"."notebook_event" drop constraint "notebook_event_event_type_fkey";

alter table "public"."notebook_event" alter column "event_type" drop not null;

DROP TABLE "public"."notebook_event_type";

ALTER TABLE "public"."notebook_event" ALTER COLUMN "event_date" TYPE date;

alter table "public"."notebook_event" alter column "event" drop not null;
alter table "public"."notebook_event" add column "event" varchar;

alter table "public"."notebook_event" alter column "structure" drop not null;
alter table "public"."notebook_event" add column "structure" varchar;
