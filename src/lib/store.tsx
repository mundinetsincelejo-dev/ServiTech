import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ServiceType } from '@/lib/mock-data';

/* ── Types ── */
export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: ServiceType[];
  active: boolean;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  client_id: string;
  service_type: ServiceType;
  priority: 'baja' | 'media' | 'alta' | 'critica';
  status: 'abierto' | 'en_proceso' | 'pausado' | 'cerrado';
  assigned_tech_id: string;
  equipment_model: string;
  serial_number: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  resolution_notes: string | null;
  resolution_time_hours: number | null;
  created_at: string;
}

/* ── Seed data ── */
const seedClients: Client[] = [
  { id: 'c1', name: 'Carlos Méndez', company: 'Grupo Industrial MX', email: 'carlos@gimx.com', phone: '+52 55 1234 5678', address: 'Av. Reforma 100, CDMX' },
  { id: 'c2', name: 'Ana Rodríguez', company: 'TechSolutions SA', email: 'ana@techsol.com', phone: '+52 33 8765 4321', address: 'Calle Hidalgo 50, Guadalajara' },
  { id: 'c3', name: 'Roberto Díaz', company: 'Oficinas del Norte', email: 'roberto@ofnorte.com', phone: '+52 81 5555 1234', address: 'Blvd. Constitución 200, Monterrey' },
  { id: 'c4', name: 'María López', company: 'Hospital Central', email: 'maria@hcentral.com', phone: '+52 55 9876 5432', address: 'Av. Salud 300, CDMX' },
  { id: 'c5', name: 'Luis Torres', company: 'Escuela Moderna', email: 'luis@emoderna.edu', phone: '+52 222 111 2233', address: 'Calle Educación 15, Puebla' },
];

const seedTechnicians: Technician[] = [
  { id: 't1', name: 'Juan Pérez', email: 'juan@servitech.com', phone: '+52 55 1111 2222', specialties: ['impresoras', 'computadores'], active: true },
  { id: 't2', name: 'Pedro Gómez', email: 'pedro@servitech.com', phone: '+52 55 3333 4444', specialties: ['redes_telecom', 'camaras_seguridad'], active: true },
  { id: 't3', name: 'Laura Sánchez', email: 'laura@servitech.com', phone: '+52 55 5555 6666', specialties: ['desarrollo_software', 'soporte_general'], active: true },
  { id: 't4', name: 'Miguel Ángel Ruiz', email: 'miguel@servitech.com', phone: '+52 55 7777 8888', specialties: ['impresoras', 'soporte_general'], active: true },
  { id: 't5', name: 'Sofía Hernández', email: 'sofia@servitech.com', phone: '+52 55 9999 0000', specialties: ['redes_telecom', 'computadores', 'camaras_seguridad'], active: true },
];

