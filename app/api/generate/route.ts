import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

/**
 * Fetch with retry to handle Render free-tier cold start.
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2,
  delayMs = 8000
) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`[API] Attempt ${attempt + 1} to backend...`);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000); // 45s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Backend responded with ${response.status}: ${errorText}`
        );
      }

      return response;
    } catch (error) {
      console.error(`[API] Attempt ${attempt + 1} failed`, error);

      if (attempt === retries) {
        throw error;
      }

      console.log(`[API] Waiting ${delayMs / 1000}s before retry...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error("Unexpected fetch failure");
}

export async function POST(request: NextRequest) {
  console.log("[API] Received POST request to /api/generate");

  try {
    const formData = await request.formData();
    console.log("[API] FormData parsed successfully");

    const template = formData.get("template") as File | null;
    const excel = formData.get("excel") as File | null;

    console.log("[API] Files received:", {
      template: template
        ? `${template.name} (${template.size} bytes)`
        : "null",
      excel: excel ? `${excel.name} (${excel.size} bytes)` : "null",
    });

    if (!template || !excel) {
      console.log("[API] Missing files, returning 400");
      return NextResponse.json(
        {
          error:
            "Both template (.pptx) and excel (.xlsx) files are required.",
        },
        { status: 400 }
      );
    }

    console.log(`[API] Forwarding to backend: ${BACKEND_URL}/generate`);

    const backendFormData = new FormData();
    backendFormData.append("template", template);
    backendFormData.append("excel", excel);

    // 🔥 Cold start safe call
    const response = await fetchWithRetry(
      `${BACKEND_URL}/generate`,
      {
        method: "POST",
        body: backendFormData,
      },
      2, // number of retries
      8000 // 8 seconds between retries
    );

    console.log(`[API] Backend response OK`);

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    console.log(
      `[API] Sending PPTX file (${arrayBuffer.byteLength} bytes)`
    );

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition":
          'attachment; filename="generated.pptx"',
      },
    });
  } catch (error) {
    console.error("[API] Final failure:", error);

    return NextResponse.json(
      {
        error:
          "Backend is waking up. Please wait a few seconds and try again.",
      },
      { status: 502 }
    );
  }
}
