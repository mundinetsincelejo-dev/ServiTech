export type TicketStatus = 'abierto' | 'en_proceso' | 'pausado' | 'cerrado';
export type TicketPriority = 'baja' | 'media' | 'alta' | 'critica';
export type ServiceType = 'preventivo' | 'correctivo' | 'instalacion';

export interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

export interface Ticket {
  id: number;
  clientId: number;
  client: Client;
  serviceType: ServiceType;
  priority: TicketPriority;
  status: TicketStatus;
  title: string;
  description: string;
  equipmentModel: string;
  serialNumber: string;
  assignedTech: string;
  createdAt: string;
  scheduledDate: string | null;
  scheduledTime: string | null;
  closedAt: string | null;
  resolutionNotes: string | null;
  partsUsed: string[];
  resolutionTimeHours: number | null;
}

export const clients: Client[] = [
  { id: 1, name: 'Carlos Mendoza', company: 'Industrias Alfa S.A.', email: 'cmendoza@alfa.com', phone: '+56 9 1234 5678', address: 'Av. Providencia 1234, Santiago' },
  { id: 2, name: 'María González', company: 'Clínica del Sur', email: 'mgonzalez@clinicasur.cl', phone: '+56 9 8765 4321', address: 'Calle O\'Higgins 567, Concepción' },
  { id: 3, name: 'Roberto Fuentes', company: 'Hotel Pacífico', email: 'rfuentes@pacifico.cl', phone: '+56 9 5555 1234', address: 'Costanera 890, Viña del Mar' },
  { id: 4, name: 'Ana Torres', company: 'Supermercados Express', email: 'atorres@express.cl', phone: '+56 9 3333 4444', address: 'Av. Libertador 456, Valparaíso' },
  { id: 5, name: 'Diego Ramírez', company: 'Minera Central Ltda.', email: 'dramirez@minerac.cl', phone: '+56 9 7777 8888', address: 'Ruta 5 Norte Km 120, Antofagasta' },
];

const techs = ['Juan Pérez', 'Andrea Silva', 'Miguel Castillo', 'Camila Rojas'];

