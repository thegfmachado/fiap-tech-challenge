const JSON_SERVER_URL = 'http://localhost:3005/transactions';

export async function GET(req, { params }) {
  const { id } = params;

  const response = await fetch(`${JSON_SERVER_URL}/${id}`);

  if (!response.ok) {
    return new Response('Item não encontrado', { status: 404 });
  }

  const data = await response.json();
  return Response.json(data);
}