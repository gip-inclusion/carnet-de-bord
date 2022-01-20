
alter table "public"."account" alter column "username" set default gen_random_uuid();

alter table "public"."manager" alter column "firstname" drop not null;

alter table "public"."manager" alter column "lastname" drop not null;