const seedTickets: Ticket[] = [
  { id: 1001, title: 'Impresora no enciende', description: 'La impresora HP LaserJet del piso 3 no enciende después de un corte de luz.', client_id: 'c1', service_type: 'impresoras', priority: 'alta', status: 'abierto', assigned_tech_id: 't1', equipment_model: 'HP LaserJet Pro M404', serial_number: 'SN-HP-2024-001', scheduled_date: '2026-04-18', scheduled_time: '09:00', resolution_notes: null, resolution_time_hours: null, created_at: '2026-04-15T10:00:00Z' },
  { id: 1002, title: 'Red WiFi intermitente', description: 'La red WiFi de la oficina principal se desconecta cada 30 minutos.', client_id: 'c2', service_type: 'redes_telecom', priority: 'critica', status: 'en_proceso', assigned_tech_id: 't2', equipment_model: 'Cisco Meraki MR46', serial_number: 'SN-CISCO-2024-015', scheduled_date: '2026-04-17', scheduled_time: '14:00', resolution_notes: null, resolution_time_hours: null, created_at: '2026-04-14T08:30:00Z' },
  { id: 1003, title: 'PC lenta en contabilidad', description: 'La computadora del departamento de contabilidad tarda 10 minutos en arrancar.', client_id: 'c3', service_type: 'computadores', priority: 'media', status: 'abierto', assigned_tech_id: 't1', equipment_model: 'Dell OptiPlex 7090', serial_number: 'SN-DELL-2023-088', scheduled_date: null, scheduled_time: null, resolution_notes: null, resolution_time_hours: null, created_at: '2026-04-16T09:00:00Z' },
  { id: 1004, title: 'Cámara pasillo sur sin imagen', description: 'La cámara del pasillo sur muestra pantalla negra en el monitor de seguridad.', client_id: 'c4', service_type: 'camaras_seguridad', priority: 'alta', status: 'en_proceso', assigned_tech_id: 't5', equipment_model: 'Hikvision DS-2CD2143', serial_number: 'SN-HIK-2024-022', scheduled_date: '2026-04-17', scheduled_time: '10:00', resolution_notes: null, resolution_time_hours: null, created_at: '2026-04-15T14:00:00Z' },
  { id: 1005, title: 'Desarrollo módulo inventario', description: 'Desarrollar módulo de inventario para el sistema interno del cliente.', client_id: 'c2', service_type: 'desarrollo_software', priority: 'media', status: 'pausado', assigned_tech_id: 't3', equipment_model: '-', serial_number: '-', scheduled_date: '2026-04-20', scheduled_time: '09:00', resolution_notes: null, resolution_time_hours: null, created_at: '2026-04-10T11:00:00Z' },
  { id: 1006, title: 'Impresora atascada recurrente', description: 'La impresora Epson se atasca cada 20 hojas. Ya se limpió el rodillo sin éxito.', client_id: 'c5', service_type: 'impresoras', priority: 'baja', status: 'cerrado', assigned_tech_id: 't4', equipment_model: 'Epson EcoTank L3250', serial_number: 'SN-EPS-2023-045', scheduled_date: '2026-04-12', scheduled_time: '11:00', resolution_notes: 'Se reemplazó rodillo de alimentación. Funciona correctamente.', resolution_time_hours: 2, created_at: '2026-04-11T16:00:00Z' },
  { id: 1007, title: 'Configurar VPN oficina', description: 'Configurar acceso VPN para trabajo remoto de 15 empleados.', client_id: 'c3', service_type: 'redes_telecom', priority: 'media', status: 'abierto', assigned_tech_id: 't2', equipment_model: 'FortiGate 60F', serial_number: 'SN-FG-2024-003', scheduled_date: null, scheduled_time: null, resolution_notes: null, resolution_time_hours: null, created_at: '2026-04-16T12:00:00Z' },
  { id: 1008, title: 'Soporte general aula virtual', description: 'Asistencia para configuración de proyector y audio en aula virtual.', client_id: 'c5', service_type: 'soporte_general', priority: 'baja', status: 'abierto', assigned_tech_id: 't3', equipment_model: 'Epson EB-X51', serial_number: 'SN-EPJ-2024-007', scheduled_date: '2026-04-19', scheduled_time: '08:00', resolution_notes: null, resolution_time_hours: null, created_at: '2026-04-16T15:00:00Z' },
];

/* ── Context ── */
interface StoreState {
  clients: Client[];
  technicians: Technician[];
  tickets: Ticket[];
  addClient: (c: Omit<Client, 'id'>) => void;
  updateClient: (id: string, c: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addTechnician: (t: Omit<Technician, 'id'>) => void;
  updateTechnician: (id: string, t: Partial<Technician>) => void;
  deleteTechnician: (id: string) => void;
  addTicket: (t: Omit<Ticket, 'id' | 'created_at'>) => void;
  updateTicket: (id: number, t: Partial<Ticket>) => void;
  deleteTicket: (id: number) => void;
  getTechniciansBySpecialty: (st: ServiceType) => Technician[];
}

const StoreContext = createContext<StoreState | null>(null);

let nextTicketId = 1009;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(seedClients);
  const [technicians, setTechnicians] = useState<Technician[]>(seedTechnicians);
  const [tickets, setTickets] = useState<Ticket[]>(seedTickets);

  const uid = () => crypto.randomUUID();

  const store: StoreState = {
    clients,
    technicians,
    tickets,
    addClient: (c) => setClients((prev) => [...prev, { ...c, id: uid() }]),
    updateClient: (id, c) => setClients((prev) => prev.map((x) => (x.id === id ? { ...x, ...c } : x))),
    deleteClient: (id) => setClients((prev) => prev.filter((x) => x.id !== id)),
    addTechnician: (t) => setTechnicians((prev) => [...prev, { ...t, id: uid() }]),
    updateTechnician: (id, t) => setTechnicians((prev) => prev.map((x) => (x.id === id ? { ...x, ...t } : x))),
    deleteTechnician: (id) => setTechnicians((prev) => prev.filter((x) => x.id !== id)),
    addTicket: (t) => {
      const id = nextTicketId++;
      setTickets((prev) => [{ ...t, id, created_at: new Date().toISOString() }, ...prev]);
    },
    updateTicket: (id, t) => setTickets((prev) => prev.map((x) => (x.id === id ? { ...x, ...t } : x))),
    deleteTicket: (id) => setTickets((prev) => prev.filter((x) => x.id !== id)),
    getTechniciansBySpecialty: (st) => technicians.filter((t) => t.active && t.specialties.includes(st)),
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
