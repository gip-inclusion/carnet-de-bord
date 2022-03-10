
DROP FUNCTION IF EXISTS public.search_rome_codes


alter table "public"."rome_codes" drop constraint "rome_codes_label_key";

DROP TABLE "public"."rome_codes";
