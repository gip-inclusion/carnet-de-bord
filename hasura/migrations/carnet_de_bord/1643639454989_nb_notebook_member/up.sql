CREATE OR REPLACE FUNCTION nb_member(notebook_row notebook)
RETURNS bigint AS $$
    SELECT count(*)
    FROM notebook_member A
    WHERE A.notebook_id = notebook_row.id
$$ LANGUAGE sql STABLE;
