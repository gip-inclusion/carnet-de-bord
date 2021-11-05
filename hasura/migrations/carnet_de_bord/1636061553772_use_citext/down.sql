
alter table "public"."manager" drop constraint "manager_email_key";

ALTER TABLE "public"."professional" ALTER COLUMN "email" TYPE character varying;

ALTER TABLE "public"."beneficiary" ALTER COLUMN "email" TYPE character varying;

ALTER TABLE "public"."admin" ALTER COLUMN "email" TYPE character varying;
