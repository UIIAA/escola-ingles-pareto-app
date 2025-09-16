// Configurações de pacotes de créditos
export const CREDIT_PACKAGES: { credits: number; discount: number }[] = [
  { credits: 4, discount: 0 },
  { credits: 8, discount: 0 },
  { credits: 12, discount: 5 },
  { credits: 16, discount: 5 },
  { credits: 20, discount: 5 },
  { credits: 24, discount: 10 },
  { credits: 28, discount: 10 },
  { credits: 32, discount: 10 },
  { credits: 36, discount: 15 },
  { credits: 40, discount: 15 },
  { credits: 44, discount: 15 },
  { credits: 48, discount: 15 },
  { credits: 52, discount: 20 },
];

// Configurações de duração de aulas
export const LESSON_DURATIONS = [
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '60 minutos' },
];

// Limiar para alerta de créditos baixos
export const LOW_CREDIT_THRESHOLD = 2;

// Status de agendamento
export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

// Status de slots de aula
export const SLOT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;