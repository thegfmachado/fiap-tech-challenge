import { NextRequest, NextResponse } from "next/server";

import { TransactionService } from "@bytebank/lib/services/transaction-service";
import { handleResponseError } from "@fiap-tech-challenge/services/http";

const service = new TransactionService();

interface RouteParams {
  id: string;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  try {
    const { id } = await params;
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

    const updated = await service.update(id, data);
    return NextResponse.json(updated);
  } catch (err) {
    return handleResponseError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  try {
    const { id } = await params;
    await service.delete(id);
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    return handleResponseError(err);
  }
}
