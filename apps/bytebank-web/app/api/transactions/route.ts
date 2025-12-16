import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import { createTransactionService } from "@bytebank/lib/services/transaction-service.factory";

import { handleResponseError } from "@fiap-tech-challenge/services/http";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const params: Record<string, string> = {};

    for (const [key, value] of searchParams) {
      params[key] = value;
    }

    const service = await createTransactionService();
    const transactions = await service.getAll(params);
    return NextResponse.json(transactions);
  } catch (err) {
    return handleResponseError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const service = await createTransactionService();
    const transaction = await service.create(data);
    return NextResponse.json(transaction);
  } catch (err) {
    return handleResponseError(err);
  }
}
