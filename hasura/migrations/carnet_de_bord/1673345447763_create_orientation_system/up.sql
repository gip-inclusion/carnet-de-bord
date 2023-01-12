
CREATE TABLE "public"."orientation_system" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "orientation_type" text NOT NULL, PRIMARY KEY ("id") , "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), FOREIGN KEY ("orientation_type") REFERENCES "public"."orientation_type"("id") ON UPDATE cascade ON DELETE restrict);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_orientation_system_updated_at"
BEFORE UPDATE ON "public"."orientation_system"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_orientation_system_updated_at" ON "public"."orientation_system"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

INSERT INTO public.orientation_system (name, orientation_type) VALUES ('Pro', 'pro');
INSERT INTO public.orientation_system (name, orientation_type) VALUES ('Socio-pro', 'sociopro');
INSERT INTO public.orientation_system (name, orientation_type) VALUES ('Social', 'social');

CREATE TABLE "public"."deployment_orientation_system" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "deployment_id" uuid NOT NULL, "orientation_system_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("deployment_id") REFERENCES "public"."deployment"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("orientation_system_id") REFERENCES "public"."orientation_system"("id") ON UPDATE cascade ON DELETE cascade);

CREATE TABLE "public"."structure_orientation_system" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "structure_id" uuid NOT NULL, "orientation_system_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("structure_id") REFERENCES "public"."structure"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("orientation_system_id") REFERENCES "public"."orientation_system"("id") ON UPDATE cascade ON DELETE cascade);

CREATE TABLE "public"."professional_orientation_system" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "professional_id" uuid NOT NULL, "orientation_system_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("professional_id") REFERENCES "public"."professional"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("orientation_system_id") REFERENCES "public"."orientation_system"("id") ON UPDATE cascade ON DELETE cascade);
