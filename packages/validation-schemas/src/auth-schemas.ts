import { z } from 'zod';

import { commonValidations } from './common-validations.js';
import { withPasswordConfirmation } from './helpers.js';

/**
 * Base schema for login form
 */
export const loginSchema = z.object({
  email: commonValidations.email,
  password: commonValidations.password,
});

/**
 * Signup schema with password confirmation validation already applied
 */
export const signupSchema = withPasswordConfirmation(z.object({
  name: commonValidations.name,
  email: commonValidations.email,
  password: commonValidations.password,
  confirmPassword: commonValidations.confirmPassword(),
}));

/**
 * Schema for forgot password form
 */
export const forgotPasswordSchema = z.object({
  email: commonValidations.email,
});

/**
 * Reset password schema with password confirmation validation already applied
 */
export const resetPasswordSchema = withPasswordConfirmation(z.object({
  password: commonValidations.password,
  confirmPassword: commonValidations.confirmPassword(),
}));

/**
 * Type exports for TypeScript support
 */
export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
