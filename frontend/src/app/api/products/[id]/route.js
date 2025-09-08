export async function GET(request, context) {
  const params = await context.params;
  const { id } = params;
  try {
    const res = await fetch(`http://localhost:5000/api/products/${id}`);
    const data = await res.json();
    return Response.json(data.data || data);
  } catch (error) {
    console.error("Error fetching product:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const productData = await request.json();

    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await res.json();
    return Response.json(data.data || data);
  } catch (error) {
    console.error("PUT error:", error);
    return Response.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("DELETE error:", error);
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
} 