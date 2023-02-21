ALTER TABLE notebook
ALTER COLUMN geographical_area TYPE VARCHAR
USING (CASE
  WHEN geographical_area IS NULL THEN NULL
  WHEN geographical_area::integer = 0 THEN 'none'
  WHEN geographical_area::integer <= 10 THEN 'less_10'
  WHEN geographical_area::integer <= 20 THEN 'between_10_20'
  WHEN geographical_area::integer <= 30 THEN 'between_20_30'
  ELSE 'plus_30'
END);
