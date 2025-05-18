import { NextRequest, NextResponse } from "next/server";

import { TransactionService } from "@bytebank/lib/services/transaction-service";
import { handleResponseError } from "@bytebank/lib/utils/handle-response-error";

const service = new TransactionService();

export async function GET() {
  try {
    const transactions = await service.getAll();
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
