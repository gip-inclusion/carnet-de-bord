DROP TRIGGER IF EXISTS "set_public_admin_updated_at" ON "public"."admin";
ALTER TABLE "public"."admin" drop column IF EXISTS "created_at";
ALTER TABLE"public"."admin" drop column IF EXISTS  "updated_at";

ALTER TABLE"public"."account" drop constraint if exists "account_manager_id_fkey";
ALTER TABLE "public"."structure" drop constraint if exists "structure_deployment_id_fkey";
ALTER TABLE "public"."structure" drop column IF EXISTS "deployment_id";
ALTER TABLE"public"."account" drop column IF EXISTS  "manager_id";

DROP TABLE IF EXISTS "public"."manager";

DROP TABLE IF EXISTS "public"."deployment";

DROP DOMAIN IF EXISTS email;
