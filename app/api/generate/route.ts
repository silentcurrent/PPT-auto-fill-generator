import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  console.log("[API] Received POST request to /api/generate");
  
  try {
    const formData = await request.formData();
    console.log("[API] FormData parsed successfully");

    const template = formData.get("template") as File | null;
    const excel = formData.get("excel") as File | null;

    console.log("[API] Files received:", {
      template: template ? `${template.name} (${template.size} bytes)` : "null",
      excel: excel ? `${excel.name} (${excel.size} bytes)` : "null"
    });

    if (!template || !excel) {
      console.log("[API] Missing files, returning 400");
      return NextResponse.json(
        { error: "Both template (.pptx) and excel (.xlsx) files are required." },
        { status: 400 }
      );
    }

    // Forward the files to the Python backend
    console.log(`[API] Forwarding to backend: ${BACKEND_URL}/generate`);
    const backendFormData = new FormData();
    backendFormData.append("template", template);
    backendFormData.append("excel", excel);

    const response = await fetch(`${BACKEND_URL}/generate`, {
      method: "POST",
      body: backendFormData,
    });

    console.log(`[API] Backend response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API] Backend error:", errorText);
      return NextResponse.json(
        { error: `Backend error: ${errorText}` },
        { status: response.status }
      );
    }

    // Stream the generated PPTX back to the client
    console.log("[API] Converting response to blob");
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    console.log(`[API] Sending PPTX file (${arrayBuffer.byteLength} bytes)`);

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": 'attachment; filename="generated.pptx"',
      },
    });
  } catch (error) {
    console.error("[API] Error occurred:", error);
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
