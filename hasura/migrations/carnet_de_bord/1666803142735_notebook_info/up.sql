CREATE TABLE "public"."notebook_info" (
	"notebook_id" uuid NOT NULL,
	"orientation" text,
	"need_orientation" boolean NOT NULL DEFAULT 'false',
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY ("notebook_id"),
	FOREIGN KEY ("notebook_id") REFERENCES "public"."notebook"("id") ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY ("orientation") REFERENCES "public"."orientation_type"("id") ON UPDATE restrict ON DELETE restrict
);
COMMENT ON TABLE "public"."notebook_info" IS 'notebook orientation infos';

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
CREATE TRIGGER "set_public_notebook_info_updated_at"
BEFORE UPDATE ON "public"."notebook_info"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();

COMMENT ON TRIGGER "set_public_notebook_info_updated_at" ON "public"."notebook_info"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

insert into notebook_info(notebook_id, orientation, created_at, updated_at)
	select notebook.id, orientation, beneficiary_info.created_at, beneficiary_info.updated_at
	from beneficiary_info, notebook
	where notebook.beneficiary_id = beneficiary_info.beneficiary_id;

DROP table "public"."beneficiary_info";
