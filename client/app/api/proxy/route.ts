import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { targetUrl, headers, method = 'GET', body } = requestBody;

    if (!targetUrl) {
      return NextResponse.json({ error: 'targetUrl is required' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    let res: Response;
    try {
      res = await fetch(targetUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: method !== 'GET' ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch (fetchErr: any) {
      if (fetchErr.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timed out after 15 seconds. The upstream API is not responding.' },
          { status: 504 }
        );
      }
      throw fetchErr;
    } finally {
      clearTimeout(timeoutId);
    }

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
