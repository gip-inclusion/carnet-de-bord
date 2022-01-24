
alter table "public"."beneficiary" add column "internal_id" text
 null unique;

alter table "public"."beneficiary" drop column "internal_id" cascade;

alter table "public"."notebook" add column "internal_id" text
 null unique;
