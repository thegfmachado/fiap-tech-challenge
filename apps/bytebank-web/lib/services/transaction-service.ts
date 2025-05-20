import { HttpError } from "../http-error";
import { ITransaction } from "@bytebank/shared/models/transaction.interface";
import { ITransactionService } from "./transaction-service.interface";

const BASE_URL = 'http://localhost:3005/transactions';

export class TransactionService implements ITransactionService {
  async getAll(params?: Record<string, string | number>) {
    const queryString = params
      ? '?' + String(new URLSearchParams(params as Record<string, string>))
      : '';

    const response = await fetch(`${BASE_URL}${queryString}`);
    if (!response.ok) throw new HttpError(500, 'Error fetching transactions');
    return response.json();
  }

  async getById(id: string) {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new HttpError(404, 'Transaction not found');
    return response.json();
  }

  async create(data: Partial<ITransaction>) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new HttpError(500, 'Error creating transaction');
    return response.json();
  }

  async update(id: string, data: Partial<ITransaction>) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new HttpError(500, 'Error updating transaction');
    return response.json();
  }

  async delete(id: string) {
    const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new HttpError(500, 'Error deleting transaction');
    return response.json();
  }
}
