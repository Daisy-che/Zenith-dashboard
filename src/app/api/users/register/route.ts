
import { NextRequest, NextResponse } from 'next/server';
const baseUrl = process.env.BASE_URL;
export async function POST(request: NextRequest) {
  if (!baseUrl) {
    console.error('BASE_URL environment variable is not set.');
    return NextResponse.json(
      { error: 'BASE_URL environment variable is not set.' },
      { status: 500 }
    );
  }
  try {
    const { first_name, last_name, phone_number, email, password,role } = await request.json();
    const response = await fetch(`${baseUrl}/api/users/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ first_name, last_name, phone_number, email, password,role }),
    });
    const textResponse = await response.text();
    console.log('Backend response:', textResponse, 'Status:', response.status);
    
    if (!response.ok) {
      const errorData = textResponse;
      return NextResponse.json(
        { error: errorData || 'Register failed. Invalid credentials.' },
        { status: response.status }
      );
    }
    const result = JSON.parse(textResponse);
    return NextResponse.json(result, { status: 200 });
  } 
  
  catch (error) {
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.'+ (error as Error).message },
      { status: 500 }
    );
  }
}
 








