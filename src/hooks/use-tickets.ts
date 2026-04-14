import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Ticket, Client } from '@/lib/mock-data';

const TICKETS_KEY = ['tickets'];
const CLIENTS_KEY = ['clients'];

export function useTickets() {
  return useQuery({
    queryKey: TICKETS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*, clients(*), ticket_parts(part_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Ticket[];
    },
  });
}

export function useClients() {
  return useQuery({
    queryKey: CLIENTS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('company');
      if (error) throw error;
      return data as Client[];
    },
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ticket: {
      client_id: string;
      title: string;
      description: string;
      service_type: string;
      priority: string;
      equipment_model: string;
      serial_number: string;
      assigned_tech: string;
    }) => {
      const { data, error } = await supabase
        .from('tickets')
        .insert(ticket)
        .select('*, clients(*), ticket_parts(part_name)')
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKETS_KEY });
    },
  });
}
