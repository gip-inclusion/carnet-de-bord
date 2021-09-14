alter table "public"."notebook" alter column "work_situations" drop not null;
alter table "public"."notebook" add column "work_situations" jsonb;
