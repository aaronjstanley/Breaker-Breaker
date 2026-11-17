-- Breaker Breaker schema (project: ltryvlcrnjdfjyqcufgq)

CREATE TABLE public.breaker_panels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Main Panel',
  row_count INT NOT NULL DEFAULT 10 CHECK (row_count >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.breakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id UUID NOT NULL REFERENCES public.breaker_panels(id) ON DELETE CASCADE,
  slot_number INT NOT NULL CHECK (slot_number >= 1),
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  amps INT NULL CHECK (amps IS NULL OR amps IN (0, 15, 20, 25, 30, 40, 50, 60)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (panel_id, slot_number)
);

CREATE INDEX breakers_panel_id_slot_number_idx
  ON public.breakers (panel_id, slot_number);

ALTER TABLE public.breaker_panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breakers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "breaker_panels_all" ON public.breaker_panels
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "breakers_all" ON public.breakers
  FOR ALL USING (true) WITH CHECK (true);

-- Seed one shared panel with 10 rows (slots 1–20)
INSERT INTO public.breaker_panels (id, name, row_count)
VALUES ('00000000-0000-4000-8000-000000000001', 'Main Panel', 10);

INSERT INTO public.breakers (panel_id, slot_number)
SELECT
  '00000000-0000-4000-8000-000000000001'::uuid,
  gs
FROM generate_series(1, 20) AS gs;
