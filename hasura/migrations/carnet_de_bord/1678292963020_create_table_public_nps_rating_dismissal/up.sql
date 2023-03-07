CREATE TABLE "public"."nps_rating_dismissal" (
	"id" uuid NOT NULL DEFAULT gen_random_uuid(),
	PRIMARY KEY ("id"),
	"account_id" uuid NOT NULL, "dismissed_at" timestamptz NOT NULL DEFAULT now(),
	FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON UPDATE cascade ON DELETE cascade
);
COMMENT ON TABLE "public"."nps_rating_dismissal" IS E'Store when a user dismisses an NPS rating';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
