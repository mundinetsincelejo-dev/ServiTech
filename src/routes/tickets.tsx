import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import {
  statusLabels,
  priorityLabels,
  serviceTypeLabels,
  type Ticket,
  type TicketStatus,
  type TicketPriority,
  type ServiceType,
} from '@/lib/mock-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Search, Eye, Loader2 } from 'lucide-react';
import { useTickets, useClients, useCreateTicket } from '@/hooks/use-tickets';

export const Route = createFileRoute('/tickets')({
  component: TicketsPage,
  head: () => ({
    meta: [
      { title: 'Tickets — ServiTech' },
      { name: 'description', content: 'Gestión de solicitudes de servicio técnico' },
    ],
  }),
});

function TicketsPage() {
  const { data: tickets = [], isLoading } = useTickets();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [viewTicket, setViewTicket] = useState<Ticket | null>(null);

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.clients?.company || '').toLowerCase().includes(search.toLowerCase()) ||
      String(t.id).includes(search);
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar ticket, cliente..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {(Object.keys(statusLabels) as TicketStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" /> Nuevo Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Solicitud</DialogTitle>
              </DialogHeader>
              <CreateTicketForm onClose={() => setShowCreate(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Título</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Cliente</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">Tipo</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="hidden px-4 py-3 font-medium lg:table-cell">Prioridad</th>
                    <th className="hidden px-4 py-3 font-medium lg:table-cell">Técnico</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">#{t.id}</td>
                      <td className="max-w-[200px] truncate px-4 py-3 font-medium">{t.title}</td>
                      <td className="hidden px-4 py-3 sm:table-cell text-muted-foreground">{t.clients?.company}</td>
                      <td className="hidden px-4 py-3 md:table-cell text-muted-foreground">{serviceTypeLabels[t.service_type]}</td>
                      <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                      <td className="hidden px-4 py-3 lg:table-cell"><PriorityBadge priority={t.priority} /></td>
                      <td className="hidden px-4 py-3 lg:table-cell text-muted-foreground">{t.assigned_tech}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="icon" onClick={() => setViewTicket(t)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        No se encontraron tickets
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!viewTicket} onOpenChange={(open) => !open && setViewTicket(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            {viewTicket && <TicketDetail ticket={viewTicket} />}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

function CreateTicketForm({ onClose }: { onClose: () => void }) {
  const { data: clients = [] } = useClients();
  const createTicket = useCreateTicket();

  const [form, setForm] = useState({
    client_id: '',
    title: '',
    description: '',
    service_type: 'correctivo' as ServiceType,
    priority: 'media' as TicketPriority,
    equipment_model: '',
    serial_number: '',
    assigned_tech: 'Juan Pérez',
  });

  const handleSubmit = () => {
    if (!form.client_id || !form.title) return;
    createTicket.mutate(form, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Cliente</Label>
        <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
          <SelectTrigger><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
          <SelectContent>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name} — {c.company}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Título</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Descripción breve del problema" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Tipo de Servicio</Label>
          <Select value={form.service_type} onValueChange={(v) => setForm({ ...form, service_type: v as ServiceType })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(serviceTypeLabels) as ServiceType[]).map((s) => (
                <SelectItem key={s} value={s}>{serviceTypeLabels[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Prioridad</Label>
          <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as TicketPriority })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(priorityLabels) as TicketPriority[]).map((p) => (
                <SelectItem key={p} value={p}>{priorityLabels[p]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Modelo Equipo</Label>
          <Input value={form.equipment_model} onChange={(e) => setForm({ ...form, equipment_model: e.target.value })} />
        </div>
        <div>
          <Label>Nº Serie</Label>
          <Input value={form.serial_number} onChange={(e) => setForm({ ...form, serial_number: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Descripción</Label>
        <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detalle del fallo o requerimiento" />
      </div>
      <Button className="w-full" onClick={handleSubmit} disabled={createTicket.isPending}>
        {createTicket.isPending ? 'Creando...' : 'Crear Solicitud'}
      </Button>
    </div>
  );
}

function TicketDetail({ ticket }: { ticket: Ticket }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">#{ticket.id}</span>
          {ticket.title}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 text-sm">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InfoField label="Cliente" value={ticket.clients?.name || ''} />
          <InfoField label="Empresa" value={ticket.clients?.company || ''} />
          <InfoField label="Teléfono" value={ticket.clients?.phone || ''} />
          <InfoField label="Email" value={ticket.clients?.email || ''} />
          <InfoField label="Tipo Servicio" value={serviceTypeLabels[ticket.service_type]} />
          <InfoField label="Técnico" value={ticket.assigned_tech} />
          <InfoField label="Equipo" value={ticket.equipment_model} />
          <InfoField label="Nº Serie" value={ticket.serial_number} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Descripción</p>
          <p className="text-foreground">{ticket.description}</p>
        </div>
        {ticket.resolution_notes && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Notas de Resolución</p>
            <p className="text-foreground">{ticket.resolution_notes}</p>
          </div>
        )}
        {ticket.ticket_parts.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Repuestos Usados</p>
            <ul className="list-disc list-inside text-foreground">
              {ticket.ticket_parts.map((p, i) => <li key={i}>{p.part_name}</li>)}
            </ul>
          </div>
        )}
        {ticket.scheduled_date && (
          <div className="flex gap-3">
            <InfoField label="Fecha Agendada" value={ticket.scheduled_date} />
            <InfoField label="Hora" value={ticket.scheduled_time || '-'} />
          </div>
        )}
        {ticket.resolution_time_hours != null && (
          <InfoField label="Tiempo Resolución" value={`${ticket.resolution_time_hours} hrs`} />
        )}
      </div>
    </>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
