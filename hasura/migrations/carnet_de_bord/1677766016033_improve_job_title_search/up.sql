CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_code
 LANGUAGE sql
 STABLE
AS $function$
SELECT
  *
FROM
  rome_code
WHERE
  unaccent(lower(label)) LIKE
    '%' || array_to_string(string_to_array(unaccent(lower(search)), ' '), '%') || '%'
ORDER BY unaccent(lower(search)) <<-> unaccent(lower(label)) ASC
$function$;
