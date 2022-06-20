CREATE TABLE "public"."orientation_type" (
	"id" text NOT NULL,
	"label" Text NOT NULL,
	PRIMARY KEY ("id")
);
COMMENT ON TABLE "public"."orientation_type" IS 'table contenant les différents types d’orientation';
INSERT INTO "public"."orientation_type"("id", "label")
VALUES ('social', 'Social');
INSERT INTO "public"."orientation_type"("id", "label")
VALUES ('pro', 'Professionnel');
INSERT INTO "public"."orientation_type"("id", "label")
VALUES ('sociopro', 'Socio-professionnel');


CREATE TABLE "public"."beneficiary_info" (
	"beneficiary_id" uuid NOT NULL,
	"orientation" text NOT NULL,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY ("beneficiary_id"),
	FOREIGN KEY ("beneficiary_id") REFERENCES "public"."beneficiary"("id") ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY ("orientation") REFERENCES "public"."orientation_type"("id") ON UPDATE restrict ON DELETE restrict
);
COMMENT ON TABLE "public"."beneficiary_info" IS 'beneficiary orientation info';

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
CREATE TRIGGER "set_public_beneficiary_info_updated_at"
BEFORE UPDATE ON "public"."beneficiary_info"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();

COMMENT ON TRIGGER "set_public_beneficiary_info_updated_at" ON "public"."beneficiary_info"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
