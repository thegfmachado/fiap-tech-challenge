/**
 * Tipos TypeScript centralizados para melhor organização e reutilização
 * 
 * Este arquivo contém interfaces e tipos comuns usados em toda a aplicação,
 * organizados por domínio para facilitar importação e manutenção.
 */

// Re-exports dos tipos principais
export { type Transaction, type TransactionInput } from '../utils/transactionMapper';
export { type DateRange, type PaginationState, type FiltersState } from '../hooks/useTransactions';

/**
 * Estados de operação assíncrona
 */
export interface AsyncState<T = unknown> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
}

/**
 * Configurações básicas de paginação
 */
export interface PaginationConfig {
  /** Página atual (começando em 0) */
  page: number;
  /** Items por página */
  limit: number;
  /** Total de items (opcional) */
  total?: number;
}

/**
 * Configurações de filtro para listas
 */
export interface FilterConfig {
  /** Campo a ser filtrado */
  field: string;
  /** Valor do filtro */
  value: unknown;
  /** Operador de comparação */
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
}

/**
 * Resultado de uma operação CRUD
 */
export interface OperationResult<T = unknown> {
  /** Se a operação foi bem-sucedida */
  success: boolean;
  /** Dados retornados (se houver) */
  data?: T;
  /** Mensagem de erro (se houver) */
  error?: string;
  /** Código de status HTTP (se aplicável) */
  statusCode?: number;
}

/**
 * Configurações de modal
 */
export interface ModalConfig {
  /** Se o modal está visível */
  visible: boolean;
  /** Título do modal */
  title?: string;
  /** Se deve mostrar botão de fechar */
  closable?: boolean;
  /** Se deve fechar ao clicar fora */
  maskClosable?: boolean;
}

/**
 * Propriedades comuns para componentes de formulário
 */
export interface FormComponentProps {
  /** Se o campo está desabilitado */
  disabled?: boolean;
  /** Se o campo é obrigatório */
  required?: boolean;
  /** Texto de ajuda */
  helperText?: string;
  /** Mensagem de erro */
  error?: string;
  /** Se deve mostrar indicador de loading */
  loading?: boolean;
}

/**
 * Propriedades para componentes de lista
 */
export interface ListComponentProps<T = unknown> {
  /** Items da lista */
  items: T[];
  /** Se está carregando */
  loading?: boolean;
  /** Se há mais items para carregar */
  hasMore?: boolean;
  /** Callback para carregar mais items */
  onLoadMore?: () => void;
  /** Callback para refresh */
  onRefresh?: () => void;
  /** Se deve mostrar refresh control */
  refreshing?: boolean;
}

/**
 * Configurações de tema (cores, tamanhos, etc.)
 */
export interface ThemeConfig {
  /** Cores primárias */
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  /** Tamanhos de fonte */
  fontSizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  /** Espaçamentos */
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

/**
 * Configurações de API
 */
export interface ApiConfig {
  /** URL base da API */
  baseURL: string;
  /** Timeout em milissegundos */
  timeout: number;
  /** Headers padrão */
  headers: Record<string, string>;
}

/**
 * Propriedades para componentes de carregamento
 */
export interface LoadingProps {
  /** Se está carregando */
  loading: boolean;
  /** Texto de carregamento */
  text?: string;
  /** Tamanho do indicador */
  size?: 'small' | 'medium' | 'large';
  /** Se deve ocupar toda a tela */
  fullScreen?: boolean;
}

/**
 * Propriedades para componentes de erro
 */
export interface ErrorProps {
  /** Mensagem de erro */
  message: string;
  /** Título do erro */
  title?: string;
  /** Se deve mostrar botão de retry */
  showRetry?: boolean;
  /** Callback para retry */
  onRetry?: () => void;
  /** Tipo de erro */
  type?: 'network' | 'validation' | 'server' | 'unknown';
}

/**
 * Propriedades para navegação
 */
export interface NavigationProps {
  /** Função para navegar */
  navigate: (route: string, params?: Record<string, unknown>) => void;
  /** Função para voltar */
  goBack: () => void;
  /** Parâmetros da rota atual */
  params?: Record<string, unknown>;
}