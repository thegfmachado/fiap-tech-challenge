import { RouteParams } from "app/shared/models/route-params.interface";
import { Transaction } from "app/shared/models/transaction.interface";
import { NextRequest, NextResponse } from "next/server";

const JSON_SERVER_URL = 'http://localhost:3005/transactions';

export async function GET(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const response = await fetch(`${JSON_SERVER_URL}/${id}`);

  if (!response.ok) {
    return new Response('Transaction not found', { status: 404 });
  }

  const data = await response.json();
  return Response.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  try {
    const { id } = await params;
    const body: Partial<Transaction> = await req.json();


    if (!body || Object.keys(body).length === 0) {
      return new NextResponse('Invalid or empty update data', { status: 400 });
    }

    const response = await fetch(`${JSON_SERVER_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return new NextResponse('Failed to update transaction', { status: response.status });
    }

    const updatedData: Transaction = await response.json();
    return NextResponse.json(updatedData);
  } catch (error) {
    return new NextResponse('Error updating transaction', { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const { id } = await params;

  const response = await fetch(`${JSON_SERVER_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    return new Response('Error deleting transaction', { status: 500 });
  }

  return new Response('Transaction deleted successfully', { status: 200 });
}
