// Serviço de pagamento - inicialmente com suporte a BR Pay e fallback para outros métodos
import { CREDIT_PACKAGES } from '@/lib/constants';

export interface PaymentData {
  amount: number;
  credits: number;
  studentId: string;
  paymentMethod: 'brpay' | 'stripe' | 'pagseguro';
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  redirectUrl?: string;
  errorMessage?: string;
}

export class PaymentService {
  private brPayApiKey: string;
  private isBrPayConfigured: boolean;

  constructor() {
    this.brPayApiKey = import.meta.env.VITE_BRPAY_API_KEY || '';
    this.isBrPayConfigured = !!this.brPayApiKey;
  }

  // Processa um pagamento
  async processPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      console.log('Processando pagamento:', paymentData);
      
      // Lógica de processamento de pagamento
      // Em uma implementação real, aqui faríamos a chamada à API do BR Pay ou outro gateway
      
      // Simulando sucesso no pagamento
      return {
        success: true,
        paymentId: 'payment_' + Date.now().toString(),
        redirectUrl: '/payment/success'
      };
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      return {
        success: false,
        errorMessage: 'Erro ao processar pagamento'
      };
    }
  }

  // Verifica o status de um pagamento
  async checkPaymentStatus(paymentId: string): Promise<'pending' | 'completed' | 'failed' | 'refunded'> {
    try {
      console.log('Verificando status do pagamento:', paymentId);
      // Simulando status
      return 'completed';
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      return 'failed';
    }
  }

  // Calcula o valor com desconto
  calculateAmount(credits: number): { amount: number; discount: number } {
    // Esta função usa as constantes definidas em lib/constants.ts
    const packageOption = CREDIT_PACKAGES.find(p => p.credits === credits);
    
    if (!packageOption) {
      // Se não encontrar o pacote, retorna sem desconto
      return { amount: credits * 50, discount: 0 }; // R$50 por crédito como valor padrão
    }
    
    const baseAmount = credits * 50; // R$50 por crédito como valor padrão
    const discountAmount = baseAmount * (packageOption.discount / 100);
    const finalAmount = baseAmount - discountAmount;
    
    return {
      amount: finalAmount,
      discount: packageOption.discount
    };
  }
}

// Instância singleton do serviço
export const paymentService = new PaymentService();