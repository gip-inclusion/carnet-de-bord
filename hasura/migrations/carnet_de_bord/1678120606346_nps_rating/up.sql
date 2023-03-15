CREATE TABLE "public"."nps_rating" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "account_id" uuid NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "score" integer NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON UPDATE cascade ON DELETE cascade,
    CONSTRAINT "score_between_0_and_10" CHECK ((score >= 0 AND score <= 10)));
COMMENT ON TABLE "public"."nps_rating" IS E'NPS ratings from users';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.nps_rating_created_at_posix(nps_rating_row nps_rating)
  RETURNS double precision
  LANGUAGE sql
  STABLE
AS
$function$
SELECT EXTRACT (EPOCH FROM nps_rating_row.created_at) * 1000.0;
$function$;

CREATE TABLE "public"."nps_rating_dismissal" (
	"id" uuid NOT NULL DEFAULT gen_random_uuid(),
	PRIMARY KEY ("id"),
	"account_id" uuid NOT NULL, "dismissed_at" timestamptz NOT NULL DEFAULT now(),
	FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON UPDATE cascade ON DELETE cascade
);
COMMENT ON TABLE "public"."nps_rating_dismissal" IS E'Store when a user dismisses an NPS rating';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION
	public.nps_rating_dismissal_dismissed_at_posix(
		nps_rating_dismissal_row nps_rating_dismissal
	)
  RETURNS double precision
  LANGUAGE sql
  STABLE
AS
$function$
SELECT EXTRACT (EPOCH FROM nps_rating_dismissal_row.dismissed_at) * 1000.0;
$function$;
