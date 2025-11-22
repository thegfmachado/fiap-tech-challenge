import { useForm, UseFormReturn, FieldValues, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * Opções de configuração para validação de formulário
 */
export interface UseFormValidationOptions<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
  /** Modo de validação personalizado */
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

/**
 * Retorno de formulário estendido com utilitários adicionais
 */
export interface FormValidationReturn<T extends FieldValues> extends UseFormReturn<T> {
  /** Verifica se o formulário tem algum erro */
  hasErrors: boolean;
  /** Obtém todas as mensagens de erro como um array */
  getErrorMessages: () => string[];
  /** Limpa todos os erros */
  clearErrors: () => void;
  /** Verifica se o formulário foi modificado (tem alterações não salvas) */
  isDirty: boolean;
  /** Verifica se o formulário é válido */
  isValid: boolean;
  /** Reseta o formulário com valores padrão opcionais */
  resetForm: (values?: T) => void;
}

/**
 * Hook personalizado para validação de formulários usando schemas Zod
 *
 * @param schema Schema Zod para validação
 * @param options Opções de configuração do formulário
 * @returns Métodos e estado estendidos do formulário
 *
 * @example
 * ```tsx
 * import { loginSchema } from '@fiap-tech-challenge/validation-schemas';
 *
 * const form = useFormValidation(loginSchema, {
 *   defaultValues: { email: '', password: '' },
 * });
 *
 * const handleSubmit = form.handleSubmit(async (data) => {
 *   await loginUser(data);
 * });
 * ```
 */
export function useFormValidation<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  options: UseFormValidationOptions<T> = {}
): FormValidationReturn<T> {
  const {
    mode = 'onSubmit',
    ...restOptions
  } = options;

  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode,
    ...restOptions,
  });

  const {
    formState: { errors, isDirty, isValid },
    reset,
    clearErrors,
  } = form;

  const hasErrors = Object.keys(errors).length > 0;

  const getErrorMessages = (): string[] => {
    const messages: string[] = [];

    const extractMessages = (obj: unknown, path: string[] = []): void => {
      if (typeof obj === 'string') {
        messages.push(obj);
      } else if (obj && typeof obj === 'object') {
        if ('message' in obj && typeof obj.message === 'string') {
          messages.push(obj.message);
        } else {
          Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
            extractMessages(value, [...path, key]);
          });
        }
      }
    };

    extractMessages(errors);
    return messages;
  };

  const resetForm = (values?: T) => {
    reset(values);
  };

  return {
    ...form,
    hasErrors,
    getErrorMessages,
    clearErrors,
    isDirty,
    isValid,
    resetForm,
  };
}
