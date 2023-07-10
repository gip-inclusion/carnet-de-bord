
CREATE TABLE "public"."notebook_visit" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "notebook_id" UUID NOT NULL, "account_id" UUID NOT NULL, "visited_at" timestamptz NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("notebook_id") REFERENCES "public"."notebook"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON UPDATE restrict ON DELETE restrict);COMMENT ON TABLE "public"."notebook_visit" IS E'store notebook visit on a given notebook';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.notebook_record_visit()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
  INSERT INTO public.notebook_visit(notebook_id, account_id, visited_at)
    VALUES(NEW.notebook_id, NEW.account_id, NEW.last_visited_at);
  RETURN NEW;
END;
$$;

CREATE TRIGGER notebook_record_visit
  AFTER UPDATE OF last_visited_at
  ON public.notebook_member
  FOR EACH ROW
  EXECUTE PROCEDURE public.notebook_record_visit();

CREATE  INDEX "notebook_visit_visited_at_account_key" on
  "public"."notebook_visit" using btree ("visited_at", "account_id");
