import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sizes } from '@/constants/Colors';

/**
 * Propriedades do ErrorBoundary
 */
interface ErrorBoundaryProps {
  /** Componentes filhos a serem renderizados */
  children: ReactNode;
  
  /** Callback opcional quando erro ocorre */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  
  /** Fallback UI customizado */
  fallback?: ReactNode;
  
  /** Se deve mostrar detalhes do erro (apenas em desenvolvimento) */
  showErrorDetails?: boolean;
  
  /** Título customizado para o erro */
  errorTitle?: string;
  
  /** Mensagem customizada para o erro */
  errorMessage?: string;
}

/**
 * Estado do ErrorBoundary
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary para capturar e tratar erros em componentes React
 * 
 * Componente que intercepta erros JavaScript em qualquer lugar da árvore
 * de componentes filhos e exibe uma UI de fallback em vez de quebrar
 * toda a aplicação.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary
 *   onError={(error, errorInfo) => logError(error, errorInfo)}
 *   errorTitle="Ops! Algo deu errado"
 *   errorMessage="Tente novamente ou contate o suporte"
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Método estático chamado quando um erro é capturado
   * 
   * @param error - O erro capturado
   * @returns Novo estado com informações do erro
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Método chamado quando um erro é capturado
   * Usado para logging e side effects
   * 
   * @param error - O erro capturado
   * @param errorInfo - Informações adicionais do erro
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    console.error('🔴 ErrorBoundary capturou um erro:', error);
    console.error('📍 Stack trace:', errorInfo.componentStack);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Resetar o estado do error boundary
   */
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Renderizar UI de fallback ou componentes normais
   */
  render() {
    const { 
      children, 
      fallback, 
      showErrorDetails = __DEV__, 
      errorTitle = "Ops! Algo deu errado",
      errorMessage = "Ocorreu um erro inesperado. Tente novamente."
    } = this.props;
    
    const { hasError, error, errorInfo } = this.state;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <View className="flex-1 items-center justify-center p-6 bg-white">
          <View className="items-center justify-center mb-6" style={{ width: 80, height: 80 }}>
            <Ionicons 
              name="warning-outline" 
              size={Sizes.iconLarge} 
              color={Colors.light.danger} 
            />
          </View>

          <Text className="text-xl font-bold text-gray-900 text-center mb-4">
            {errorTitle}
          </Text>

          <Text className="text-sm text-gray-900 text-center mb-6 text-gray-600">
            {errorMessage}
          </Text>

          {showErrorDetails && error && (
            <View className="w-full mb-6 p-4 bg-gray-100 rounded-lg">
              <Text className="text-xs text-gray-600 font-mono text-red-600">
                {error.toString()}
              </Text>
              {errorInfo && (
                <Text className="text-xs text-gray-600 font-mono text-gray-500 mt-2">
                  {errorInfo.componentStack}
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity
            onPress={this.resetError}
            className="rounded-lg py-3 px-4 items-center justify-center bg-primary px-8"
            style={{ backgroundColor: Colors.light.primaryLight }}
          >
            <Text className="font-semibold text-center text-base text-white">
              Tentar Novamente
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return children;
  }
}

/**
 * HOC para envolver componentes com ErrorBoundary
 * 
 * @param Component - Componente a ser envolvido
 * @param errorBoundaryProps - Props do ErrorBoundary
 * @returns Componente envolvido com ErrorBoundary
 * 
 * @example
 * ```tsx
 * const SafeTransactionsList = withErrorBoundary(TransactionsList, {
 *   errorTitle: "Erro ao carregar transações",
 *   errorMessage: "Não foi possível carregar as transações. Tente novamente."
 * });
 * ```
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;