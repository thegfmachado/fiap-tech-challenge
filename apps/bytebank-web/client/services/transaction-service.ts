import { HTTPService } from "@fiap-tech-challenge/services";

import type { ITransactionService } from "./transaction-service.interface";
import type { ITransaction } from "@fiap-tech-challenge/database/types";
import { toast } from "@fiap-tech-challenge/design-system/components";
import { GetAllTransactionsResponse } from "@fiap-tech-challenge/database/queries";
import { IAttachment } from "@fiap-tech-challenge/services";

export class TransactionService implements ITransactionService {
  constructor(private readonly httpService: HTTPService) { }

  async getAll(params?: Record<string, unknown>): Promise<GetAllTransactionsResponse> {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';

    return this.httpService.get(`/api/transactions${queryString}`);
  }


  async create(transaction: ITransaction): Promise<ITransaction> {
    try {
      const data = await this.httpService.post<ITransaction>("/api/transactions", transaction);
      toast.success("Transação criada com sucesso")

      return data;
    }
    catch (err) {
      toast.error("Erro ao criar transação")
      throw err;
    }
  }

  async update(id: string, updates: Partial<ITransaction>): Promise<ITransaction> {
    try {
      const data = await this.httpService.patch<ITransaction>(`/api/transactions/${id}`, updates);
      toast.success("Transação atualizada com sucesso")

      return data;
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

  async uploadAttachment(transactionId: string, file: File): Promise<IAttachment> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const data = await this.httpService.postFormData<IAttachment>(
        `/api/transactions/${transactionId}/attachment`,
        formData
      );
      
      toast.success("Arquivo anexado com sucesso");
      return data;
    } catch (err) {
      toast.error("Erro ao anexar arquivo");
      throw err;
    }
  }

  async downloadAttachment(transactionId: string, fileName: string): Promise<Blob> {
    try {
      return await this.httpService.downloadFile(
        `/api/transactions/${transactionId}/download?fileName=${encodeURIComponent(fileName)}`
      );
    } catch (err) {
      toast.error("Erro ao baixar arquivo");
      throw err;
    }
  }

  async deleteAttachment(transactionId: string, fileName: string): Promise<void> {
    try {
      await this.httpService.delete(
        `/api/transactions/${transactionId}/attachment?fileName=${encodeURIComponent(fileName)}`
      );
      
      toast.success("Arquivo removido com sucesso");
    } catch (err) {
      toast.error("Erro ao remover arquivo");
      throw err;
    }
  }
}
