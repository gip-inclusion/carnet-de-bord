CREATE FUNCTION public.remove_redundant_referents(nb_id UUID, ref_id UUID)
RETURNS void AS $$
  UPDATE notebook_member
  SET member_type = 'no_referent'
  WHERE notebook_id = nb_id
  AND account_id != ref_id
  AND member_type = 'referent'
$$ LANGUAGE sql;

-- SELECT public.remove_redundant_referents(nb_id, ref_id)
-- FROM (VALUES
-- ('UUID_notebook'::UUID, 'UUID_referent'::UUID),
-- AS t (nb_id, ref_id);


CREATE UNIQUE INDEX "notebook_member_unique_referent"
  ON "public"."notebook_member" (notebook_id)
  WHERE (active)
  AND member_type='referent';
