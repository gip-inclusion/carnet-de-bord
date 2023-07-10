
DROP INDEX IF EXISTS "public"."notebook_visit_visited_at_account_key";

DROP TRIGGER IF EXISTS notebook_record_visit ON public.notebook_member;
DROP FUNCTION IF EXISTS public.notebook_record_visit();

DROP TABLE "public"."notebook_visit";
