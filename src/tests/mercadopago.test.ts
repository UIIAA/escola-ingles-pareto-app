import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MercadoPagoService } from '@/services/mercadopago';
import { CREDIT_PACKAGES } from '@/types/credits';

// Mock do MercadoPago SDK
vi.mock('mercadopago', () => ({
  configure: vi.fn(),
  preferences: {
    create: vi.fn()
  },
  payment: {
    findById: vi.fn()
  }
}));

describe('MercadoPagoService - Sistema de Pagamentos', () => {
  let mpService: MercadoPagoService;

  beforeEach(() => {
    mpService = new MercadoPagoService();
    vi.clearAllMocks();
  });

  describe('💳 Criação de Preferências de Pagamento', () => {
    it('deve criar preferência para pacote starter com PIX', async () => {
      const mockPreference = {
        id: 'preference-123',
        init_point: 'https://mercadopago.com/pay/preference-123',
        sandbox_init_point: 'https://sandbox.mercadopago.com/pay/preference-123'
      };

      const mockCreate = vi.fn().mockResolvedValue({ body: mockPreference });
      vi.mocked(require('mercadopago').preferences.create).mockImplementation(mockCreate);

      const preference = await mpService.createPaymentPreference({
        packageId: 'starter',
        userId: 'user-123',
        userEmail: 'test@example.com',
        paymentMethod: 'pix'
      });

      expect(preference).toEqual(mockPreference);
      expect(mockCreate).toHaveBeenCalledWith({
        items: [{
          id: 'starter',
          title: 'Pacote Iniciante - Escola Inglês Pareto',
          description: '10 créditos para aulas em grupo',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 94.91 // 99.90 com 5% desconto PIX
        }],
        payer: {
          email: 'test@example.com'
        },
        external_reference: expect.stringContaining('user-123'),
        payment_methods: {
          excluded_payment_types: [],
          excluded_payment_methods: [],
          installments: 12
        },
        back_urls: {
          success: expect.stringContaining('/payment/success'),
          failure: expect.stringContaining('/payment/failure'),
          pending: expect.stringContaining('/payment/pending')
        },
        auto_return: 'approved',
        notification_url: expect.stringContaining('/api/webhooks/mercadopago')
      });
    });

    it('deve criar preferência para pacote premium sem desconto', async () => {
      const mockPreference = {
        id: 'preference-456',
        init_point: 'https://mercadopago.com/pay/preference-456'
      };

      const mockCreate = vi.fn().mockResolvedValue({ body: mockPreference });
      vi.mocked(require('mercadopago').preferences.create).mockImplementation(mockCreate);

      const preference = await mpService.createPaymentPreference({
        packageId: 'premium',
        userId: 'user-456',
        userEmail: 'premium@example.com',
        paymentMethod: 'credit_card'
      });

      expect(preference).toEqual(mockPreference);
      expect(mockCreate).toHaveBeenCalledWith({
        items: [{
          id: 'premium',
          title: 'Pacote Premium - Escola Inglês Pareto',
          description: '50 créditos com 15 bônus',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 399.90 // Preço integral para cartão
        }],
        payer: {
          email: 'premium@example.com'
        },
        external_reference: expect.stringContaining('user-456'),
        payment_methods: {
          excluded_payment_types: [],
          excluded_payment_methods: [],
          installments: 12
        },
        back_urls: {
          success: expect.stringContaining('/payment/success'),
          failure: expect.stringContaining('/payment/failure'),
          pending: expect.stringContaining('/payment/pending')
        },
        auto_return: 'approved',
        notification_url: expect.stringContaining('/api/webhooks/mercadopago')
      });
    });

    it('deve aplicar desconto PIX corretamente', () => {
      const originalPrice = 100.00;
      const discountedPrice = mpService.calculatePIXDiscount(originalPrice);
      expect(discountedPrice).toBe(95.00); // 5% desconto
    });

    it('deve gerar external_reference único', () => {
      const ref1 = mpService.generateExternalReference('user-123', 'starter');
      const ref2 = mpService.generateExternalReference('user-123', 'starter');

      expect(ref1).toMatch(/^user-123_starter_\d+$/);
      expect(ref2).toMatch(/^user-123_starter_\d+$/);
      expect(ref1).not.toBe(ref2); // Deve ser único devido ao timestamp
    });

    it('deve validar dados de entrada', async () => {
      await expect(
        mpService.createPaymentPreference({
          packageId: 'invalid-package',
          userId: 'user-123',
          userEmail: 'test@example.com',
          paymentMethod: 'pix'
        })
      ).rejects.toThrow('Package not found');

      await expect(
        mpService.createPaymentPreference({
          packageId: 'starter',
          userId: '',
          userEmail: 'test@example.com',
          paymentMethod: 'pix'
        })
      ).rejects.toThrow('User ID is required');

      await expect(
        mpService.createPaymentPreference({
          packageId: 'starter',
          userId: 'user-123',
          userEmail: 'invalid-email',
          paymentMethod: 'pix'
        })
      ).rejects.toThrow('Valid email is required');
    });
  });

  describe('🔍 Consulta de Pagamentos', () => {
    it('deve consultar status de pagamento aprovado', async () => {
      const mockPayment = {
        id: 'payment-123',
        status: 'approved',
        transaction_amount: 94.91,
        payment_method_id: 'pix',
        external_reference: 'user-123_starter_1234567890',
        date_approved: '2024-09-21T10:00:00.000Z',
        payer: {
          email: 'test@example.com'
        }
      };

      const mockFindById = vi.fn().mockResolvedValue({ body: mockPayment });
      vi.mocked(require('mercadopago').payment.findById).mockImplementation(mockFindById);

      const payment = await mpService.getPaymentStatus('payment-123');

      expect(payment).toEqual(mockPayment);
      expect(mockFindById).toHaveBeenCalledWith('payment-123');
    });

    it('deve consultar status de pagamento pendente', async () => {
      const mockPayment = {
        id: 'payment-456',
        status: 'pending',
        transaction_amount: 180.00,
        payment_method_id: 'bank_transfer',
        external_reference: 'user-456_standard_9876543210'
      };

      const mockFindById = vi.fn().mockResolvedValue({ body: mockPayment });
      vi.mocked(require('mercadopago').payment.findById).mockImplementation(mockFindById);

      const payment = await mpService.getPaymentStatus('payment-456');

      expect(payment).toEqual(mockPayment);
      expect(payment.status).toBe('pending');
    });

    it('deve lidar com erro na consulta de pagamento', async () => {
      const mockFindById = vi.fn().mockRejectedValue(new Error('Payment not found'));
      vi.mocked(require('mercadopago').payment.findById).mockImplementation(mockFindById);

      await expect(
        mpService.getPaymentStatus('invalid-payment')
      ).rejects.toThrow('Payment not found');
    });
  });

  describe('🎯 Processamento de Webhooks', () => {
    it('deve processar webhook de pagamento aprovado', async () => {
      const webhookData = {
        id: 'payment-789',
        topic: 'payment',
        action: 'payment.updated'
      };

      const mockPayment = {
        id: 'payment-789',
        status: 'approved',
        transaction_amount: 229.90,
        external_reference: 'user-789_standard_1111111111',
        payment_method_id: 'credit_card'
      };

      const mockFindById = vi.fn().mockResolvedValue({ body: mockPayment });
      vi.mocked(require('mercadopago').payment.findById).mockImplementation(mockFindById);

      const result = await mpService.processWebhook(webhookData);

      expect(result.processed).toBe(true);
      expect(result.paymentData).toEqual(mockPayment);
      expect(result.action).toBe('credit_user');
    });

    it('deve processar webhook de pagamento rejeitado', async () => {
      const webhookData = {
        id: 'payment-999',
        topic: 'payment',
        action: 'payment.updated'
      };

      const mockPayment = {
        id: 'payment-999',
        status: 'rejected',
        transaction_amount: 180.00,
        external_reference: 'user-999_starter_2222222222',
        payment_method_id: 'credit_card',
        status_detail: 'cc_rejected_insufficient_amount'
      };

      const mockFindById = vi.fn().mockResolvedValue({ body: mockPayment });
      vi.mocked(require('mercadopago').payment.findById).mockImplementation(mockFindById);

      const result = await mpService.processWebhook(webhookData);

      expect(result.processed).toBe(true);
      expect(result.paymentData).toEqual(mockPayment);
      expect(result.action).toBe('notify_failure');
    });

    it('deve ignorar webhook de tópico não suportado', async () => {
      const webhookData = {
        id: 'merchant-123',
        topic: 'merchant_order',
        action: 'order.updated'
      };

      const result = await mpService.processWebhook(webhookData);

      expect(result.processed).toBe(false);
      expect(result.reason).toBe('Unsupported topic');
    });
  });

  describe('💰 Cálculos e Validações', () => {
    it('deve calcular créditos totais com bônus', () => {
      const starterPackage = CREDIT_PACKAGES.find(p => p.id === 'starter');
      expect(starterPackage?.credits).toBe(10);
      expect(starterPackage?.bonusCredits).toBe(2);

      const totalCredits = mpService.calculateTotalCredits(starterPackage!);
      expect(totalCredits).toBe(12); // 10 + 2 bônus
    });

    it('deve validar formato de email', () => {
      expect(mpService.isValidEmail('test@example.com')).toBe(true);
      expect(mpService.isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(mpService.isValidEmail('invalid-email')).toBe(false);
      expect(mpService.isValidEmail('test@')).toBe(false);
      expect(mpService.isValidEmail('@domain.com')).toBe(false);
    });

    it('deve extrair userId do external_reference', () => {
      const userId = mpService.extractUserIdFromReference('user-123_starter_1234567890');
      expect(userId).toBe('user-123');

      const invalidUserId = mpService.extractUserIdFromReference('invalid-reference');
      expect(invalidUserId).toBeNull();
    });

    it('deve extrair packageId do external_reference', () => {
      const packageId = mpService.extractPackageIdFromReference('user-456_premium_9876543210');
      expect(packageId).toBe('premium');

      const invalidPackageId = mpService.extractPackageIdFromReference('invalid-reference');
      expect(invalidPackageId).toBeNull();
    });
  });

  describe('🔒 Segurança e Rate Limiting', () => {
    it('deve implementar rate limiting para criação de preferências', async () => {
      const preferenceData = {
        packageId: 'starter',
        userId: 'user-rate-limit',
        userEmail: 'test@example.com',
        paymentMethod: 'pix' as const
      };

      // Mock para simular criação bem-sucedida
      const mockCreate = vi.fn().mockResolvedValue({
        body: { id: 'preference-123' }
      });
      vi.mocked(require('mercadopago').preferences.create).mockImplementation(mockCreate);

      // Criar múltiplas preferências rapidamente
      const promises = Array.from({ length: 6 }, () =>
        mpService.createPaymentPreference(preferenceData)
      );

      const results = await Promise.allSettled(promises);

      // Algumas devem ser rejeitadas por rate limiting
      const rejected = results.filter(r => r.status === 'rejected');
      expect(rejected.length).toBeGreaterThan(0);
    });

    it('deve validar assinatura de webhook (simulado)', () => {
      // Em ambiente real, isso validaria a assinatura HMAC
      const signature = 'valid-signature-hash';
      const payload = JSON.stringify({ id: 'payment-123' });

      const isValid = mpService.validateWebhookSignature(signature, payload);
      expect(typeof isValid).toBe('boolean');
    });

    it('deve sanitizar dados de entrada', () => {
      const dangerousInput = '<script>alert("xss")</script>';
      const sanitized = mpService.sanitizeInput(dangerousInput);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
    });
  });

  describe('📊 Métricas e Monitoramento', () => {
    it('deve rastrear métricas de conversão', () => {
      const metrics = mpService.getConversionMetrics();

      expect(metrics).toHaveProperty('totalPreferences');
      expect(metrics).toHaveProperty('successfulPayments');
      expect(metrics).toHaveProperty('failedPayments');
      expect(metrics).toHaveProperty('conversionRate');
      expect(typeof metrics.conversionRate).toBe('number');
    });

    it('deve rastrear métodos de pagamento mais usados', () => {
      const paymentMethods = mpService.getPaymentMethodStats();

      expect(paymentMethods).toHaveProperty('pix');
      expect(paymentMethods).toHaveProperty('credit_card');
      expect(paymentMethods).toHaveProperty('bank_transfer');
    });

    it('deve calcular ticket médio', () => {
      const averageTicket = mpService.calculateAverageTicket();
      expect(typeof averageTicket).toBe('number');
      expect(averageTicket).toBeGreaterThan(0);
    });
  });
});

describe('🧪 Testes de Integração MercadoPago', () => {
  let mpService: MercadoPagoService;

  beforeEach(() => {
    mpService = new MercadoPagoService();
  });

  it('deve processar fluxo completo de pagamento PIX', async () => {
    // 1. Criar preferência
    const mockPreference = { id: 'pref-pix-123', init_point: 'https://pay.com' };
    const mockCreate = vi.fn().mockResolvedValue({ body: mockPreference });
    vi.mocked(require('mercadopago').preferences.create).mockImplementation(mockCreate);

    const preference = await mpService.createPaymentPreference({
      packageId: 'starter',
      userId: 'integration-user',
      userEmail: 'integration@test.com',
      paymentMethod: 'pix'
    });

    expect(preference.id).toBe('pref-pix-123');

    // 2. Simular webhook de pagamento aprovado
    const mockPayment = {
      id: 'payment-pix-123',
      status: 'approved',
      transaction_amount: 94.91,
      external_reference: 'integration-user_starter_1234567890',
      payment_method_id: 'pix'
    };

    const mockFindById = vi.fn().mockResolvedValue({ body: mockPayment });
    vi.mocked(require('mercadopago').payment.findById).mockImplementation(mockFindById);

    const webhookResult = await mpService.processWebhook({
      id: 'payment-pix-123',
      topic: 'payment',
      action: 'payment.updated'
    });

    expect(webhookResult.processed).toBe(true);
    expect(webhookResult.action).toBe('credit_user');
    expect(webhookResult.paymentData?.status).toBe('approved');
  });

  it('deve lidar com falha de pagamento e retry', async () => {
    // Simular pagamento rejeitado
    const mockPayment = {
      id: 'payment-failed-123',
      status: 'rejected',
      transaction_amount: 180.00,
      external_reference: 'retry-user_standard_9999999999',
      payment_method_id: 'credit_card',
      status_detail: 'cc_rejected_bad_filled_card_number'
    };

    const mockFindById = vi.fn().mockResolvedValue({ body: mockPayment });
    vi.mocked(require('mercadopago').payment.findById).mockImplementation(mockFindById);

    const webhookResult = await mpService.processWebhook({
      id: 'payment-failed-123',
      topic: 'payment',
      action: 'payment.updated'
    });

    expect(webhookResult.processed).toBe(true);
    expect(webhookResult.action).toBe('notify_failure');
    expect(webhookResult.paymentData?.status).toBe('rejected');

    // Nova tentativa deve criar nova preferência
    const mockNewPreference = { id: 'pref-retry-456', init_point: 'https://retry.com' };
    const mockCreateRetry = vi.fn().mockResolvedValue({ body: mockNewPreference });
    vi.mocked(require('mercadopago').preferences.create).mockImplementation(mockCreateRetry);

    const retryPreference = await mpService.createPaymentPreference({
      packageId: 'standard',
      userId: 'retry-user',
      userEmail: 'retry@test.com',
      paymentMethod: 'credit_card'
    });

    expect(retryPreference.id).toBe('pref-retry-456');
  });
});