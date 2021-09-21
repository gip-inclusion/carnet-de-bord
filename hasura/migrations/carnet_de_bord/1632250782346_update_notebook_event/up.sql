
alter table "public"."notebook_event" drop column "data" cascade;

alter table "public"."notebook_event" add column "event" varchar
 null;

alter table "public"."notebook_event" add column "structure" varchar
 null;
