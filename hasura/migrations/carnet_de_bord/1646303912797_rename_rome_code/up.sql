DROP FUNCTION IF EXISTS public.search_rome_codes;

ALTER TABLE rome_codes RENAME TO rome_code;

CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_code
 LANGUAGE sql
 STABLE
AS $function$
  SELECT *
  FROM rome_code
  WHERE
    unaccent(search) <% label
  ORDER BY unaccent(search) <<-> label ASC
$function$;
