import { useForm, UseFormReturn, FieldValues, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * Opções de configuração para validação de formulário
 */
export interface UseFormValidationOptions<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
  /** Se deve resetar o formulário em caso de submissão bem-sucedida */
  resetOnSuccess?: boolean;
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
  resetForm: (values?: Partial<T>) => void;
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
 * const loginSchema = z.object({
 *   email: z.string().email('Email inválido'),
 *   password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
 * });
 * 
 * const form = useFormValidation(loginSchema, {
 *   defaultValues: { email: '', password: '' },
 *   resetOnSuccess: true,
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
    resetOnSuccess = false,
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
    clearErrors: clearFormErrors,
  } = form;

  const hasErrors = Object.keys(errors).length > 0;

  const getErrorMessages = (): string[] => {
    const messages: string[] = [];
    
    const extractMessages = (obj: any, path: string[] = []): void => {
      if (typeof obj === 'string') {
        messages.push(obj);
      } else if (obj && typeof obj === 'object') {
        if (obj.message && typeof obj.message === 'string') {
          messages.push(obj.message);
        } else {
          Object.entries(obj).forEach(([key, value]) => {
            extractMessages(value, [...path, key]);
          });
        }
      }
    };

    extractMessages(errors);
    return messages;
  };

  const clearErrors = () => {
    clearFormErrors();
  };

  const resetForm = (values?: Partial<T>) => {
    if (values) {
      reset(values as T);
    } else {
      reset();
    }
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

/**
 * Esquemas de validação comuns que podem ser reutilizados em toda a aplicação
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
  positiveNumber: z.number().min(0.01, 'Valor deve ser maior que 0'),
  
  /** Validação de data obrigatória */
  requiredDate: z.date({ required_error: 'Este campo é obrigatório' }),
  
  /** Validação de confirmação de senha que corresponde a outro campo de senha */
  confirmPassword: (passwordField: string = 'password') => 
    z.string({ required_error: 'Este campo é obrigatório' }).min(6, 'A senha deve ter pelo menos 6 caracteres'),
} as const;

/**
 * Criar um schema de confirmação de senha
 * @param baseSchema Schema base contendo password e confirmPassword
 * @returns Schema refinado com validação de correspondência de senhas
 */
export const createPasswordConfirmationSchema = <T extends { password: string; confirmPassword: string }>(
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

/**
 * Schemas pré-construídos para formulários comuns
 */
export const formSchemas = {
  /** Schema de formulário de login */
  login: z.object({
    email: commonValidations.email,
    password: commonValidations.password,
  }),

  /** Schema básico de formulário de cadastro (sem confirmação de senha) */
  signup: z.object({
    name: commonValidations.name,
    email: commonValidations.email,
    password: commonValidations.password,
    confirmPassword: commonValidations.confirmPassword(),
  }),

  /** Schema de formulário de transação */
  transaction: z.object({
    id: z.string(),
    type: z.enum(['credit', 'debit'] as const),
    description: commonValidations.requiredString('Este campo é obrigatório'),
    value: commonValidations.positiveNumber,
    date: commonValidations.requiredDate,
  }),
} as const;