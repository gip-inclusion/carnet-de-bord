CREATE TABLE "public"."notebook_creation_source_type" (
	"id" text,
	"comment" text,
	PRIMARY KEY ("id")
);
COMMENT ON TABLE "public"."notebook_creation_source_type" IS E'Enum table which contains available sources that create notebooks';

INSERT INTO "public"."notebook_creation_source_type" VALUES('rdvi', 'Service Rendez-vous Insertion');


CREATE TABLE "public"."notebook_creation" (
	"id" uuid NOT NULL DEFAULT gen_random_uuid(), PRIMARY KEY ("id") ,
	"notebook_id" uuid NOT NULL,
	"creator_account_id" uuid NOT NULL,
	"source" text NOT NULL,
	"created_at" timestamptz NOT NULL default now(),
	FOREIGN KEY ("notebook_id") REFERENCES "public"."notebook"("id") ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY ("source") REFERENCES "public"."notebook_creation_source_type"("id") ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY ("creator_account_id") REFERENCES "public"."account"("id") ON UPDATE restrict ON DELETE restrict);


COMMENT ON TABLE "public"."notebook_creation" IS E'tracks notebook creations';
