ALTER TABLE "notebook_action" ADD COLUMN "starting_at" timestamptz NULL;
UPDATE "notebook_action" a
  SET starting_at=(SELECT created_at FROM "public"."notebook_action" b WHERE b.id=a.id);
ALTER TABLE notebook_action ALTER COLUMN starting_at SET NOT NULL;
