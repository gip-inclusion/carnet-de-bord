ALTER TABLE notebook
ALTER COLUMN geographical_area TYPE INT
USING (CASE
    WHEN geographical_area IS NULL THEN NULL
    WHEN geographical_area = 'none' THEN 0
    WHEN geographical_area = 'less_10' THEN 10
    WHEN geographical_area = 'between_10_20' THEN 20
    WHEN geographical_area = 'between_20_30' THEN 30
    ELSE 30
END);
