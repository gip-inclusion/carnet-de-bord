
ALTER TABLE "public"."admin" ALTER COLUMN "email" TYPE citext;

ALTER TABLE "public"."beneficiary" ALTER COLUMN "email" TYPE citext;

ALTER TABLE "public"."professional" ALTER COLUMN "email" TYPE citext;

alter table "public"."manager" add constraint "manager_email_key" unique ("email");
