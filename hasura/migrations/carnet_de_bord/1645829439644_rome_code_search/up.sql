
CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_codes
 LANGUAGE sql
 STABLE
AS $function$
  SELECT rome_codes.*
  FROM rome_codes
  WHERE
      search = ''
      OR unaccent(search) <% rome_codes.label
$function$;

CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_codes
 LANGUAGE sql
 STABLE
AS $function$
  SELECT *
  FROM rome_codes
  WHERE
      search = ''
      OR unaccent(search) % label
  ORDER BY SIMILARITY(label, unaccent(search))
$function$;

CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_codes
 LANGUAGE sql
 STABLE
AS $function$
  SELECT *
  FROM rome_codes
  WHERE
    unaccent(search) % label
    AND SIMILARITY(label, unaccent(search)) > 0.7
  ORDER BY SIMILARITY(label, unaccent(search))
$function$;

CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_codes
 LANGUAGE sql
 STABLE
AS $function$
  SELECT *
  FROM rome_codes
  WHERE
    unaccent(search) <% label
    AND SIMILARITY(label, unaccent(search)) > 0.7
  ORDER BY SIMILARITY(label, unaccent(search))
$function$;

CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_codes
 LANGUAGE sql
 STABLE
AS $function$
  SELECT *
  FROM rome_codes
  WHERE
    unaccent(search) <% label
    AND SIMILARITY(label, unaccent(search)) > 0.4
  ORDER BY SIMILARITY(label, unaccent(search))
$function$;

CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_codes
 LANGUAGE sql
 STABLE
AS $function$
  SELECT *
  FROM rome_codes
  WHERE
    unaccent(search) <% label
  ORDER BY SIMILARITY(label, unaccent(search))
$function$;

CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_codes
 LANGUAGE sql
 STABLE
AS $function$
  SELECT *
  FROM rome_codes
  WHERE
    unaccent(search) <% label
  ORDER BY SIMILARITY(label, unaccent(search)) DESC
$function$;

CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_codes
 LANGUAGE sql
 STABLE
AS $function$
  SELECT *
  FROM rome_codes
  WHERE
    unaccent(search) % label
  ORDER BY SIMILARITY(label, unaccent(search)) DESC
$function$;

CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_codes
 LANGUAGE sql
 STABLE
AS $function$
  SET pg_trgm.similarity_threshold = 0.2;
  SELECT *
  FROM rome_codes
  WHERE
    unaccent(search) % label
  ORDER BY SIMILARITY(label, unaccent(search)) DESC
$function$;

CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_codes
 LANGUAGE sql
 STABLE
AS $function$
  SELECT *
  FROM rome_codes
  WHERE
    unaccent(search) % label
  ORDER BY SIMILARITY(label, unaccent(search)) DESC
$function$;

CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_codes
 LANGUAGE sql
 STABLE
AS $function$
  SELECT *
  FROM rome_codes
  WHERE
    unaccent(search) <% label
  ORDER BY SIMILARITY(label, unaccent(search)) DESC
$function$;

CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_codes
 LANGUAGE sql
 STABLE
AS $function$
  SELECT *
  FROM rome_codes
  WHERE
    unaccent(search) <% label
  ORDER BY unaccent(search) <<-> label DESC
$function$;

CREATE OR REPLACE FUNCTION public.search_rome_codes(search text)
 RETURNS SETOF rome_codes
 LANGUAGE sql
 STABLE
AS $function$
  SELECT *
  FROM rome_codes
  WHERE
    unaccent(search) <% label
  ORDER BY unaccent(search) <<-> label ASC
$function$;
