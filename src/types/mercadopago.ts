// MercadoPago API types and interfaces

export interface PaymentData {
  id: string;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled';
  status_detail?: string;
  transaction_amount: number;
  currency_id: string;
  payment_method: string;
  date_created: string;
  date_approved?: string;
  external_reference?: string;
  credits_purchased?: number;
  package_name?: string;
}

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
  }>;
  payer: {
    name: string;
    email: string;
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: 'approved' | 'all';
  external_reference: string;
  payment_methods: {
    excluded_payment_methods: Array<{ id: string }>;
    excluded_payment_types: Array<{ id: string }>;
    installments: number;
  };
}

export interface MercadoPagoWebhookNotification {
  id: number;
  live_mode: boolean;
  type: string;
  date_created: string;
  application_id: number;
  user_id: string;
  version: number;
  api_version: string;
  action: string;
  data: {
    id: string;
  };
}

export interface MercadoPagoPaymentResponse {
  id: number;
  date_created: string;
  date_approved?: string;
  date_last_updated: string;
  money_release_date?: string;
  operation_type: string;
  issuer_id: string;
  payment_method_id: string;
  payment_type_id: string;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled';
  status_detail: string;
  currency_id: string;
  description: string;
  live_mode: boolean;
  sponsor_id?: number;
  authorization_code?: string;
  money_release_schema?: string;
  taxes_amount: number;
  counter_currency?: string;
  brand_id?: string;
  shipping_amount: number;
  transaction_amount: number;
  transaction_amount_refunded: number;
  coupon_amount: number;
  differential_pricing_id?: number;
  deduction_schema?: string;
  transaction_details: {
    payment_method_reference_id?: string;
    net_received_amount: number;
    total_paid_amount: number;
    overpaid_amount: number;
    external_resource_url?: string;
    installment_amount: number;
    financial_institution?: string;
    payable_deferral_period?: string;
    acquirer_reference?: string;
  };
  fee_details: Array<{
    type: string;
    amount: number;
    fee_payer: string;
  }>;
  charges_details: Array<{
    id: string;
    name: string;
    type: string;
    accounts: {
      from: string;
      to: string;
    };
    client_id: number;
    date_created: string;
    last_updated: string;
  }>;
  captured: boolean;
  binary_mode: boolean;
  call_for_authorize_id?: string;
  statement_descriptor?: string;
  installments: number;
  card: {
    id?: string;
    first_six_digits?: string;
    last_four_digits?: string;
    expiration_month?: number;
    expiration_year?: number;
    date_created?: string;
    date_last_updated?: string;
    cardholder: {
      name?: string;
      identification?: {
        number?: string;
        type?: string;
      };
    };
  };
  notification_url?: string;
  refunds: Array<unknown>;
  processing_mode: string;
  merchant_account_id?: string;
  merchant_number?: string;
  acquirer_reconciliation: Array<unknown>;
  point_of_interaction: {
    type: string;
  };
  external_reference?: string;
}