CREATE TABLE "public"."admin_structure" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "firstname" varchar, "lastname" varchar, "email" citext NOT NULL, "deployment_id" uuid NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("deployment_id") REFERENCES "public"."deployment"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("email"));
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_admin_structure_updated_at"
BEFORE UPDATE ON "public"."admin_structure"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_admin_structure_updated_at" ON "public"."admin_structure" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
