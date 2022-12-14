CREATE UNIQUE INDEX "notebook_member_unique_referent"
  ON "public"."notebook_member" (notebook_id)
  WHERE (active)
  AND member_type='referent';
