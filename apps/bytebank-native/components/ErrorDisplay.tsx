import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sizes } from '@/constants/Colors';

/**
 * Tipos de erro para diferentes contextos
 */
export type ErrorType = 'network' | 'validation' | 'server' | 'notFound' | 'permission' | 'unknown';

/**
 * Propriedades do componente ErrorDisplay
 */
export interface ErrorDisplayProps {
  /** Tipo do erro (afeta ícone e cores) */
  type?: ErrorType;
  
  /** Título do erro */
  title?: string;
  
  /** Mensagem detalhada do erro */
  message?: string;
  
  /** Se deve mostrar botão de retry */
  showRetry?: boolean;
  
  /** Callback para retry */
  onRetry?: () => void;
  
  /** Texto do botão de retry */
  retryText?: string;
  
  /** Se deve mostrar o erro em tamanho compacto */
  compact?: boolean;
  
  /** Props adicionais para o container */
  containerProps?: any;
}

/**
 * Configurações padrão para cada tipo de erro
 */
const errorConfigs: Record<ErrorType, {
  icon: string;
  color: string;
  defaultTitle: string;
  defaultMessage: string;
}> = {
  network: {
    icon: 'wifi-outline',
    color: Colors.light.danger,
    defaultTitle: 'Erro de Conexão',
    defaultMessage: 'Verifique sua conexão com a internet e tente novamente.',
  },
  validation: {
    icon: 'alert-circle-outline',
    color: Colors.light.warning,
    defaultTitle: 'Dados Inválidos',
    defaultMessage: 'Por favor, verifique os dados inseridos e tente novamente.',
  },
  server: {
    icon: 'server-outline',
    color: Colors.light.danger,
    defaultTitle: 'Erro do Servidor',
    defaultMessage: 'Nossos servidores estão com problema. Tente novamente em alguns minutos.',
  },
  notFound: {
    icon: 'search-outline',
    color: Colors.light.info,
    defaultTitle: 'Não Encontrado',
    defaultMessage: 'O conteúdo que você está procurando não foi encontrado.',
  },
  permission: {
    icon: 'lock-closed-outline',
    color: Colors.light.warning,
    defaultTitle: 'Acesso Negado',
    defaultMessage: 'Você não tem permissão para acessar este conteúdo.',
  },
  unknown: {
    icon: 'warning-outline',
    color: Colors.light.danger,
    defaultTitle: 'Erro Inesperado',
    defaultMessage: 'Ocorreu um erro inesperado. Tente novamente.',
  },
};

/**
 * Componente para exibir diferentes tipos de erro com UI consistente
 * 
 * Fornece uma interface unificada para mostrar erros de diferentes tipos,
 * com ícones apropriados, mensagens padronizadas e opções de retry.
 * 
 * @param {ErrorDisplayProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente de exibição de erro
 * 
 * @example
 * ```tsx
 * // Erro de rede simples
 * <ErrorDisplay
 *   type="network"
 *   onRetry={() => refetch()}
 * />
 * 
 * // Erro customizado
 * <ErrorDisplay
 *   type="server"
 *   title="Falha ao carregar transações"
 *   message="Não foi possível carregar suas transações. Tente novamente."
 *   retryText="Recarregar"
 *   onRetry={() => fetchTransactions()}
 * />
 * 
 * // Modo compacto
 * <ErrorDisplay
 *   type="validation"
 *   compact
 *   message="Email inválido"
 * />
 * ```
 */
export function ErrorDisplay({
  type = 'unknown',
  title,
  message,
  showRetry = true,
  onRetry,
  retryText = 'Tentar Novamente',
  compact = false,
  containerProps,
}: ErrorDisplayProps) {
  const config = errorConfigs[type];
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  if (compact) {
    return (
      <View
        className="flex-row items-center p-4 bg-red-50 rounded-lg border border-red-200"
        {...containerProps}
      >
        <Ionicons
          name={config.icon as any}
          size={Sizes.iconMedium}
          color={config.color}
          style={{ marginRight: 12 }}
        />
        <View className="flex-1">
          <Text className="text-xs text-gray-600 text-red-600">
            {displayMessage}
          </Text>
        </View>
        {showRetry && onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            className="ml-3 rounded-lg py-3 px-4 items-center justify-center bg-red-100 px-3 py-1"
          >
            <Text className="text-xs text-gray-600 text-red-700 font-medium">
              Repetir
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View
      className="flex-1 items-center justify-center p-6"
      {...containerProps}
    >
      <View className="items-center justify-center mb-4" style={{ width: 64, height: 64 }}>
        <Ionicons
          name={config.icon as any}
          size={Sizes.iconLarge}
          color={config.color}
        />
      </View>

      <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
        {displayTitle}
      </Text>

      <Text className="text-sm text-gray-900 text-center mb-6 text-gray-600 max-w-sm">
        {displayMessage}
      </Text>

      {showRetry && onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="rounded-lg py-3 px-4 items-center justify-center px-6"
          style={{ backgroundColor: config.color }}
        >
          <Text className="font-semibold text-center text-base text-white">
            {retryText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/**
 * Hook para gerenciar estado de erro
 * 
 * @returns Objeto com estado e funções de erro
 * 
 * @example
 * ```tsx
 * const { error, setError, clearError, showError } = useErrorState();
 * 
 * // Mostrar erro
 * const handleError = (err: Error) => {
 *   setError({
 *     type: 'network',
 *     message: err.message
 *   });
 * };
 * 
 * // Renderizar erro
 * if (error) {
 *   return (
 *     <ErrorDisplay
 *       {...error}
 *       onRetry={clearError}
 *     />
 *   );
 * }
 * ```
 */
export function useErrorState() {
  const [error, setErrorState] = React.useState<{
    type: ErrorType;
    title?: string;
    message?: string;
  } | null>(null);

  const setError = React.useCallback((errorConfig: {
    type: ErrorType;
    title?: string;
    message?: string;
  }) => {
    setErrorState(errorConfig);
  }, []);

  const clearError = React.useCallback(() => {
    setErrorState(null);
  }, []);

  const showError = React.useCallback((error: Error, type: ErrorType = 'unknown') => {
    setError({
      type,
      message: error.message,
    });
  }, [setError]);

  return {
    error,
    setError,
    clearError,
    showError,
    hasError: error !== null,
  };
}

export default ErrorDisplay;