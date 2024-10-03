import { NextResponse } from 'next/server';

const API_URL = `${process.env.BASE_URL}/api/notifications/`;

export async function GET() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
