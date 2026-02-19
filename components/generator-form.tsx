"use client";

import { useState, useCallback } from "react";
import { FileText, Table, Download, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileUploadZone } from "@/components/file-upload-zone";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

export function GeneratorForm() {
  const [template, setTemplate] = useState<File | null>(null);
  const [excel, setExcel] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!template || !excel) return;

    console.log("[Frontend] Starting generation...");
    console.log("[Frontend] Files:", { template: template.name, excel: excel.name });

    setError(null);
    setStatus("uploading");
    setProgress(20);

    try {
      const formData = new FormData();
      formData.append("template", template);
      formData.append("excel", excel);

      console.log("[Frontend] Sending request to /api/generate");
      setStatus("processing");
      setProgress(50);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      console.log(`[Frontend] Response status: ${response.status}`);
      setProgress(80);

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        console.error("[Frontend] Error response:", errData);
        throw new Error(
          errData?.error || `Server error: ${response.status}`
        );
      }

      setProgress(100);
      setStatus("done");
      console.log("[Frontend] Generation successful, downloading file...");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated.pptx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      console.log("[Frontend] File downloaded successfully");
    } catch (err) {
      console.error("[Frontend] Error:", err);
      setStatus("error");
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setProgress(0);
    }
  }, [template, excel]);

  const handleReset = useCallback(() => {
    setTemplate(null);
    setExcel(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
  }, []);

  const canGenerate = template && excel && status !== "uploading" && status !== "processing";

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUploadZone
          label="Template PPTX"
          description=".pptx file with [placeholder] tags"
          accept=".pptx"
          icon={<FileText className="size-6" />}
          file={template}
          onFileChange={setTemplate}
        />
        <FileUploadZone
          label="Excel Data"
          description=".xlsx file with matching column headers"
          accept=".xlsx,.xls"
          icon={<Table className="size-6" />}
          file={excel}
          onFileChange={setExcel}
        />
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-destructive">
              Generation failed
            </p>
            <p className="text-xs text-destructive/80">{error}</p>
          </div>
        </div>
      )}

      {(status === "uploading" || status === "processing") && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              {status === "uploading"
                ? "Uploading files..."
                : "Processing presentation..."}
            </p>
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {status === "done" && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <Download className="size-5 text-primary shrink-0" />
          <p className="text-sm font-medium text-primary">
            Your presentation has been generated and downloaded.
          </p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="gap-2"
        >
          {status === "uploading" || status === "processing" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="size-4" />
              Generate PPT
            </>
          )}
        </Button>

        {status === "done" || status === "error" ? (
          <Button variant="outline" size="lg" onClick={handleReset}>
            Start Over
          </Button>
        ) : null}
      </div>
    </div>
  );
}
