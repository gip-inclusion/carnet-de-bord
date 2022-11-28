CREATE OR REPLACE FUNCTION public.search_beneficiaries(search text)
RETURNS
 SETOF beneficiary
LANGUAGE sql STABLE
AS $function$
	SELECT
			*
	FROM
			beneficiary
	WHERE
			search = ''
			OR unaccent(search) <% unaccent(lastname)
			OR search <% pe_number
			OR search <% caf_number
			OR search <% mobile_number
$function$;
