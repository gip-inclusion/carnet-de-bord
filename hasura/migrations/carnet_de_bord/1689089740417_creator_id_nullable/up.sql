
alter table "public"."notebook_focus" alter column "creator_id" drop not null;

alter table "public"."notebook_target" alter column "creator_id" drop not null;
