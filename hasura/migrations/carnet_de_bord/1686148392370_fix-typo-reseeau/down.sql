UPDATE public.ref_target SET description='Développer son réseeau' WHERE description='Développer son réseau';
UPDATE public.notebook_target SET target='Développer son réseeau' WHERE target='Développer son réseau';
UPDATE public.notebook_event SET event = event::jsonb || '{"event_label":"Développer son réseeau"}' WHERE event->>'event_label' = 'Développer son réseau' AND event_type='target';
