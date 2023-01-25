CREATE TABLE "public"."deployment_orientation_system" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "deployment_id" uuid NOT NULL, "orientation_system_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("deployment_id") REFERENCES "public"."deployment"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("orientation_system_id") REFERENCES "public"."orientation_system"("id") ON UPDATE cascade ON DELETE cascade);

ALTER TABLE "notebook_info" ADD "orientation" text;

ALTER TABLE "notebook_info"

ADD CONSTRAINT "notebook_info_orientation_fkey"
	FOREIGN KEY ("orientation") REFERENCES "orientation_type"("id") ON UPDATE RESTRICT ON DELETE RESTRICT;

UPDATE "notebook_info"
	SET "orientation"="orientation_system"."orientation_type"
	FROM "orientation_system"
	WHERE "notebook_info"."orientation_system_id"="orientation_system"."id";

ALTER TABLE "notebook_info" DROP COLUMN "orientation_system_id" CASCADE;

ALTER TABLE "orientation_request" ADD "requested_orientation_type_id" text NULL;

ALTER TABLE "orientation_request"

ADD CONSTRAINT "orientation_request_requested_orientation_type_id_fkey"
	FOREIGN KEY ("requested_orientation_type_id") REFERENCES "orientation_type"("id") ON UPDATE RESTRICT ON DELETE RESTRICT;

UPDATE "orientation_request"
	SET "requested_orientation_type_id"="orientation_system"."orientation_type"
	FROM "orientation_system"
	WHERE "orientation_request"."requested_orientation_system_id"="orientation_system"."id";

ALTER TABLE "orientation_request" ALTER "requested_orientation_type_id" SET NOT NULL;

ALTER TABLE "orientation_request" DROP COLUMN "requested_orientation_system_id" CASCADE;

ALTER TABLE "orientation_request" ADD "decided_orientation_type_id" text NULL;

ALTER TABLE "orientation_request" ADD CONSTRAINT "orientation_request_decided_orientation_type_id_fkey"
	FOREIGN KEY ("decided_orientation_type_id") REFERENCES "orientation_type"("id") ON UPDATE RESTRICT ON DELETE RESTRICT;

UPDATE "orientation_request"
	SET "decided_orientation_type_id"="orientation_system"."orientation_type"
	FROM "orientation_system"
	WHERE "orientation_request"."decided_orientation_system_id"="orientation_system"."id";

ALTER TABLE "orientation_request" DROP COLUMN "decided_orientation_system_id" CASCADE;
