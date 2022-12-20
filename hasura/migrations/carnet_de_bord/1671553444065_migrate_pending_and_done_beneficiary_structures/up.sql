ALTER TABLE beneficiary_structure
  ALTER COLUMN status
  SET DEFAULT 'current';

UPDATE beneficiary_structure
  SET status = 'current'
  WHERE status = 'done'
  OR status = 'pending';
