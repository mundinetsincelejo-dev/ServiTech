import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { tickets, clients, serviceTypeLabels, statusLabels, priorityLabels, type Ticket } from '@/lib/mock-data';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { Search, Clock, Wrench } from 'lucide-react';

export const Route = createFileRoute('/historial')({
  component: HistorialPage,
  head: () => ({
    meta: [
      { title: 'Historial — ServiTech' },
      { name: 'description', content: 'Historial y trazabilidad de intervenciones técnicas' },
    ],
  }),
});

function HistorialPage() {
  const [search, setSearch] = useState('');

  const matchingClients = search.length > 1
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.company.toLowerCase().includes(search.toLowerCase())
      )
    : clients;

  const matchingTickets = search.length > 1
    ? tickets.filter(
        (t) =>
          t.client.name.toLowerCase().includes(search.toLowerCase()) ||
          t.client.company.toLowerCase().includes(search.toLowerCase()) ||
          t.equipmentModel.toLowerCase().includes(search.toLowerCase()) ||
          t.serialNumber.toLowerCase().includes(search.toLowerCase())
      )
    : tickets;

  // Group by client
  const grouped = matchingClients.reduce<Record<number, { client: typeof clients[0]; tickets: Ticket[] }>>(
    (acc, client) => {
      const clientTickets = matchingTickets.filter((t) => t.clientId === client.id);
      if (clientTickets.length > 0) {
        acc[client.id] = { client, tickets: clientTickets.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) };
      }
      return acc;
    },
    {}
  );

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, equipo o Nº serie..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {Object.values(grouped).length === 0 && (
          <p className="text-center text-muted-foreground py-12">No se encontraron resultados</p>
        )}

        {Object.values(grouped).map(({ client, tickets: clientTickets }) => (
          <Card key={client.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div>
                  <span className="text-base">{client.company}</span>
                  <span className="ml-2 text-sm font-normal text-muted-foreground">— {client.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{clientTickets.length} intervenciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {clientTickets.map((t) => (
                <div
                  key={t.id}
                  className="rounded-lg border bg-muted/30 p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{t.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t.equipmentModel} · {t.serialNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <StatusBadge status={t.status} />
                      <PriorityBadge priority={t.priority} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(t.createdAt).toLocaleDateString('es-CL')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wrench className="h-3 w-3" />
                      {t.assignedTech}
                    </span>
                    {t.resolutionTimeHours != null && (
                      <span>Resolución: {t.resolutionTimeHours} hrs</span>
                    )}
                  </div>
                  {t.partsUsed.length > 0 && (
                    <div className="text-xs">
                      <span className="font-medium">Repuestos: </span>
                      {t.partsUsed.join(', ')}
                    </div>
                  )}
                  {t.resolutionNotes && (
                    <div className="text-xs rounded bg-success/10 p-2 text-success">
                      {t.resolutionNotes}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
