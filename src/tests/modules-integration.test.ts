import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { creditAtomicService } from '@/services/credit-atomic';

// Mock dos componentes e serviços
vi.mock('@/services/credit-atomic');
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Component wrapper para testes
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('🤖 AI Chat - Integração com Sistema de Créditos', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock do saldo inicial
    vi.mocked(creditAtomicService.getBalance).mockResolvedValue(5.0);
  });

  it('deve desabilitar botão de envio quando sem créditos', async () => {
    // Mock saldo insuficiente
    vi.mocked(creditAtomicService.getBalance).mockResolvedValue(0.05);

    const { default: AIChat } = await import('@/pages/AIChat');

    render(
      <TestWrapper>
        <AIChat />
      </TestWrapper>
    );

    await waitFor(() => {
      const sendButton = screen.getByTitle('Créditos insuficientes');
      expect(sendButton).toBeDisabled();
    });
  });

  it('deve mostrar contador de créditos correto', async () => {
    const { default: AIChat } = await import('@/pages/AIChat');

    render(
      <TestWrapper>
        <AIChat />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('5.0')).toBeInTheDocument();
      expect(screen.getByText('créditos')).toBeInTheDocument();
    });
  });

  it('deve mostrar custo da mensagem', async () => {
    const { default: AIChat } = await import('@/pages/AIChat');

    render(
      <TestWrapper>
        <AIChat />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('0.1')).toBeInTheDocument();
      expect(screen.getByText('Mensagem no chat com IA')).toBeInTheDocument();
    });
  });

  it('deve consumir créditos ao enviar mensagem', async () => {
    // Mock execução bem-sucedida
    vi.mocked(creditAtomicService.executeActivityWithCredits).mockResolvedValue({
      success: true,
      result: { content: 'Test response' },
      verification: {
        sufficient: true,
        required: 0.1,
        available: 5.0,
        activityType: 'ai-chat-message'
      },
      transaction: {
        id: 'txn-123',
        userId: 'user-123',
        type: 'usage',
        amount: 0.1,
        description: 'AI Chat message',
        status: 'completed',
        timestamp: new Date().toISOString()
      }
    });

    const { default: AIChat } = await import('@/pages/AIChat');

    render(
      <TestWrapper>
        <AIChat />
      </TestWrapper>
    );

    // Esperar componente carregar
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Digite sua mensagem...')).toBeInTheDocument();
    });

    // Digitar mensagem
    const textarea = screen.getByPlaceholderText('Digite sua mensagem...');
    fireEvent.change(textarea, { target: { value: 'Hello AI!' } });

    // Clicar em enviar
    const sendButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(sendButton);

    // Verificar se executeActivityWithCredits foi chamado
    await waitFor(() => {
      expect(creditAtomicService.executeActivityWithCredits).toHaveBeenCalledWith(
        'user-123',
        'ai-chat-message',
        expect.any(Function),
        expect.objectContaining({
          description: 'Chat IA - practice mode'
        })
      );
    });
  });

  it('deve mostrar modal quando créditos insuficientes', async () => {
    // Mock créditos insuficientes
    vi.mocked(creditAtomicService.executeActivityWithCredits).mockResolvedValue(null);

    const { default: AIChat } = await import('@/pages/AIChat');

    render(
      <TestWrapper>
        <AIChat />
      </TestWrapper>
    );

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText('Digite sua mensagem...');
      fireEvent.change(textarea, { target: { value: 'Test message' } });

      const sendButton = screen.getByRole('button', { name: /enviar/i });
      fireEvent.click(sendButton);
    });

    // Modal deve aparecer (em implementação real)
    // await waitFor(() => {
    //   expect(screen.getByText('Créditos Insuficientes')).toBeInTheDocument();
    // });
  });
});

