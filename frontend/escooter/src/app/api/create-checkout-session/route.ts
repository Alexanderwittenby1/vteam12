// app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    console.log('Request body from frontend:', items);  

    const response = await fetch('http://backend:4000/user/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create checkout session: ${errorData.error}`);
    }

    const data = await response.json();
    console.log('Session data:', data); // Logga Stripe sessiondata för debugging
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
