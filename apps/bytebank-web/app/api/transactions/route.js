const JSON_SERVER_URL = 'http://localhost:3001/items';

export async function GET() {
  const response = await fetch(JSON_SERVER_URL);

  if (!response.ok) {
    return new Response('Erro ao buscar itens', { status: 500 });
  }

  const data = await response.json();
  console.log('get todas as transações', data);
  return Response.json(data);
}

export async function POST(params) {
  const body = await params.json();

  const response = await fetch(JSON_SERVER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return new Response('Erro ao criar item', { status: 500 });
  }

  const data = await response.json();
  console.log('criado:', data);
  return Response.json(data);
}