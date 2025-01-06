import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    console.log("Token update user", token);
    if (!token) {
      return NextResponse.json({ error: 'Authorization token missing' }, { status: 401 });
    }

    const { userId } = await req.json();

    const response = await fetch(`http://backend:4000/admin/delete/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete user: ${errorData.error}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
