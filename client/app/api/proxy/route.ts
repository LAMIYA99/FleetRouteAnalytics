import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetUrl, headers, method = 'GET' } = body;

    if (!targetUrl) {
      return NextResponse.json({ error: 'targetUrl is required' }, { status: 400 });
    }

    const res = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    const data = await res.text();
    
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = data;
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `API error: ${res.status}`, details: parsedData },
        { status: res.status }
      );
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
