// Sistema de Créditos - Escola Inglês Pareto
// Tipos e Interfaces para gerenciamento de créditos

export interface UserCredits {
  userId: string;
  totalCredits: number;
  usedCredits: number;
  availableCredits: number;
  lastUpdated: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'usage' | 'refund' | 'bonus';
  amount: number;
  description: string;
  relatedLessonId?: string;
  timestamp: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  description: string;
  popular?: boolean;
  bonusCredits?: number;
}

export interface CreditUsage {
  lessonType: 'group-beginner' | 'group-intermediate' | 'group-advanced' | 'open-conversation' | 'individual';
  creditCost: 1 | 3;
  description: string;
}

export interface PaymentHistory {
  id: string;
  student_id: string;
  amount: number;
  credits_purchased: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
}

export interface CreditPackageOption {
  credits: number;
  discount: number;
  pricePerCredit: number;
}

// Constantes do sistema de créditos
export const CREDIT_COSTS: Record<string, number> = {
  'group-beginner': 1,
  'group-intermediate': 1,
  'group-advanced': 1,
  'open-conversation': 1,
  'individual': 3
};

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Pacote Iniciante',
    credits: 10,
    price: 99.90,
    currency: 'BRL',
    description: '10 créditos para aulas em grupo',
    bonusCredits: 2
  },
  {
    id: 'standard',
    name: 'Pacote Padrão',
    credits: 25,
    price: 229.90,
    currency: 'BRL',
    description: '25 créditos com 5 bônus',
    popular: true,
    bonusCredits: 5
  },
  {
    id: 'premium',
    name: 'Pacote Premium',
    credits: 50,
    price: 399.90,
    currency: 'BRL',
    description: '50 créditos com 15 bônus',
    bonusCredits: 15
  },
  {
    id: 'individual',
    name: 'Pacote Individual',
    credits: 15,
    price: 449.90,
    currency: 'BRL',
    description: '15 créditos para aulas individuais (5 aulas)',
    bonusCredits: 3
  }
];

// Funções helper
export const calculateCreditsNeeded = (lessonType: string): number => {
  return CREDIT_COSTS[lessonType] || 1;
};

export const canAffordLesson = (availableCredits: number, lessonType: string): boolean => {
  return availableCredits >= calculateCreditsNeeded(lessonType);
};

export const formatCurrency = (amount: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};