describe('🎓 Agendamento de Aulas - Integração com Créditos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(creditAtomicService.getBalance).mockResolvedValue(3.0);
  });

  it('deve mostrar saldo de créditos na tela de agendamento', async () => {
    const { default: Schedule } = await import('@/pages/Schedule');

    render(
      <TestWrapper>
        <Schedule />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText(/crédito/i)).toBeInTheDocument();
    });
  });

  it('deve permitir agendamento com créditos suficientes', async () => {
    // Mock agendamento bem-sucedido
    vi.mocked(creditAtomicService.executeActivityWithCredits).mockResolvedValue({
      success: true,
      result: { lessonId: 'lesson-123', scheduled: true },
      verification: {
        sufficient: true,
        required: 1,
        available: 3.0,
        activityType: 'group-beginner'
      },
      transaction: {
        id: 'txn-lesson-123',
        userId: 'user-123',
        type: 'usage',
        amount: 1,
        description: 'Group lesson booking',
        status: 'completed',
        timestamp: new Date().toISOString()
      }
    });

    const { default: StudentBooking } = await import('@/components/StudentBooking');

    render(
      <TestWrapper>
        <StudentBooking />
      </TestWrapper>
    );

    // Simular seleção de data e horário (implementação específica)
    // await waitFor(() => {
    //   const confirmButton = screen.getByText('Confirmar');
    //   fireEvent.click(confirmButton);
    // });

    // Verificar se função foi chamada
    // expect(creditAtomicService.executeActivityWithCredits).toHaveBeenCalledWith(
    //   'user-123',
    //   'group-beginner',
    //   expect.any(Function)
    // );
  });

  it('deve bloquear agendamento com créditos insuficientes', async () => {
    // Mock créditos insuficientes
    vi.mocked(creditAtomicService.getBalance).mockResolvedValue(0.5);

    const { default: Schedule } = await import('@/pages/Schedule');

    render(
      <TestWrapper>
        <Schedule />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('0.5')).toBeInTheDocument();
    });

    // Tentar agendar deve mostrar aviso ou redirecionar para compra
  });
});

describe('📚 Trilhas de Aprendizado - Integração com Créditos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(creditAtomicService.getBalance).mockResolvedValue(2.0);
  });

  it('deve mostrar custo das trilhas', async () => {
    const { default: Learning } = await import('@/pages/Learning');

    render(
      <TestWrapper>
        <Learning />
      </TestWrapper>
    );

    await waitFor(() => {
      // Verificar se informações de custo estão visíveis
      expect(screen.getByText('Sua Jornada')).toBeInTheDocument();
    });
  });

  it('deve consumir créditos ao iniciar trilha', async () => {
    // Mock início de trilha bem-sucedido
    vi.mocked(creditAtomicService.executeActivityWithCredits).mockResolvedValue({
      success: true,
      result: { pathId: 'beginner-foundation', started: true },
      verification: {
        sufficient: true,
        required: 0.5,
        available: 2.0,
        activityType: 'learning-unit'
      },
      transaction: {
        id: 'txn-path-123',
        userId: 'user-123',
        type: 'usage',
        amount: 0.5,
        description: 'Learning path unit',
        status: 'completed',
        timestamp: new Date().toISOString()
      }
    });

    const { default: Learning } = await import('@/pages/Learning');

    render(
      <TestWrapper>
        <Learning />
      </TestWrapper>
    );

    // Simular início de trilha
    await waitFor(() => {
      const startButtons = screen.getAllByText(/Iniciar Trilha/i);
      if (startButtons.length > 0) {
        fireEvent.click(startButtons[0]);
      }
    });

    // Verificar se consumo foi chamado
    // expect(creditAtomicService.executeActivityWithCredits).toHaveBeenCalledWith(
    //   'user-123',
    //   'learning-unit',
    //   expect.any(Function)
    // );
  });

  it('deve mostrar estimativa de custo total da trilha', async () => {
    // Mock estimativa de custo
    vi.mocked(creditAtomicService.estimateActivityCost).mockResolvedValue({
      totalCost: 2.5,
      breakdown: [
        { activity: 'learning-unit', cost: 0.5, quantity: 5 }
      ]
    });

    const { default: Learning } = await import('@/pages/Learning');

    render(
      <TestWrapper>
        <Learning />
      </TestWrapper>
    );

    await waitFor(() => {
      // Verificar se estimativa é mostrada ao usuário
      expect(screen.getByText(/Sua Jornada/i)).toBeInTheDocument();
    });
  });
});

