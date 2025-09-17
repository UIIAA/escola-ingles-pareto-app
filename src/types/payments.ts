export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  credits_purchased: number;
  package_type: 'iniciante' | 'padrao' | 'premium' | 'individual';
  payment_method: 'pix' | 'boleto' | 'cartao';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded';
  external_reference?: string;
  mercadopago_payment_id?: string;
  mercadopago_preference_id?: string;
  payment_date?: string;
  expiration_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentPreference {
  id: string;
  items: PaymentItem[];
  payer?: PaymentPayer;
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: 'approved' | 'all';
  external_reference?: string;
  statement_descriptor?: string;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
}

export interface PaymentItem {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
}

export interface PaymentPayer {
  name?: string;
  surname?: string;
  email?: string;
  phone?: {
    area_code?: string;
    number?: string;
  };
  identification?: {
    type?: string;
    number?: string;
  };
  address?: {
    street_name?: string;
    street_number?: number;
    zip_code?: string;
  };
}

export interface CreditPackage {
  id: string;
  name: string;
  description: string;
  credits: number;
  price: number;
  discount: number;
  popular: boolean;
  features: string[];
  duration_months: number;
}

export interface PaymentWebhook {
  id: string;
  live_mode: boolean;
  type: string;
  date_created: string;
  application_id: string;
  user_id: string;
  version: string;
  api_version: string;
  action: string;
  data: {
    id: string;
  };
}

export interface PaymentStatus {
  id: string;
  status: 'pending' | 'approved' | 'authorized' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back';
  status_detail: string;
  operation_type: string;
  payment_method_id: string;
  payment_type_id: string;
  transaction_amount: number;
  currency_id: string;
  date_created: string;
  date_approved?: string;
  external_reference?: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'iniciante',
    name: 'Pacote Iniciante',
    description: 'Perfeito para começar sua jornada',
    credits: 12,
    price: 180,
    discount: 0,
    popular: false,
    features: [
      '12 créditos para aulas',
      '12 aulas em grupo OU 4 individuais',
      'Acesso ao AI Chat',
      'Fórum da comunidade',
      'Materiais didáticos'
    ],
    duration_months: 6
  },
  {
    id: 'padrao',
    name: 'Pacote Padrão',
    description: 'Nosso pacote mais popular',
    credits: 30,
    price: 420,
    discount: 15,
    popular: true,
    features: [
      '30 créditos para aulas',
      '30 aulas em grupo OU 10 individuais',
      'Acesso ao AI Chat',
      'Fórum da comunidade',
      'Materiais didáticos',
      'Suporte prioritário'
    ],
    duration_months: 12
  },
  {
    id: 'premium',
    name: 'Pacote Premium',
    description: 'Para estudantes dedicados',
    credits: 65,
    price: 780,
    discount: 25,
    popular: false,
    features: [
      '65 créditos para aulas',
      '65 aulas em grupo OU 21 individuais',
      'Acesso ao AI Chat',
      'Fórum da comunidade',
      'Materiais didáticos',
      'Suporte prioritário',
      'Sessões de conversação extras',
      'Relatórios de progresso detalhados'
    ],
    duration_months: 18
  },
  {
    id: 'individual',
    name: 'Focado Individual',
    description: 'Apenas aulas individuais',
    credits: 18,
    price: 540,
    discount: 10,
    popular: false,
    features: [
      '18 créditos para aulas',
      '6 aulas individuais',
      'Acesso ao AI Chat',
      'Fórum da comunidade',
      'Materiais didáticos',
      'Plano de estudos personalizado'
    ],
    duration_months: 6
  }
];

export const PAYMENT_METHODS = [
  {
    id: 'pix',
    name: 'PIX',
    description: 'Pagamento instantâneo',
    icon: '💰',
    discount: 5,
    processing_time: 'Imediato'
  },
  {
    id: 'boleto',
    name: 'Boleto Bancário',
    description: 'Até 3 dias úteis',
    icon: '🧾',
    discount: 0,
    processing_time: 'Até 3 dias úteis'
  },
  {
    id: 'cartao',
    name: 'Cartão de Crédito',
    description: 'Parcelamento disponível',
    icon: '💳',
    discount: 0,
    processing_time: 'Imediato'
  }
] as const;