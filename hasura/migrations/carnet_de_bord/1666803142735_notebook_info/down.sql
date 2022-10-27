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

CREATE TRIGGER "set_public_beneficiary_info_updated_at"
BEFORE UPDATE ON "public"."beneficiary_info"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();

COMMENT ON TRIGGER "set_public_beneficiary_info_updated_at" ON "public"."beneficiary_info"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

insert into beneficiary_info(beneficiary_id, orientation, created_at, updated_at)
	select notebook.beneficiary_id, orientation, notebook_info.created_at, notebook_info.updated_at
	from notebook_info, notebook
	where notebook.id = notebook_info.notebook_id;
