import type { z } from 'zod';

/**
 * Adds password confirmation validation to a schema
 *
 * @param baseSchema - Schema containing password and confirmPassword fields
 * @returns Refined schema with password matching validation
 *
 * @example
 * ```ts
 * const customSchema = z.object({
 *   password: z.string().min(6),
 *   confirmPassword: z.string().min(6),
 * });
 * const validatedSchema = withPasswordConfirmation(customSchema);
 * ```
 */
export const withPasswordConfirmation = <T extends { password: string; confirmPassword: string }>(
  baseSchema: z.ZodSchema<T>
) => {
  return baseSchema.refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Senhas não coincidem',
      path: ['confirmPassword'],
    }
  );
};
