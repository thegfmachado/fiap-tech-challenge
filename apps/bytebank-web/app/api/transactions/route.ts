const JSON_SERVER_URL = 'http://localhost:3005/transactions';

export async function GET() {
  const response = await fetch(JSON_SERVER_URL);

  if (!response.ok) {
    return new Response('Error fetching transactions', { status: 500 });
  }

  const data = await response.json();
  return Response.json(data);
}

export async function POST(params: Request) {
  const body = await params.json();

  const response = await fetch(JSON_SERVER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return new Response('Error creating new transaction', { status: 500 });
  }

  const data = await response.json();
  return Response.json(data);
}