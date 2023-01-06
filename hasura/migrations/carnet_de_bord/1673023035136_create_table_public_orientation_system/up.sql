CREATE TABLE "public"."orientation_system" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "deployment_id" uuid NOT NULL, "orientation_type" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("orientation_type") REFERENCES "public"."orientation_type"("id") ON UPDATE cascade ON DELETE restrict);
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
CREATE TRIGGER "set_public_orientation_system_updated_at"
BEFORE UPDATE ON "public"."orientation_system"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_orientation_system_updated_at" ON "public"."orientation_system"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
