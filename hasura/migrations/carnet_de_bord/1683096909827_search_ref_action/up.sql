CREATE OR REPLACE FUNCTION public.search_ref_action(search text)
RETURNS
 SETOF ref_action
LANGUAGE sql STABLE
AS $function$
	SELECT
			*
	FROM
			ref_action
	WHERE
			search = ''
			OR unaccent(search) <% description
$function$;
