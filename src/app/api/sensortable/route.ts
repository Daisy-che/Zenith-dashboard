import { NextResponse } from 'next/server';

const baseURL = process.env.BASE_URL;
const ERROR_MESSAGE = 'Failed to fetch water level and water pressure';

export async function GET() {
  try {
    const response = await fetch(`${baseURL}/api/devices/`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: ERROR_MESSAGE },
      { status: 500 }
    );
  }
}

