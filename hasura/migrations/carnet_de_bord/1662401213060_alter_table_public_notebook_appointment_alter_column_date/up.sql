ALTER TABLE "public"."notebook_appointment" ALTER COLUMN "date" TYPE timestamp;
-- Set default appointment minute to 00
UPDATE "public"."notebook_appointment" set date = date_trunc('hour', now())
