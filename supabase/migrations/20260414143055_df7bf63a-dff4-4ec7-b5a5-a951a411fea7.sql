
-- Create enum types
CREATE TYPE public.service_type AS ENUM ('preventivo', 'correctivo', 'instalacion');
CREATE TYPE public.ticket_priority AS ENUM ('baja', 'media', 'alta', 'critica');
CREATE TYPE public.ticket_status AS ENUM ('abierto', 'en_proceso', 'pausado', 'cerrado');

-- Clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tickets table
CREATE TABLE public.tickets (
  id SERIAL PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  service_type public.service_type NOT NULL DEFAULT 'correctivo',
  priority public.ticket_priority NOT NULL DEFAULT 'media',
  status public.ticket_status NOT NULL DEFAULT 'abierto',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  equipment_model TEXT NOT NULL DEFAULT '',
  serial_number TEXT NOT NULL DEFAULT '',
  assigned_tech TEXT NOT NULL DEFAULT 'Sin asignar',
  scheduled_date DATE,
  scheduled_time TIME,
  closed_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  resolution_time_hours NUMERIC(6,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ticket parts (repuestos)
CREATE TABLE public.ticket_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  part_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Intervention history
CREATE TABLE public.intervention_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  performed_by TEXT NOT NULL DEFAULT '',
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_history ENABLE ROW LEVEL SECURITY;

-- RLS policies: authenticated users have full access
CREATE POLICY "Authenticated users can view clients" ON public.clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create clients" ON public.clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update clients" ON public.clients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete clients" ON public.clients FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view tickets" ON public.tickets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create tickets" ON public.tickets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update tickets" ON public.tickets FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete tickets" ON public.tickets FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view ticket_parts" ON public.ticket_parts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create ticket_parts" ON public.ticket_parts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete ticket_parts" ON public.ticket_parts FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view history" ON public.intervention_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create history" ON public.intervention_history FOR INSERT TO authenticated WITH CHECK (true);

-- Also allow anonymous access for now (before auth is implemented)
CREATE POLICY "Anon can view clients" ON public.clients FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can create clients" ON public.clients FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update clients" ON public.clients FOR UPDATE TO anon USING (true);
CREATE POLICY "Anon can delete clients" ON public.clients FOR DELETE TO anon USING (true);

CREATE POLICY "Anon can view tickets" ON public.tickets FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can create tickets" ON public.tickets FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update tickets" ON public.tickets FOR UPDATE TO anon USING (true);
CREATE POLICY "Anon can delete tickets" ON public.tickets FOR DELETE TO anon USING (true);

CREATE POLICY "Anon can view ticket_parts" ON public.ticket_parts FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can create ticket_parts" ON public.ticket_parts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can delete ticket_parts" ON public.ticket_parts FOR DELETE TO anon USING (true);

CREATE POLICY "Anon can view history" ON public.intervention_history FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can create history" ON public.intervention_history FOR INSERT TO anon WITH CHECK (true);

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_tickets_client_id ON public.tickets(client_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_scheduled_date ON public.tickets(scheduled_date);
CREATE INDEX idx_ticket_parts_ticket_id ON public.ticket_parts(ticket_id);
CREATE INDEX idx_intervention_history_ticket_id ON public.intervention_history(ticket_id);
