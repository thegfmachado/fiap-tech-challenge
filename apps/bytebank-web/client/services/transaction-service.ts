import { HTTPService } from "./http-service";

import type { ITransactionService } from "./transaction-service.interface";
import { ITransaction } from "@bytebank/shared/models/transaction.interface";
import { toast } from "@fiap-tech-challenge/design-system/components";

export class TransactionService implements ITransactionService {
  constructor(private readonly httpService: HTTPService) { }

  async getAll(params?: Record<string, string | number>): Promise<ITransaction[]> {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';

    return this.httpService.get(`/api/transactions${queryString}`);
  }


  async create(transaction: ITransaction): Promise<ITransaction> {
    try {
      const data = await this.httpService.post("/api/transactions", transaction);
      toast.success("Transação criada com sucesso")

      return data as ITransaction;
    }
    catch (err) {
      toast("Erro ao criar transação")
      throw err;
    }
    
  }

  async update(id: string, updates: Partial<ITransaction>): Promise<ITransaction> {
    try {
      const data = await this.httpService.patch(`/api/transactions/${id}`, updates);
      toast.success("Transação atualizada com sucesso")

      return data as ITransaction;
    }
    catch (err) {
      toast.error("Erro ao editar transação")
      throw err;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.httpService.delete(`/api/transactions/${id}`);
      toast.success("Transação deletada com sucesso")
    }
    catch (err) {
      toast.error("Erro ao deletar transação")
      throw err;
    }
  }
}
