DROP TABLE "public"."admin_structure_structure";

alter table "public"."account" drop constraint "account_admin_structure_id_fkey";

alter table "public"."account" drop column "admin_structure_id";

DROP TABLE "public"."admin_structure";

DROP TABLE "public"."beneficiary_structure";
