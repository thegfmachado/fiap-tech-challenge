import type { ITransaction } from '@fiap-tech-challenge/database/types';
import { TransactionType } from '@fiap-tech-challenge/models';

/**
 * Representa uma transação otimizada para uso na UI
 * 
 * @interface Transaction
 * @property {string} id - Identificador único da transação
 * @property {string} description - Descrição da transação
 * @property {string} date - Data da transação no formato ISO string
 * @property {number} value - Valor da transação (positivo para crédito, negativo para débito)
 * @property {TransactionType} type - Tipo da transação (CREDIT ou DEBIT)
 * @property {string | null} [attachment_name] - Nome do arquivo anexado (opcional)
 * @property {string | null} [attachment_url] - URL do arquivo anexado (opcional)
 */
export interface Transaction {
  id: string;
  description: string;
  date: string;
  value: number;
  type: TransactionType;
  attachment_name?: string | null;
  attachment_url?: string | null;
}

/**
 * Representa uma transação com propriedades opcionais mais flexíveis
 * Usado para criação e edição de transações
 * 
 * @interface TransactionInput
 */
export interface TransactionInput {
  id?: string;
  description: string;
  date: string;
  value: number;
  type: TransactionType;
  attachment_name?: string | null;
  attachment_url?: string | null;
}

/**
 * Mapeia ITransaction (formato do banco de dados) para Transaction (formato da UI)
 * 
 * Esta função converte transações vindas do banco de dados para o formato
 * otimizado usado na interface do usuário, garantindo type safety.
 * 
 * @param {ITransaction} transaction - Transação no formato do banco de dados
 * @returns {Transaction} Transação no formato otimizado para a UI
 * 
 * @example
 * ```typescript
 * const dbTransaction: ITransaction = {
 *   id: '123',
 *   description: 'Pagamento',
 *   date: '2023-10-01',
 *   value: 100,
 *   type: 'DEBIT',
 *   attachment_name: null,
 *   attachment_url: null
 * };
 * 
 * const uiTransaction = mapITransactionToTransaction(dbTransaction);
 * ```
 */
export const mapITransactionToTransaction = (transaction: ITransaction): Transaction => {
  if (!transaction) {
    throw new Error('Transaction is required');
  }
  
  return {
    id: transaction.id,
    description: transaction.description,
    date: transaction.date,
    value: transaction.value,
    type: transaction.type as TransactionType,
    attachment_name: transaction.attachment_name ?? null,
    attachment_url: transaction.attachment_url ?? null,
  };
};

/**
 * Mapeia Transaction (formato da UI) para ITransaction (formato do banco de dados)
 * 
 * Esta função converte transações do formato da UI para o formato
 * esperado pelo banco de dados, normalizando os campos opcionais.
 * 
 * @param {Transaction | TransactionInput} transaction - Transação no formato da UI
 * @returns {ITransaction} Transação no formato do banco de dados
 * 
 * @example
 * ```typescript
 * const uiTransaction: Transaction = {
 *   id: '123',
 *   description: 'Pagamento',
 *   date: '2023-10-01',
 *   value: 100,
 *   type: TransactionType.DEBIT,
 *   attachment_name: undefined,
 *   attachment_url: undefined
 * };
 * 
 * const dbTransaction = mapTransactionToITransaction(uiTransaction);
 * ```
 */
export const mapTransactionToITransaction = (transaction: Transaction | TransactionInput): ITransaction => {
  if (!transaction) {
    throw new Error('Transaction is required');
  }
  
  return {
    id: transaction.id || '',
    description: transaction.description,
    date: transaction.date,
    value: transaction.value,
    type: transaction.type as string,
    attachment_name: transaction.attachment_name ?? null,
    attachment_url: transaction.attachment_url ?? null,
  };
};

/**
 * Mapeia array de ITransaction para array de Transaction
 * 
 * @param transactions - Array de transações do banco
 * @returns Array de transações para a UI
 */
export const mapITransactionArrayToTransactionArray = (transactions: ITransaction[]): Transaction[] => 
  transactions.map(mapITransactionToTransaction);