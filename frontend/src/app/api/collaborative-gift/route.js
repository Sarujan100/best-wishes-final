export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch('http://localhost:5000/api/collaborative-gift', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data.data || data, { status: res.status });
  } catch (error) {
    console.error('POST /api/collaborative-gift error:', error);
    return Response.json({ error: 'Failed to create collaborative gift' }, { status: 500 });
  }
} 