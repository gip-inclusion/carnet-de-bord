CREATE TABLE "public"."deployment_orientation_system" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "deployment_id" uuid NOT NULL, "orientation_system_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("deployment_id") REFERENCES "public"."deployment"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("orientation_system_id") REFERENCES "public"."orientation_system"("id") ON UPDATE cascade ON DELETE cascade);