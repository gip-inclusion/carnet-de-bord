UPDATE public.ref_target SET description='Développer son réseau' WHERE description='Développer son réseeau';
UPDATE public.notebook_target SET target='Développer son réseau' WHERE target='Développer son réseeau';
UPDATE public.notebook_event SET event = event::jsonb || '{"event_label":"Développer son réseau"}' WHERE event->>'event_label' = 'Développer son réseeau' AND event_type='target';
