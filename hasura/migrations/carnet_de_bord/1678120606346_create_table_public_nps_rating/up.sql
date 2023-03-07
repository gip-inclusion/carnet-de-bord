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
