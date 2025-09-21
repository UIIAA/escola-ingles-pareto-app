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
  activityId?: string;
  activityType?: string;
  status: 'pending' | 'completed' | 'failed' | 'rolled_back';
  timestamp: string;
  completedAt?: string;
  failedAt?: string;
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
  lessonType: 'group-beginner' | 'group-intermediate' | 'group-advanced' | 'open-conversation' | 'individual' | 'ai-chat-message' | 'learning-unit' | 'quiz-attempt' | 'exercise-completion';
  creditCost: number;
  description: string;
}

export interface CreditVerification {
  sufficient: boolean;
  required: number;
  available: number;
  estimatedUsage?: number;
  activityType: string;
}

export interface PendingTransaction {
  id: string;
  userId: string;
  amount: number;
  activityType: string;
  activityId: string;
  description: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'expired';
}

export interface ActivityCostConfig {
  cost: number;
  allowPartial: boolean;
  requiresConfirmation: boolean;
  category: 'communication' | 'learning' | 'assessment' | 'lesson';
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

// Constantes do sistema de créditos - EXPANDIDO
export const CREDIT_COSTS: Record<string, ActivityCostConfig> = {
  // Aulas (existentes)
  'group-beginner': {
    cost: 1,
    allowPartial: false,
    requiresConfirmation: true,
    category: 'lesson',
    description: 'Aula em grupo - nível iniciante'
  },
  'group-intermediate': {
    cost: 1,
    allowPartial: false,
    requiresConfirmation: true,
    category: 'lesson',
    description: 'Aula em grupo - nível intermediário'
  },
  'group-advanced': {
    cost: 1,
    allowPartial: false,
    requiresConfirmation: true,
    category: 'lesson',
    description: 'Aula em grupo - nível avançado'
  },
  'open-conversation': {
    cost: 1,
    allowPartial: false,
    requiresConfirmation: true,
    category: 'lesson',
    description: 'Conversa aberta com professor'
  },
  'individual': {
    cost: 3,
    allowPartial: false,
    requiresConfirmation: true,
    category: 'lesson',
    description: 'Aula individual personalizada'
  },
  // Novos custos - AI e Comunicação
  'ai-chat-message': {
    cost: 0.1,
    allowPartial: true,
    requiresConfirmation: false,
    category: 'communication',
    description: 'Mensagem no chat com IA'
  },
  // Novos custos - Aprendizado
  'learning-unit': {
    cost: 0.5,
    allowPartial: true,
    requiresConfirmation: false,
    category: 'learning',
    description: 'Unidade de trilha de aprendizado'
  },
  'learning-path-start': {
    cost: 0.3,
    allowPartial: true,
    requiresConfirmation: false,
    category: 'learning',
    description: 'Iniciar nova trilha de aprendizado'
  },
  // Novos custos - Avaliações
  'quiz-attempt': {
    cost: 0.3,
    allowPartial: true,
    requiresConfirmation: false,
    category: 'assessment',
    description: 'Tentativa de quiz ou avaliação'
  },
  'exercise-completion': {
    cost: 0.2,
    allowPartial: true,
    requiresConfirmation: false,
    category: 'assessment',
    description: 'Completar exercício prático'
  },
  'pronunciation-check': {
    cost: 0.15,
    allowPartial: true,
    requiresConfirmation: false,
    category: 'assessment',
    description: 'Verificação de pronúncia'
  }
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

// Funções helper expandidas
export const calculateCreditsNeeded = (activityType: string): number => {
  const config = CREDIT_COSTS[activityType];
  return config ? config.cost : 1;
};

export const getActivityConfig = (activityType: string): ActivityCostConfig | null => {
  return CREDIT_COSTS[activityType] || null;
};

export const canAffordActivity = (availableCredits: number, activityType: string): boolean => {
  const cost = calculateCreditsNeeded(activityType);
  return availableCredits >= cost;
};

export const validateCreditVerification = (verification: CreditVerification): boolean => {
  return verification.sufficient && verification.required > 0 && verification.available >= verification.required;
};

export const generateTransactionId = (): string => {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateActivityId = (activityType: string): string => {
  return `${activityType}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
};

export const formatCurrency = (amount: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};