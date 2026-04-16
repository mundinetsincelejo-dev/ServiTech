
-- Replace service_type enum with IT-focused values
-- First update existing rows to a safe default
ALTER TABLE public.tickets ALTER COLUMN service_type DROP DEFAULT;

-- Create new enum
CREATE TYPE public.service_type_new AS ENUM (
  'impresoras',
  'computadores', 
  'redes_telecom',
  'camaras_seguridad',
  'desarrollo_software',
  'soporte_general'
);

-- Convert column
ALTER TABLE public.tickets 
  ALTER COLUMN service_type TYPE public.service_type_new 
  USING 'soporte_general'::public.service_type_new;

-- Drop old enum and rename new one
DROP TYPE public.service_type;
ALTER TYPE public.service_type_new RENAME TO service_type;

-- Set new default
ALTER TABLE public.tickets ALTER COLUMN service_type SET DEFAULT 'soporte_general'::service_type;
