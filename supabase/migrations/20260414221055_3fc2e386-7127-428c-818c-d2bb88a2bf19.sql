-- Drop all anon policies from clients
DROP POLICY IF EXISTS "Anon can view clients" ON public.clients;
DROP POLICY IF EXISTS "Anon can create clients" ON public.clients;
DROP POLICY IF EXISTS "Anon can update clients" ON public.clients;
DROP POLICY IF EXISTS "Anon can delete clients" ON public.clients;

-- Drop all anon policies from tickets
DROP POLICY IF EXISTS "Anon can view tickets" ON public.tickets;
DROP POLICY IF EXISTS "Anon can create tickets" ON public.tickets;
DROP POLICY IF EXISTS "Anon can update tickets" ON public.tickets;
DROP POLICY IF EXISTS "Anon can delete tickets" ON public.tickets;

-- Drop all anon policies from ticket_parts
DROP POLICY IF EXISTS "Anon can view ticket_parts" ON public.ticket_parts;
DROP POLICY IF EXISTS "Anon can create ticket_parts" ON public.ticket_parts;
DROP POLICY IF EXISTS "Anon can delete ticket_parts" ON public.ticket_parts;

-- Drop all anon policies from intervention_history
DROP POLICY IF EXISTS "Anon can view history" ON public.intervention_history;
DROP POLICY IF EXISTS "Anon can create history" ON public.intervention_history;