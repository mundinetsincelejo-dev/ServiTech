import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Ticket, Client } from '@/lib/mock-data';
import type { Database } from '@/integrations/supabase/types';

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

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (client: Database['public']['Tables']['clients']['Insert']) => {
      const { data, error } = await supabase.from('clients').insert(client).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, client }: { id: string; client: Database['public']['Tables']['clients']['Update'] }) => {
      const { data, error } = await supabase.from('clients').update(client).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
    },
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ticket: Database['public']['Tables']['tickets']['Insert']) => {
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
