import { NextRequest, NextResponse } from "next/server";

import { handleResponseError } from "@fiap-tech-challenge/services/http";
import { createTransactionService } from "@bytebank/lib/services/transaction-service.factory";

interface RouteParams {
  id: string;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  try {
    const { id } = await params;
    const service = await createTransactionService();
    const transaction = await service.getById(id);
    return NextResponse.json(transaction);
  } catch (err) {
    return handleResponseError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    if (!data || Object.keys(data).length === 0) {
      return new NextResponse('Invalid or empty update data', { status: 400 });
    }

    const service = await createTransactionService();
    const updated = await service.update(id, data);
    return NextResponse.json(updated);
  } catch (err) {
    return handleResponseError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  try {
    const { id } = await params;
    const service = await createTransactionService();
    await service.delete(id);
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    return handleResponseError(err);
  }
}
