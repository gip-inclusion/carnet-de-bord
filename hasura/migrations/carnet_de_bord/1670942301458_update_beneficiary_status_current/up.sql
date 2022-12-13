UPDATE beneficiary_structure
	SET status = 'current'
	WHERE status in ('pending', 'done');
