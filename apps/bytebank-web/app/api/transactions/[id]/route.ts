import { RouteParams } from "@/app/shared/models/route-params.interface.js";
import { NextRequest } from "next/server";

const JSON_SERVER_URL = 'http://localhost:3005/transactions';

export async function GET(req: NextRequest, { params }: { params: RouteParams }) {
  const { id } = params;
  const response = await fetch(`${JSON_SERVER_URL}/${id}`);

  if (!response.ok) {
    return new Response('Transação não encontrada', { status: 404 });
  }

  const data = await response.json();
  return Response.json(data);
}