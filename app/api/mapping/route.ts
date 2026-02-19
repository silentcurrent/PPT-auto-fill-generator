import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/mapping`);
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to load mappings" },
        { status: response.status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Mapping GET error:", error);
    return NextResponse.json(
      {
        error:
          "Could not connect to the backend. Make sure the Python server is running on " +
          BACKEND_URL,
      },
      { status: 502 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/mapping`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to save mappings" },
        { status: response.status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Mapping PUT error:", error);
    return NextResponse.json(
      {
        error:
          "Could not connect to the backend. Make sure the Python server is running on " +
          BACKEND_URL,
      },
      { status: 502 }
    );
  }
}
