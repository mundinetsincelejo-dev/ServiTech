import type { Database } from '@/integrations/supabase/types';

// Types derived from database
export type TicketStatus = Database['public']['Enums']['ticket_status'];
export type TicketPriority = Database['public']['Enums']['ticket_priority'];
export type ServiceType = Database['public']['Enums']['service_type'];

export type Client = Database['public']['Tables']['clients']['Row'];

export type TicketRow = Database['public']['Tables']['tickets']['Row'];

// Ticket with joined client and parts
export interface Ticket extends TicketRow {
  clients: Client;
  ticket_parts: { part_name: string }[];
}

export const statusLabels: Record<TicketStatus, string> = {
  abierto: 'Abierto',
  en_proceso: 'En Proceso',
  pausado: 'Pausado',
  cerrado: 'Cerrado',
};

export const priorityLabels: Record<TicketPriority, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  critica: 'Crítica',
};

export const serviceTypeLabels: Record<ServiceType, string> = {
  preventivo: 'Preventivo',
  correctivo: 'Correctivo',
  instalacion: 'Instalación',
};