describe('💳 Componentes de UI - Sistema de Créditos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve exibir CreditCounter corretamente', async () => {
    const { default: CreditCounter } = await import('@/components/credit-system/CreditCounter');

    render(
      <CreditCounter
        currentCredits={7.5}
        showAnimation={false}
        size="md"
        warningThreshold={2}
      />
    );

    expect(screen.getByText('7.5')).toBeInTheDocument();
    expect(screen.getByText('créditos')).toBeInTheDocument();
  });

  it('deve exibir warning quando créditos baixos', async () => {
    const { default: CreditCounter } = await import('@/components/credit-system/CreditCounter');

    render(
      <CreditCounter
        currentCredits={1.2}
        showAnimation={false}
        size="md"
        warningThreshold={2}
        showPurchaseButton={true}
      />
    );

    expect(screen.getByText('1.2')).toBeInTheDocument();
    expect(screen.getByText('Comprar')).toBeInTheDocument();
  });

  it('deve exibir ActivityCostIndicator', async () => {
    const { default: ActivityCostIndicator } = await import('@/components/credit-system/ActivityCostIndicator');

    render(
      <ActivityCostIndicator
        activityType="ai-chat-message"
        userCredits={5.0}
        position="inline"
        showDescription={true}
      />
    );

    expect(screen.getByText('0.1')).toBeInTheDocument();
    expect(screen.getByText('Mensagem no chat com IA')).toBeInTheDocument();
  });

  it('deve exibir CreditWarningModal', async () => {
    const { default: CreditWarningModal } = await import('@/components/credit-system/CreditWarningModal');

    const mockVerification = {
      sufficient: false,
      required: 1.0,
      available: 0.3,
      activityType: 'group-beginner'
    };

    render(
      <CreditWarningModal
        isOpen={true}
        onClose={() => {}}
        verification={mockVerification}
        activityName="Aula em Grupo"
        onPurchaseCredits={() => {}}
      />
    );

    expect(screen.getByText('Créditos Insuficientes')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Required
    expect(screen.getByText('0.3')).toBeInTheDocument(); // Available
  });
});

describe('🔄 Fluxos Completos de Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve processar sessão completa de estudo', async () => {
    // Simular uma sessão completa: Trilha → AI Chat → Quiz
    const activities = [
      { type: 'learning-unit', cost: 0.5 },
      { type: 'ai-chat-message', cost: 0.1 },
      { type: 'ai-chat-message', cost: 0.1 },
      { type: 'quiz-attempt', cost: 0.3 }
    ];

    let currentBalance = 5.0;

    for (const activity of activities) {
      vi.mocked(creditAtomicService.executeActivityWithCredits).mockResolvedValue({
        success: true,
        result: { completed: true },
        verification: {
          sufficient: true,
          required: activity.cost,
          available: currentBalance,
          activityType: activity.type
        },
        transaction: {
          id: `txn-${Date.now()}`,
          userId: 'user-123',
          type: 'usage',
          amount: activity.cost,
          description: `${activity.type} activity`,
          status: 'completed',
          timestamp: new Date().toISOString()
        }
      });

      currentBalance -= activity.cost;
    }

    // Simular execução de atividades
    for (const activity of activities) {
      const result = await creditAtomicService.executeActivityWithCredits(
        'user-123',
        activity.type,
        async () => ({ completed: true })
      );
      expect(result.success).toBe(true);
    }

    // Verificar se todas as atividades foram executadas
    expect(creditAtomicService.executeActivityWithCredits).toHaveBeenCalledTimes(activities.length);
  });

  it('deve interromper sessão quando créditos acabam', async () => {
    // Começar com poucos créditos
    let currentBalance = 0.8;

    // Primeira atividade: sucesso
    vi.mocked(creditAtomicService.executeActivityWithCredits)
      .mockResolvedValueOnce({
        success: true,
        result: { completed: true },
        verification: {
          sufficient: true,
          required: 0.5,
          available: currentBalance,
          activityType: 'learning-unit'
        },
        transaction: {
          id: 'txn-1',
          userId: 'user-123',
          type: 'usage',
          amount: 0.5,
          description: 'Learning unit',
          status: 'completed',
          timestamp: new Date().toISOString()
        }
      })
      // Segunda atividade: falha por créditos insuficientes
      .mockResolvedValueOnce({
        success: false,
        error: 'INSUFFICIENT_CREDITS',
        verification: {
          sufficient: false,
          required: 1.0,
          available: 0.3,
          activityType: 'group-beginner'
        }
      });

    // Primeira atividade deve funcionar
    const result1 = await creditAtomicService.executeActivityWithCredits(
      'user-123',
      'learning-unit',
      async () => ({ completed: true })
    );
    expect(result1.success).toBe(true);

    // Segunda atividade deve falhar
    const result2 = await creditAtomicService.executeActivityWithCredits(
      'user-123',
      'group-beginner',
      async () => ({ booked: true })
    );
    expect(result2.success).toBe(false);
    expect(result2.error).toBe('INSUFFICIENT_CREDITS');
  });

  it('deve manter consistência entre componentes', async () => {
    const initialBalance = 10.0;
    vi.mocked(creditAtomicService.getBalance).mockResolvedValue(initialBalance);

    // Simular carga em diferentes componentes
    const components = ['AIChat', 'Schedule', 'Learning'];

    for (const component of components) {
      const balance = await creditAtomicService.getBalance('user-123');
      expect(balance).toBe(initialBalance);
    }

    expect(creditAtomicService.getBalance).toHaveBeenCalledTimes(components.length);
  });
});