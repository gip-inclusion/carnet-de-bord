
alter table "public"."manager" alter column "lastname" set not null;

alter table "public"."manager" alter column "firstname" set not null;

ALTER TABLE "public"."account" ALTER COLUMN "username" drop default;
