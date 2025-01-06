import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { userId, password } = await req.json();

    const response = await fetch(`http://backend:4000/admin/update/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update password: ${errorData.error}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}