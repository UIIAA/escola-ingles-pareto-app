import { useState, useEffect } from 'react';
import {
  UserCredits,
  CreditTransaction,
  calculateCreditsNeeded,
  canAffordLesson
} from '@/types/credits';

// Mock user ID - in real app this would come from auth context
const MOCK_USER_ID = 'user-123';

export const useCredits = () => {
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCredits: UserCredits = {
        userId: MOCK_USER_ID,
        totalCredits: 45,
        usedCredits: 12,
        availableCredits: 33,
        lastUpdated: new Date().toISOString()
      };

      const mockTransactions: CreditTransaction[] = [
        {
          id: 'tx-1',
          userId: MOCK_USER_ID,
          type: 'purchase',
          amount: 25,
          description: 'Pacote Padrão - 25 créditos + 5 bônus',
          timestamp: '2024-09-10T10:00:00Z'
        },
        {
          id: 'tx-2',
          userId: MOCK_USER_ID,
          type: 'purchase',
          amount: 15,
          description: 'Pacote Iniciante - 10 créditos + 2 bônus',
          timestamp: '2024-09-05T14:30:00Z'
        },
        {
          id: 'tx-3',
          userId: MOCK_USER_ID,
          type: 'usage',
          amount: -3,
          description: 'Aula Individual - Conversação Personalizada',
          relatedLessonId: 'lesson-456',
          timestamp: '2024-09-12T16:00:00Z'
        },
        {
          id: 'tx-4',
          userId: MOCK_USER_ID,
          type: 'usage',
          amount: -1,
          description: 'Aula em Grupo - Família (Básico)',
          relatedLessonId: 'lesson-789',
          timestamp: '2024-09-13T09:00:00Z'
        },
        {
          id: 'tx-5',
          userId: MOCK_USER_ID,
          type: 'bonus',
          amount: 3,
          description: 'Bônus por indicação de amigo',
          timestamp: '2024-09-14T12:00:00Z'
        }
      ];

      setUserCredits(mockCredits);
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const purchaseCredits = async (packageId: string, credits: number, bonusCredits: number = 0) => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const totalCreditsToAdd = credits + bonusCredits;

      // Update user credits
      setUserCredits(prev => {
        if (!prev) return null;
        return {
          ...prev,
          totalCredits: prev.totalCredits + totalCreditsToAdd,
          availableCredits: prev.availableCredits + totalCreditsToAdd,
          lastUpdated: new Date().toISOString()
        };
      });

      // Add transaction
      const newTransaction: CreditTransaction = {
        id: `tx-${Date.now()}`,
        userId: MOCK_USER_ID,
        type: 'purchase',
        amount: totalCreditsToAdd,
        description: `Compra de pacote - ${credits} créditos${bonusCredits > 0 ? ` + ${bonusCredits} bônus` : ''}`,
        timestamp: new Date().toISOString()
      };

      setTransactions(prev => [newTransaction, ...prev]);

      return { success: true };
    } catch (err) {
      setError('Erro ao processar compra de créditos');
      return { success: false, error: 'Erro ao processar compra' };
    } finally {
      setLoading(false);
    }
  };

  const useCreditsForLesson = async (lessonType: string, lessonId: string, description: string) => {
    try {
      const creditsNeeded = calculateCreditsNeeded(lessonType);

      if (!userCredits || !canAffordLesson(userCredits.availableCredits, lessonType)) {
        return { success: false, error: 'Créditos insuficientes' };
      }

      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user credits
      setUserCredits(prev => {
        if (!prev) return null;
        return {
          ...prev,
          usedCredits: prev.usedCredits + creditsNeeded,
          availableCredits: prev.availableCredits - creditsNeeded,
          lastUpdated: new Date().toISOString()
        };
      });

      // Add transaction
      const newTransaction: CreditTransaction = {
        id: `tx-${Date.now()}`,
        userId: MOCK_USER_ID,
        type: 'usage',
        amount: -creditsNeeded,
        description,
        relatedLessonId: lessonId,
        timestamp: new Date().toISOString()
      };

      setTransactions(prev => [newTransaction, ...prev]);

      return { success: true };
    } catch (err) {
      setError('Erro ao usar créditos');
      return { success: false, error: 'Erro ao usar créditos' };
    } finally {
      setLoading(false);
    }
  };

  const refundCredits = async (transactionId: string) => {
    try {
      setLoading(true);

      // Find the original transaction
      const originalTx = transactions.find(tx => tx.id === transactionId);
      if (!originalTx || originalTx.type !== 'usage') {
        return { success: false, error: 'Transação não encontrada' };
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const refundAmount = Math.abs(originalTx.amount);

      // Update user credits
      setUserCredits(prev => {
        if (!prev) return null;
        return {
          ...prev,
          usedCredits: prev.usedCredits - refundAmount,
          availableCredits: prev.availableCredits + refundAmount,
          lastUpdated: new Date().toISOString()
        };
      });

      // Add refund transaction
      const refundTransaction: CreditTransaction = {
        id: `tx-${Date.now()}`,
        userId: MOCK_USER_ID,
        type: 'refund',
        amount: refundAmount,
        description: `Reembolso: ${originalTx.description}`,
        relatedLessonId: originalTx.relatedLessonId,
        timestamp: new Date().toISOString()
      };

      setTransactions(prev => [refundTransaction, ...prev]);

      return { success: true };
    } catch (err) {
      setError('Erro ao processar reembolso');
      return { success: false, error: 'Erro ao processar reembolso' };
    } finally {
      setLoading(false);
    }
  };

  return {
    userCredits,
    transactions,
    loading,
    error,
    purchaseCredits,
    useCreditsForLesson,
    refundCredits,
    canAffordLesson: (lessonType: string) =>
      userCredits ? canAffordLesson(userCredits.availableCredits, lessonType) : false,
    getCreditsNeeded: calculateCreditsNeeded
  };
};