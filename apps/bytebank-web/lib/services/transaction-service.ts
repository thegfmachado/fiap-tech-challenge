import { HttpError } from "../http-error";
import { ITransaction } from "@bytebank/shared/models/transaction.interface";
import { ITransactionService } from "./transaction-service.interface";

const BASE_URL = 'http://localhost:3005/account';

const getAuthToken = () =>
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IklzcmFlbCAyIiwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJwYXNzd29yZCI6InRlc3RlcyIsImlkIjoiNjg1MGE3MjlhZjFlZjQ1YTE5YjA0MjJmIiwiaWF0IjoxNzUwNDI5OTI1LCJleHAiOjE3NTA0NzMxMjV9.IdoSqhObDATIZa3P8fU38Yn92zie6ISrPMELia_W8GY';

export class TransactionService implements ITransactionService {
  async getAll(params?: Record<string, string | number>) {
    const queryString = params
      ? '?' + String(new URLSearchParams(params as Record<string, string>))
      : '';

    const response = await fetch(`${BASE_URL}/6850a729af1ef45a19b0422f/statement${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthToken()
      }
    });
    if (!response.ok) throw new HttpError(500, 'Error fetching transactions');
    const result = await response.json();
    return result.result.transactions;
  }

  async getById(id: string) {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new HttpError(404, 'Transaction not found');
    return response.json();
  }

  async create(data: Partial<ITransaction>) {
    const response = await fetch(`${BASE_URL}/transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthToken()
      },
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
