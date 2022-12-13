CREATE VIEW notebook_public_view AS
SELECT
    id, beneficiary_id, created_at, updated_at
FROM
    notebook;
