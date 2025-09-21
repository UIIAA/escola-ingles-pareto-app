// Sistema de Transações Atômicas para Créditos
// Escola Inglês Pareto - Implementação Robusta e Segura

import {
  CreditVerification,
  PendingTransaction,
  CreditTransaction,
  ActivityCostConfig,
  CREDIT_COSTS,
  calculateCreditsNeeded,
  getActivityConfig,
  generateTransactionId,
  generateActivityId
} from '@/types/credits';

// Rate Limiting Store
class RateLimitStore {
  private limits = new Map<string, { count: number; resetTime: number }>();
  private readonly windowMs = 60000; // 1 minuto
  private readonly maxRequests = 50; // 50 requests por minuto por usuário

  checkLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.limits.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      this.limits.set(userId, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (userLimit.count >= this.maxRequests) {
      return false;
    }

    userLimit.count++;
    return true;
  }

  getRemainingRequests(userId: string): number {
    const userLimit = this.limits.get(userId);
    if (!userLimit || Date.now() > userLimit.resetTime) {
      return this.maxRequests;
    }
    return this.maxRequests - userLimit.count;
  }
}

// Transaction Manager
class TransactionManager {
  private pendingTransactions = new Map<string, PendingTransaction>();
  private readonly transactionTimeout = 30000; // 30 segundos

  createPendingTransaction(
    userId: string,
    activityType: string,
    activityId: string,
    amount: number,
    description: string
  ): PendingTransaction {
    const transaction: PendingTransaction = {
      id: generateTransactionId(),
      userId,
      amount,
      activityType,
      activityId,
      description,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + this.transactionTimeout).toISOString(),
      status: 'pending'
    };

    this.pendingTransactions.set(transaction.id, transaction);

    // Auto-expire transaction
    setTimeout(() => {
      const existing = this.pendingTransactions.get(transaction.id);
      if (existing && existing.status === 'pending') {
        existing.status = 'expired';
        this.pendingTransactions.delete(transaction.id);
        console.warn(`⏱️ Transaction ${transaction.id} expired`);
      }
    }, this.transactionTimeout);

    return transaction;
  }

  confirmTransaction(transactionId: string): boolean {
    const transaction = this.pendingTransactions.get(transactionId);
    if (!transaction || transaction.status !== 'pending') {
      return false;
    }

    this.pendingTransactions.delete(transactionId);
    return true;
  }

  rollbackTransaction(transactionId: string): boolean {
    const transaction = this.pendingTransactions.get(transactionId);
    if (!transaction) {
      return false;
    }

    this.pendingTransactions.delete(transactionId);
    return true;
  }

  getTransaction(transactionId: string): PendingTransaction | null {
    return this.pendingTransactions.get(transactionId) || null;
  }
}

// Main Credit Service
export class CreditAtomicService {
  private rateLimitStore = new RateLimitStore();
  private transactionManager = new TransactionManager();
  private userBalances = new Map<string, number>(); // Mock storage - em produção seria banco de dados

  constructor() {
    // Initialize with mock data
    this.userBalances.set('user-123', 25.5); // Mock user with some credits
  }

  /**
   * Verificação atômica de créditos disponíveis
   */
  async checkCreditsAvailable(
    userId: string,
    activityType: string,
    options: {
      estimateTotal?: number;
      checkOnly?: boolean;
    } = {}
  ): Promise<CreditVerification> {
    // Rate limiting check
    if (!this.rateLimitStore.checkLimit(userId)) {
      throw new Error('RATE_LIMIT_EXCEEDED');
    }

    const config = getActivityConfig(activityType);
    if (!config) {
      throw new Error(`INVALID_ACTIVITY_TYPE: ${activityType}`);
    }

    const available = this.userBalances.get(userId) || 0;
    const required = config.cost;

    const verification: CreditVerification = {
      sufficient: available >= required,
      required,
      available,
      estimatedUsage: options.estimateTotal,
      activityType
    };

    console.log(`🔍 Credit check for ${userId}: ${JSON.stringify(verification)}`);
    return verification;
  }

