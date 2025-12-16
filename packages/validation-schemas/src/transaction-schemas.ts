import { z } from 'zod';

import { TransactionType } from '@fiap-tech-challenge/models';

import { commonValidations } from './common-validations.js';

/**
 * Schema for transaction form
 */
export const transactionSchema = z.object({
  id: z.string(),
  type: z.enum([TransactionType.CREDIT, TransactionType.DEBIT] as const),
  description: commonValidations.requiredString(),
  value: commonValidations.positiveNumber,
  date: commonValidations.requiredDate,
});

/**
 * Type export for TypeScript support
 */
export type TransactionSchema = z.infer<typeof transactionSchema>;
