import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreditAtomicService } from '@/services/credit-atomic';
import { CREDIT_COSTS, getActivityConfig } from '@/types/credits';

// Mock setTimeout para testes síncronos
vi.useFakeTimers();

describe('CreditAtomicService - Sistema de Transações Atômicas', () => {
  let creditService: CreditAtomicService;
  const testUserId = 'test-user-123';

  beforeEach(() => {
    creditService = new CreditAtomicService();
    // Adicionar créditos iniciais para testes
    creditService.addCredits(testUserId, 10.0, 'Initial test credits');
  });

  describe('🔍 Verificação de Créditos', () => {
    it('deve verificar créditos disponíveis para AI Chat', async () => {
      const verification = await creditService.checkCreditsAvailable(testUserId, 'ai-chat-message');

      expect(verification).toEqual({
        sufficient: true,
        required: 0.1,
        available: 10.0,
        activityType: 'ai-chat-message'
      });
    });

    it('deve verificar créditos insuficientes', async () => {
      // Consumir quase todos os créditos
      await creditService.addCredits(testUserId, -9.95, 'Consume credits');

      const verification = await creditService.checkCreditsAvailable(testUserId, 'individual');

      expect(verification).toEqual({
        sufficient: false,
        required: 3,
        available: 0.05,
        activityType: 'individual'
      });
    });

    it('deve rejeitar atividade inexistente', async () => {
      await expect(
        creditService.checkCreditsAvailable(testUserId, 'invalid-activity')
      ).rejects.toThrow('INVALID_ACTIVITY_TYPE: invalid-activity');
    });
  });

  describe('⚡ Execução Atômica de Atividades', () => {
    it('deve executar AI Chat com débito de créditos', async () => {
      const mockAIResponse = { content: 'Hello!', role: 'assistant' };
      const executor = vi.fn().mockResolvedValue(mockAIResponse);

      const result = await creditService.executeActivityWithCredits(
        testUserId,
        'ai-chat-message',
        executor,
        { description: 'Test AI chat' }
      );

      expect(result.success).toBe(true);
      expect(result.result).toEqual(mockAIResponse);
      expect(result.transaction?.amount).toBe(0.1);
      expect(result.transaction?.type).toBe('usage');

      // Verificar se créditos foram debitados
      const balance = await creditService.getBalance(testUserId);
      expect(balance).toBe(9.9);
    });

    it('deve executar aula individual com débito correto', async () => {
      const mockLessonResult = { lessonId: 'lesson-123', status: 'scheduled' };
      const executor = vi.fn().mockResolvedValue(mockLessonResult);

      const result = await creditService.executeActivityWithCredits(
        testUserId,
        'individual',
        executor,
        { description: 'Individual lesson booking' }
      );

      expect(result.success).toBe(true);
      expect(result.transaction?.amount).toBe(3);

      const balance = await creditService.getBalance(testUserId);
      expect(balance).toBe(7.0);
    });

    it('deve executar unidade de aprendizado', async () => {
      const mockLearningResult = { unitId: 'unit-123', progress: 50 };
      const executor = vi.fn().mockResolvedValue(mockLearningResult);

      const result = await creditService.executeActivityWithCredits(
        testUserId,
        'learning-unit',
        executor,
        { description: 'Learning unit progress' }
      );

      expect(result.success).toBe(true);
      expect(result.transaction?.amount).toBe(0.5);

      const balance = await creditService.getBalance(testUserId);
      expect(balance).toBe(9.5);
    });

    it('deve falhar com créditos insuficientes', async () => {
      // Consumir quase todos os créditos
      await creditService.addCredits(testUserId, -9.5, 'Consume credits');

      const executor = vi.fn();

      const result = await creditService.executeActivityWithCredits(
        testUserId,
        'individual',
        executor
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('INSUFFICIENT_CREDITS');
      expect(executor).not.toHaveBeenCalled();

      // Saldo não deve ter mudado
      const balance = await creditService.getBalance(testUserId);
      expect(balance).toBe(0.5);
    });

    it('deve fazer rollback em caso de erro', async () => {
      const executor = vi.fn().mockRejectedValue(new Error('Execution failed'));

      const result = await creditService.executeActivityWithCredits(
        testUserId,
        'ai-chat-message',
        executor,
        { maxRetries: 1 }
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Execution failed');

      // Saldo deve ter sido restaurado
      const balance = await creditService.getBalance(testUserId);
      expect(balance).toBe(10.0);
    });

    it('deve retry e succeeder na segunda tentativa', async () => {
      const mockResult = { success: true };
      const executor = vi.fn()
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockResolvedValueOnce(mockResult);

      const result = await creditService.executeActivityWithCredits(
        testUserId,
        'ai-chat-message',
        executor,
        { maxRetries: 2 }
      );

      expect(result.success).toBe(true);
      expect(result.result).toEqual(mockResult);
      expect(executor).toHaveBeenCalledTimes(2);

      // Créditos devem ter sido debitados
      const balance = await creditService.getBalance(testUserId);
      expect(balance).toBe(9.9);
    });
  });

  describe('🚧 Rate Limiting', () => {
    it('deve permitir até 50 requests por minuto', async () => {
      // Fazer 50 verificações - deve funcionar
      for (let i = 0; i < 50; i++) {
        await creditService.checkCreditsAvailable(testUserId, 'ai-chat-message');
      }

      // 51ª verificação deve falhar
      await expect(
        creditService.checkCreditsAvailable(testUserId, 'ai-chat-message')
      ).rejects.toThrow('RATE_LIMIT_EXCEEDED');
    });

    it('deve mostrar status de rate limit', () => {
      const status = creditService.getRateLimitStatus(testUserId);
      expect(status.maxRequests).toBe(50);
      expect(status.remaining).toBe(50);
    });
  });

  describe('💰 Gerenciamento de Saldo', () => {
    it('deve adicionar créditos corretamente', async () => {
      const transaction = await creditService.addCredits(testUserId, 5.5, 'Test purchase');

      expect(transaction.type).toBe('purchase');
      expect(transaction.amount).toBe(5.5);

      const balance = await creditService.getBalance(testUserId);
      expect(balance).toBe(15.5);
    });

    it('deve calcular estimativa de custos múltiplos', async () => {
      const estimate = await creditService.estimateActivityCost(
        ['ai-chat-message', 'learning-unit', 'individual'],
        [10, 2, 1]
      );

      expect(estimate.totalCost).toBe(5); // (10 * 0.1) + (2 * 0.5) + (1 * 3)
      expect(estimate.breakdown).toHaveLength(3);
      expect(estimate.breakdown[0]).toEqual({
        activity: 'ai-chat-message',
        cost: 0.1,
        quantity: 10
      });
    });
  });

  describe('⚙️ Configuração de Custos', () => {
    it('deve ter custos corretos para cada atividade', () => {
      expect(getActivityConfig('ai-chat-message')?.cost).toBe(0.1);
      expect(getActivityConfig('learning-unit')?.cost).toBe(0.5);
      expect(getActivityConfig('individual')?.cost).toBe(3);
      expect(getActivityConfig('group-beginner')?.cost).toBe(1);
    });

    it('deve ter categorias corretas', () => {
      expect(getActivityConfig('ai-chat-message')?.category).toBe('communication');
      expect(getActivityConfig('learning-unit')?.category).toBe('learning');
      expect(getActivityConfig('quiz-attempt')?.category).toBe('assessment');
      expect(getActivityConfig('individual')?.category).toBe('lesson');
    });

    it('deve ter configurações de confirmação corretas', () => {
      expect(getActivityConfig('ai-chat-message')?.requiresConfirmation).toBe(false);
      expect(getActivityConfig('individual')?.requiresConfirmation).toBe(true);
    });
  });

  describe('🔄 Transações Pendentes', () => {
    it('deve expirar transações após timeout', async () => {
      const executor = vi.fn().mockImplementation(async () => {
        // Simular execução demorada
        vi.advanceTimersByTime(35000); // 35 segundos
        return { result: 'delayed' };
      });

      const result = await creditService.executeActivityWithCredits(
        testUserId,
        'ai-chat-message',
        executor
      );

      expect(result.success).toBe(false);

      // Saldo deve ter sido restaurado devido ao timeout
      const balance = await creditService.getBalance(testUserId);
      expect(balance).toBe(10.0);
    });
  });
});

describe('📊 Testes de Integração - Múltiplas Atividades', () => {
  let creditService: CreditAtomicService;
  const testUserId = 'integration-user';

  beforeEach(() => {
    creditService = new CreditAtomicService();
    creditService.addCredits(testUserId, 20.0, 'Integration test credits');
  });

  it('deve processar múltiplas atividades em sequência', async () => {
    // Simular uma sessão de estudo completa
    const activities = [
      { type: 'learning-unit', expectedCost: 0.5 },
      { type: 'ai-chat-message', expectedCost: 0.1 },
      { type: 'ai-chat-message', expectedCost: 0.1 },
      { type: 'quiz-attempt', expectedCost: 0.3 },
      { type: 'exercise-completion', expectedCost: 0.2 }
    ];

    let totalCost = 0;

    for (const activity of activities) {
      const executor = vi.fn().mockResolvedValue({ success: true });

      const result = await creditService.executeActivityWithCredits(
        testUserId,
        activity.type,
        executor
      );

      expect(result.success).toBe(true);
      totalCost += activity.expectedCost;
    }

    const finalBalance = await creditService.getBalance(testUserId);
    expect(finalBalance).toBe(20.0 - totalCost);
  });

  it('deve parar execução quando créditos insuficientes', async () => {
    // Consumir a maior parte dos créditos
    await creditService.addCredits(testUserId, -19.0, 'Consume most credits');

    const aiExecutor = vi.fn().mockResolvedValue({ message: 'AI response' });
    const lessonExecutor = vi.fn().mockResolvedValue({ lesson: 'booked' });

    // AI Chat deve funcionar (0.1 crédito)
    const aiResult = await creditService.executeActivityWithCredits(
      testUserId,
      'ai-chat-message',
      aiExecutor
    );
    expect(aiResult.success).toBe(true);

    // Aula individual deve falhar (3 créditos, mas só tem 0.9)
    const lessonResult = await creditService.executeActivityWithCredits(
      testUserId,
      'individual',
      lessonExecutor
    );
    expect(lessonResult.success).toBe(false);
    expect(lessonResult.error).toBe('INSUFFICIENT_CREDITS');
    expect(lessonExecutor).not.toHaveBeenCalled();
  });
});

describe('🛡️ Testes de Segurança', () => {
  let creditService: CreditAtomicService;
  const testUserId = 'security-test-user';

  beforeEach(() => {
    creditService = new CreditAtomicService();
    creditService.addCredits(testUserId, 5.0, 'Security test credits');
  });

  it('deve prevenir condições de corrida', async () => {
    // Executar múltiplas operações simultaneamente
    const executor = vi.fn().mockResolvedValue({ success: true });

    const promises = Array.from({ length: 5 }, () =>
      creditService.executeActivityWithCredits(
        testUserId,
        'individual', // 3 créditos cada
        executor
      )
    );

    const results = await Promise.all(promises);

    // Apenas uma operação deve ter sucesso (5 créditos disponíveis, cada operação custa 3)
    const successfulOperations = results.filter(r => r.success);
    expect(successfulOperations).toHaveLength(1);

    const finalBalance = await creditService.getBalance(testUserId);
    expect(finalBalance).toBe(2.0); // 5 - 3 = 2
  });

  it('deve validar dados de entrada', async () => {
    await expect(
      creditService.checkCreditsAvailable('', 'ai-chat-message')
    ).rejects.toThrow();

    await expect(
      creditService.checkCreditsAvailable(testUserId, '')
    ).rejects.toThrow();
  });

  it('deve lidar com valores negativos', async () => {
    // Não deve permitir débitos que resultem em saldo negativo
    const executor = vi.fn().mockResolvedValue({ success: true });

    // Primeira operação: 3 créditos (saldo fica 2)
    await creditService.executeActivityWithCredits(testUserId, 'individual', executor);

    // Segunda operação: deve falhar (não há 3 créditos)
    const result = await creditService.executeActivityWithCredits(testUserId, 'individual', executor);

    expect(result.success).toBe(false);
    expect(result.error).toBe('INSUFFICIENT_CREDITS');
  });
});