CREATE TABLE "public"."orientation_request" (
	"id" uuid NOT NULL DEFAULT gen_random_uuid(),
	"beneficiary_id" UUID NOT NULL,
	"requestor_account_id" UUID NOT NULL,
	"requested_orientation_type_id" text NOT NULL,
	"decided_orientation_type_id" Text,
	"status" text,
	"decided_at" timestamptz,
	"reason" Text,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY ("id") ,
	FOREIGN KEY ("beneficiary_id") REFERENCES "public"."beneficiary"("id") ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY ("requestor_account_id") REFERENCES "public"."account"("id") ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY ("requested_orientation_type_id") REFERENCES "public"."orientation_type"("id") ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY ("decided_orientation_type_id") REFERENCES "public"."orientation_type"("id") ON UPDATE restrict ON DELETE restrict,
	UNIQUE ("id")
);
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
CREATE TRIGGER "set_public_orientation_request_updated_at"
BEFORE UPDATE ON "public"."orientation_request"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_orientation_request_updated_at" ON "public"."orientation_request"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
