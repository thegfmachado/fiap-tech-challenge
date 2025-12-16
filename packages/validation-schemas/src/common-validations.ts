import { z } from 'zod';

/**
 * Reusable Zod validation schemas for common form fields
 */
export const commonValidations = {
  /** Validação de email */
  email: z.string({ required_error: 'Este campo é obrigatório' }).email('Email inválido'),

  /** Validação de senha */
  password: z.string({ required_error: 'Este campo é obrigatório' }).min(6, 'A senha deve ter pelo menos 6 caracteres'),

  /** Validação de string obrigatória */
  requiredString: (message: string = 'Este campo é obrigatório') =>
    z.string({ required_error: message }).min(1, message),

  /** Validação de nome */
  name: z.string({ required_error: 'Este campo é obrigatório' }).min(2, 'O nome deve ter pelo menos 2 caracteres'),

  /** Validação de número positivo */
  positiveNumber: z.number({ required_error: 'Este campo é obrigatório' }).positive('Valor deve ser maior que 0'),

  /** Validação de data obrigatória */
  requiredDate: z.date({ required_error: 'Este campo é obrigatório' }),

  /** Validação de confirmação de senha */
  confirmPassword: () =>
    z.string({ required_error: 'Este campo é obrigatório' }).min(6, 'A senha deve ter pelo menos 6 caracteres'),
} as const;
