
import { RouteParams } from "app/shared/models/route-params.interface";
import { NextRequest } from "next/server";

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
