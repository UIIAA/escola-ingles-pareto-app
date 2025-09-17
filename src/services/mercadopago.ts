import { MercadoPagoConfig, Preference } from 'mercadopago';
import type { PaymentPreference, PaymentItem, CreditPackage } from '@/types/payments';

// Configuração do Mercado Pago
const mercadoPagoConfig = new MercadoPagoConfig({
  accessToken: import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN || 'TEST-ACCESS-TOKEN',
  options: {
    timeout: 5000,
    idempotencyKey: 'abc123'
  }
});

export class MercadoPagoService {
  private preference: Preference;

  constructor() {
    this.preference = new Preference(mercadoPagoConfig);
  }

  /**
   * Cria uma preferência de pagamento para um pacote de créditos
   */
  async createPaymentPreference(
    creditPackage: CreditPackage,
    userEmail: string,
    userName: string,
    paymentMethod?: 'pix' | 'boleto' | 'cartao'
  ): Promise<{ id: string; init_point: string; sandbox_init_point: string }> {
    try {
      const items: PaymentItem[] = [
        {
          id: creditPackage.id,
          title: creditPackage.name,
          description: `${creditPackage.credits} créditos para aulas de inglês`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: creditPackage.price
        }
      ];

      const preference: PaymentPreference = {
        id: `preference-${Date.now()}`,
        items,
        payer: {
          name: userName.split(' ')[0],
          surname: userName.split(' ').slice(1).join(' ') || 'Estudante',
          email: userEmail
        },
        back_urls: {
          success: `${window.location.origin}/payment/success`,
          failure: `${window.location.origin}/payment/failure`,
          pending: `${window.location.origin}/payment/pending`
        },
        auto_return: 'approved',
        external_reference: `credit-package-${creditPackage.id}-${Date.now()}`,
        statement_descriptor: 'ESCOLA INGLES PARETO',
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      };

      // Configurações específicas por método de pagamento
      const preferenceConfig: any = {
        body: preference
      };

      if (paymentMethod === 'pix') {
        preferenceConfig.body.payment_methods = {
          excluded_payment_types: [
            { id: 'credit_card' },
            { id: 'debit_card' },
            { id: 'ticket' }
          ],
          installments: 1
        };
      } else if (paymentMethod === 'boleto') {
        preferenceConfig.body.payment_methods = {
          excluded_payment_types: [
            { id: 'credit_card' },
            { id: 'debit_card' }
          ],
          excluded_payment_methods: [
            { id: 'pix' }
          ]
        };
      } else if (paymentMethod === 'cartao') {
        preferenceConfig.body.payment_methods = {
          excluded_payment_types: [
            { id: 'ticket' }
          ],
          excluded_payment_methods: [
            { id: 'pix' }
          ],
          installments: 12
        };
      }

      const response = await this.preference.create(preferenceConfig);

      return {
        id: response.id!,
        init_point: response.init_point!,
        sandbox_init_point: response.sandbox_init_point!
      };
    } catch (error) {
      console.error('Erro ao criar preferência de pagamento:', error);
      throw new Error('Não foi possível criar a preferência de pagamento');
    }
  }

  /**
   * Busca informações de um pagamento pelo ID
   */
  async getPaymentInfo(paymentId: string) {
    try {
      // Em um ambiente real, usaríamos a SDK para buscar informações do pagamento
      // Por enquanto, retornamos dados simulados
      return {
        id: paymentId,
        status: 'approved',
        status_detail: 'accredited',
        transaction_amount: 420,
        currency_id: 'BRL',
        date_created: new Date().toISOString(),
        date_approved: new Date().toISOString(),
        external_reference: `credit-package-padrao-${Date.now()}`
      };
    } catch (error) {
      console.error('Erro ao buscar informações do pagamento:', error);
      throw new Error('Não foi possível buscar informações do pagamento');
    }
  }

  /**
   * Calcula desconto por método de pagamento
   */
  calculateDiscount(price: number, paymentMethod: 'pix' | 'boleto' | 'cartao'): number {
    switch (paymentMethod) {
      case 'pix':
        return price * 0.05; // 5% de desconto no PIX
      case 'boleto':
      case 'cartao':
      default:
        return 0;
    }
  }

  /**
   * Calcula o preço final com desconto
   */
  calculateFinalPrice(price: number, paymentMethod: 'pix' | 'boleto' | 'cartao'): number {
    const discount = this.calculateDiscount(price, paymentMethod);
    return price - discount;
  }

  /**
   * Valida webhook do Mercado Pago
   */
  validateWebhook(webhookData: any): boolean {
    // Em produção, implementar validação de assinatura
    return webhookData && webhookData.type && webhookData.data;
  }

  /**
   * Processa webhook de pagamento
   */
  async processPaymentWebhook(webhookData: any) {
    try {
      if (!this.validateWebhook(webhookData)) {
        throw new Error('Webhook inválido');
      }

      const paymentId = webhookData.data.id;
      const paymentInfo = await this.getPaymentInfo(paymentId);

      // Aqui você processaria o pagamento conforme o status
      if (paymentInfo.status === 'approved') {
        return {
          success: true,
          action: 'credit_user_account',
          payment: paymentInfo
        };
      }

      return {
        success: true,
        action: 'update_payment_status',
        payment: paymentInfo
      };
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return {
        success: false,
        error: 'Erro ao processar webhook'
      };
    }
  }
}

// Instância singleton do serviço
export const mercadoPagoService = new MercadoPagoService();