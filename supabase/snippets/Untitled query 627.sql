-- 1. Crear las columnas relacionales si no existen
ALTER TABLE public.requests ADD COLUMN IF NOT EXISTS specialty_ids integer[] DEFAULT '{}';
ALTER TABLE public.organization_deliverables ADD COLUMN IF NOT EXISTS specialty_ids integer[] DEFAULT '{}';
ALTER TABLE public.request_tasks ADD COLUMN IF NOT EXISTS specialty_id integer;

DO $$
DECLARE
    rec RECORD;
    spec_design_id integer;
    spec_dev_id integer;
    spec_av_id integer;
    spec_copy_id integer;
    spec_prod_id integer;
    spec_staff_id integer;
    spec_rp_id integer;
BEGIN
    -- Asegurar que existan las especialidades base
    INSERT INTO public.specialties (name) VALUES ('Diseño') ON CONFLICT (name) DO NOTHING;
    INSERT INTO public.specialties (name) VALUES ('Programación') ON CONFLICT (name) DO NOTHING;
    INSERT INTO public.specialties (name) VALUES ('Audiovisual') ON CONFLICT (name) DO NOTHING;
    INSERT INTO public.specialties (name) VALUES ('Contenido') ON CONFLICT (name) DO NOTHING;
    INSERT INTO public.specialties (name) VALUES ('Producción') ON CONFLICT (name) DO NOTHING;
    INSERT INTO public.specialties (name) VALUES ('Staff') ON CONFLICT (name) DO NOTHING;
    INSERT INTO public.specialties (name) VALUES ('Relaciones Públicas') ON CONFLICT (name) DO NOTHING;

    -- Obtener los IDs de las especialidades ignorando acentos y mayúsculas
    SELECT id INTO spec_design_id FROM public.specialties WHERE name ILIKE '%Diseño%' OR name ILIKE '%Diseno%' LIMIT 1;
    SELECT id INTO spec_dev_id FROM public.specialties WHERE name ILIKE '%Programación%' OR name ILIKE '%Programacion%' LIMIT 1;
    SELECT id INTO spec_av_id FROM public.specialties WHERE name ILIKE '%Audiovisual%' LIMIT 1;
    SELECT id INTO spec_copy_id FROM public.specialties WHERE name ILIKE '%Contenido%' OR name ILIKE '%Copy%' LIMIT 1;
    SELECT id INTO spec_prod_id FROM public.specialties WHERE name ILIKE '%Producción%' OR name ILIKE '%Produccion%' LIMIT 1;
    SELECT id INTO spec_staff_id FROM public.specialties WHERE name ILIKE '%Staff%' LIMIT 1;
    SELECT id INTO spec_rp_id FROM public.specialties WHERE name ILIKE '%Relaciones%' OR name ILIKE 'RP' LIMIT 1;

    -- Migrar tabla requests
    FOR rec IN SELECT id, needs_design, needs_dev, needs_av, needs_copy, needs_prod, needs_staff, needs_rp FROM public.requests
    LOOP
        UPDATE public.requests
        SET specialty_ids = array_remove(ARRAY[
            CASE WHEN rec.needs_design AND spec_design_id IS NOT NULL THEN spec_design_id ELSE NULL END,
            CASE WHEN rec.needs_dev AND spec_dev_id IS NOT NULL THEN spec_dev_id ELSE NULL END,
            CASE WHEN rec.needs_av AND spec_av_id IS NOT NULL THEN spec_av_id ELSE NULL END,
            CASE WHEN rec.needs_copy AND spec_copy_id IS NOT NULL THEN spec_copy_id ELSE NULL END,
            CASE WHEN rec.needs_prod AND spec_prod_id IS NOT NULL THEN spec_prod_id ELSE NULL END,
            CASE WHEN rec.needs_staff AND spec_staff_id IS NOT NULL THEN spec_staff_id ELSE NULL END,
            CASE WHEN rec.needs_rp AND spec_rp_id IS NOT NULL THEN spec_rp_id ELSE NULL END
        ]::integer[], NULL)
        WHERE id = rec.id;
    END LOOP;

    -- Migrar tabla organization_deliverables
    FOR rec IN SELECT id, needs_design, needs_dev, needs_av, needs_copy, needs_prod, needs_staff, needs_rp FROM public.organization_deliverables
    LOOP
        UPDATE public.organization_deliverables
        SET specialty_ids = array_remove(ARRAY[
            CASE WHEN rec.needs_design AND spec_design_id IS NOT NULL THEN spec_design_id ELSE NULL END,
            CASE WHEN rec.needs_dev AND spec_dev_id IS NOT NULL THEN spec_dev_id ELSE NULL END,
            CASE WHEN rec.needs_av AND spec_av_id IS NOT NULL THEN spec_av_id ELSE NULL END,
            CASE WHEN rec.needs_copy AND spec_copy_id IS NOT NULL THEN spec_copy_id ELSE NULL END,
            CASE WHEN rec.needs_prod AND spec_prod_id IS NOT NULL THEN spec_prod_id ELSE NULL END,
            CASE WHEN rec.needs_staff AND spec_staff_id IS NOT NULL THEN spec_staff_id ELSE NULL END,
            CASE WHEN rec.needs_rp AND spec_rp_id IS NOT NULL THEN spec_rp_id ELSE NULL END
        ]::integer[], NULL)
        WHERE id = rec.id;
    END LOOP;

    -- Migrar tabla request_tasks (mapear discipline text a specialty_id integer)
    FOR rec IN SELECT id, discipline FROM public.request_tasks WHERE discipline IS NOT NULL
    LOOP
        UPDATE public.request_tasks
        SET specialty_id = (
            CASE 
                WHEN rec.discipline ILIKE '%Diseño%' OR rec.discipline ILIKE '%Diseno%' THEN spec_design_id
                WHEN rec.discipline ILIKE '%Programación%' OR rec.discipline ILIKE '%Programacion%' THEN spec_dev_id
                WHEN rec.discipline ILIKE '%Audiovisual%' THEN spec_av_id
                WHEN rec.discipline ILIKE '%Contenido%' OR rec.discipline ILIKE '%Copy%' THEN spec_copy_id
                WHEN rec.discipline ILIKE '%Producción%' OR rec.discipline ILIKE '%Produccion%' THEN spec_prod_id
                WHEN rec.discipline ILIKE '%Staff%' THEN spec_staff_id
                WHEN rec.discipline ILIKE '%Relaciones Públicas%' OR rec.discipline ILIKE '%Relaciones Publicas%' OR rec.discipline ILIKE 'RP' THEN spec_rp_id
                ELSE NULL
            END
        )
        WHERE id = rec.id;
    END LOOP;

END $$;