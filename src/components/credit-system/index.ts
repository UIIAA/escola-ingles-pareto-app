// Export all credit system components
export { default as CreditWarningModal } from './CreditWarningModal';
export { default as CreditCounter } from './CreditCounter';
export { default as ActivityCostIndicator } from './ActivityCostIndicator';

// Re-export types for convenience
export type {
  CreditVerification,
  PendingTransaction,
  CreditTransaction,
  ActivityCostConfig
} from '@/types/credits';

// Re-export services
export {
  creditAtomicService,
  withCreditValidation,
  createActivityExecutor
} from '@/services/credit-atomic';