export const tickets: Ticket[] = [
  {
    id: 1001, clientId: 1, client: clients[0], serviceType: 'correctivo', priority: 'alta', status: 'abierto',
    title: 'Falla compresor unidad exterior', description: 'El compresor del sistema de aire acondicionado central no enciende. Se escucha un click al intentar arrancar.',
    equipmentModel: 'Daikin VRV IV', serialNumber: 'DK-2024-0891', assignedTech: techs[0],
    createdAt: '2026-04-13T08:30:00', scheduledDate: '2026-04-14', scheduledTime: '09:00',
    closedAt: null, resolutionNotes: null, partsUsed: [], resolutionTimeHours: null,
  },
  {
    id: 1002, clientId: 2, client: clients[1], serviceType: 'preventivo', priority: 'media', status: 'en_proceso',
    title: 'Mantención preventiva trimestral', description: 'Revisión general de equipos de climatización del tercer piso. Incluye limpieza de filtros y revisión de gas.',
    equipmentModel: 'Samsung WindFree', serialNumber: 'SM-2023-4521', assignedTech: techs[1],
    createdAt: '2026-04-12T14:00:00', scheduledDate: '2026-04-13', scheduledTime: '10:00',
    closedAt: null, resolutionNotes: null, partsUsed: [], resolutionTimeHours: null,
  },
  {
    id: 1003, clientId: 3, client: clients[2], serviceType: 'instalacion', priority: 'media', status: 'abierto',
    title: 'Instalación sistema VRF lobby', description: 'Instalación completa de 3 unidades interiores tipo cassette en el lobby principal del hotel.',
    equipmentModel: 'Mitsubishi City Multi', serialNumber: 'MT-2026-0012', assignedTech: techs[2],
    createdAt: '2026-04-11T09:15:00', scheduledDate: '2026-04-15', scheduledTime: '08:00',
    closedAt: null, resolutionNotes: null, partsUsed: [], resolutionTimeHours: null,
  },
  {
    id: 1004, clientId: 1, client: clients[0], serviceType: 'correctivo', priority: 'critica', status: 'en_proceso',
    title: 'Fuga de refrigerante sala servidores', description: 'Se detectó fuga de gas R410A en la unidad que climatiza la sala de servidores. Urgente.',
    equipmentModel: 'Daikin VRV IV', serialNumber: 'DK-2024-0892', assignedTech: techs[0],
    createdAt: '2026-04-13T07:00:00', scheduledDate: '2026-04-13', scheduledTime: '08:00',
    closedAt: null, resolutionNotes: null, partsUsed: [], resolutionTimeHours: null,
  },
  {
    id: 1005, clientId: 4, client: clients[3], serviceType: 'correctivo', priority: 'baja', status: 'cerrado',
    title: 'Ruido en unidad interior', description: 'La unidad interior del área de cajas emite un ruido intermitente. Se reemplazó rodamiento del ventilador.',
    equipmentModel: 'LG Dual Inverter', serialNumber: 'LG-2022-7788', assignedTech: techs[3],
    createdAt: '2026-04-08T11:00:00', scheduledDate: '2026-04-09', scheduledTime: '14:00',
    closedAt: '2026-04-09T16:30:00', resolutionNotes: 'Se reemplazó rodamiento del motor del ventilador. Equipo operativo.', partsUsed: ['Rodamiento 6203-2RS', 'Filtro carbón activado'], resolutionTimeHours: 2.5,
  },
  {
    id: 1006, clientId: 5, client: clients[4], serviceType: 'preventivo', priority: 'media', status: 'cerrado',
    title: 'Mantención anual equipos campamento', description: 'Revisión anual de 8 equipos split en campamento minero.',
    equipmentModel: 'Midea Xtreme Save', serialNumber: 'MD-2023-1100', assignedTech: techs[2],
    createdAt: '2026-04-05T08:00:00', scheduledDate: '2026-04-07', scheduledTime: '07:00',
    closedAt: '2026-04-07T18:00:00', resolutionNotes: 'Todos los equipos revisados. Se reemplazaron filtros en 3 unidades y se recargó gas en 1.', partsUsed: ['Filtro HEPA x3', 'Gas R32 1kg'], resolutionTimeHours: 10,
  },
  {
    id: 1007, clientId: 2, client: clients[1], serviceType: 'correctivo', priority: 'alta', status: 'pausado',
    title: 'Error E4 en unidad piso 5', description: 'La unidad muestra error E4 (falla de sensor de temperatura). Se requiere repuesto importado.',
    equipmentModel: 'Samsung WindFree', serialNumber: 'SM-2023-4522', assignedTech: techs[1],
    createdAt: '2026-04-10T16:00:00', scheduledDate: null, scheduledTime: null,
    closedAt: null, resolutionNotes: 'En espera de sensor NTC importado. ETA: 5 días hábiles.', partsUsed: [], resolutionTimeHours: null,
  },
  {
    id: 1008, clientId: 3, client: clients[2], serviceType: 'correctivo', priority: 'media', status: 'cerrado',
    title: 'Drenaje obstruido habitación 302', description: 'Goteo de agua desde la unidad interior por obstrucción en línea de drenaje.',
    equipmentModel: 'Daikin FTXS', serialNumber: 'DK-2021-3300', assignedTech: techs[3],
    createdAt: '2026-04-06T10:30:00', scheduledDate: '2026-04-06', scheduledTime: '15:00',
    closedAt: '2026-04-06T16:45:00', resolutionNotes: 'Se realizó limpieza de línea de drenaje con bomba de presión. Sin fugas.', partsUsed: ['Manguera drenaje 1m'], resolutionTimeHours: 1.75,
  },
];

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