  /**
   * Execução atômica de atividade com débito de créditos
   */
  async executeActivityWithCredits<T>(
    userId: string,
    activityType: string,
    activityExecutor: (activityId: string) => Promise<T>,
    options: {
      description?: string;
      allowPartial?: boolean;
      maxRetries?: number;
    } = {}
  ): Promise<{
    success: boolean;
    result?: T;
    error?: string;
    verification: CreditVerification;
    transaction?: CreditTransaction;
  }> {
    const activityId = generateActivityId(activityType);
    const description = options.description || `Execute ${activityType}`;
    const maxRetries = options.maxRetries || 3;

    // 1. Verificação prévia obrigatória
    const verification = await this.checkCreditsAvailable(userId, activityType);

    if (!verification.sufficient) {
      return {
        success: false,
        error: 'INSUFFICIENT_CREDITS',
        verification
      };
    }

    // 2. Criar transação pendente
    const pendingTransaction = this.transactionManager.createPendingTransaction(
      userId,
      activityType,
      activityId,
      verification.required,
      description
    );

    // 3. Debitar créditos temporariamente
    const currentBalance = this.userBalances.get(userId) || 0;
    this.userBalances.set(userId, currentBalance - verification.required);

    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        attempts++;

        // 4. Executar atividade
        const result = await activityExecutor(activityId);

        // 5. Confirmar transação
        const confirmed = this.transactionManager.confirmTransaction(pendingTransaction.id);

        if (!confirmed) {
          throw new Error('TRANSACTION_CONFIRMATION_FAILED');
        }

        // 6. Criar registro da transação confirmada
        const completedTransaction: CreditTransaction = {
          id: pendingTransaction.id,
          userId,
          type: 'usage',
          amount: verification.required,
          description,
          activityId,
          activityType,
          status: 'completed',
          timestamp: pendingTransaction.createdAt,
          completedAt: new Date().toISOString()
        };

        console.log(`✅ Activity ${activityType} completed successfully for ${userId}`);

        return {
          success: true,
          result,
          verification,
          transaction: completedTransaction
        };

      } catch (error) {
        console.error(`❌ Activity execution failed (attempt ${attempts}/${maxRetries}):`, error);

        if (attempts >= maxRetries) {
          // 7. Rollback automático
          await this.rollbackTransaction(pendingTransaction.id, userId, verification.required);

          return {
            success: false,
            error: error instanceof Error ? error.message : 'ACTIVITY_EXECUTION_FAILED',
            verification
          };
        }

        // Aguardar antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    // Fallback rollback
    await this.rollbackTransaction(pendingTransaction.id, userId, verification.required);

    return {
      success: false,
      error: 'MAX_RETRIES_EXCEEDED',
      verification
    };
  }

  /**
   * Rollback automático de transação
   */
  private async rollbackTransaction(
    transactionId: string,
    userId: string,
    amount: number
  ): Promise<void> {
    try {
      // Restaurar saldo
      const currentBalance = this.userBalances.get(userId) || 0;
      this.userBalances.set(userId, currentBalance + amount);

      // Marcar transação como rolled back
      this.transactionManager.rollbackTransaction(transactionId);

      console.log(`🔄 Transaction ${transactionId} rolled back for ${userId}, ${amount} credits restored`);
    } catch (error) {
      console.error(`❌ Rollback failed for transaction ${transactionId}:`, error);
      // Em produção, isso seria registrado para auditoria crítica
    }
  }

  /**
   * Verificação simples de saldo (para UI)
   */
  async getBalance(userId: string): Promise<number> {
    return this.userBalances.get(userId) || 0;
  }

  /**
   * Estimativa de custo para múltiplas atividades
   */
  async estimateActivityCost(
    activityTypes: string[],
    quantities: number[] = []
  ): Promise<{ totalCost: number; breakdown: Array<{ activity: string; cost: number; quantity: number }> }> {
    let totalCost = 0;
    const breakdown: Array<{ activity: string; cost: number; quantity: number }> = [];

    for (let i = 0; i < activityTypes.length; i++) {
      const activityType = activityTypes[i];
      const quantity = quantities[i] || 1;
      const config = getActivityConfig(activityType);

      if (config) {
        const cost = config.cost * quantity;
        totalCost += cost;
        breakdown.push({
          activity: activityType,
          cost: config.cost,
          quantity
        });
      }
    }

    return { totalCost, breakdown };
  }

  /**
   * Status do rate limiting para um usuário
   */
  getRateLimitStatus(userId: string): { remaining: number; maxRequests: number } {
    return {
      remaining: this.rateLimitStore.getRemainingRequests(userId),
      maxRequests: 50
    };
  }

  /**
   * Adição manual de créditos (para compras)
   */
  async addCredits(
    userId: string,
    amount: number,
    description: string = 'Credit purchase'
  ): Promise<CreditTransaction> {
    const currentBalance = this.userBalances.get(userId) || 0;
    this.userBalances.set(userId, currentBalance + amount);

    const transaction: CreditTransaction = {
      id: generateTransactionId(),
      userId,
      type: 'purchase',
      amount,
      description,
      status: 'completed',
      timestamp: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    console.log(`💰 Added ${amount} credits to ${userId}. New balance: ${currentBalance + amount}`);

    return transaction;
  }
}

// Singleton instance
export const creditAtomicService = new CreditAtomicService();

// Helper functions for components
export const createActivityExecutor = <T>(
  executorFunction: () => Promise<T>
) => {
  return async (activityId: string): Promise<T> => {
    return executorFunction();
  };
};

export const withCreditValidation = async <T>(
  userId: string,
  activityType: string,
  executor: () => Promise<T>,
  options?: {
    description?: string;
    onInsufficientCredits?: (verification: CreditVerification) => void;
    onSuccess?: (result: T, transaction: CreditTransaction) => void;
    onError?: (error: string) => void;
  }
): Promise<T | null> => {
  const result = await creditAtomicService.executeActivityWithCredits(
    userId,
    activityType,
    createActivityExecutor(executor),
    { description: options?.description }
  );

  if (!result.success) {
    if (result.error === 'INSUFFICIENT_CREDITS' && options?.onInsufficientCredits) {
      options.onInsufficientCredits(result.verification);
    } else if (options?.onError) {
      options.onError(result.error || 'Unknown error');
    }
    return null;
  }

  if (options?.onSuccess && result.result && result.transaction) {
    options.onSuccess(result.result, result.transaction);
  }

  return result.result || null;
};