import { NextRequest, NextResponse } from "next/server";

import { TransactionService } from "@bytebank/lib/services/transaction-service";
import { handleResponseError } from "@fiap-tech-challenge/services/http";
import { queries } from "@bytebank/lib/database/queries";

const service = new TransactionService(queries);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const params: Record<string, string> = {};

    for (const [key, value] of searchParams) {
      params[key] = value;
    }

    const transactions = await service.getAll(params);
    return NextResponse.json(transactions);
  } catch (err) {
    return handleResponseError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const transaction = await service.create(data);
    return NextResponse.json(transaction);
  } catch (err) {
    return handleResponseError(err);
  }
}
