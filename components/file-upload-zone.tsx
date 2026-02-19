"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  label: string;
  description: string;
  accept: string;
  icon: React.ReactNode;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function FileUploadZone({
  label,
  description,
  accept,
  icon,
  file,
  onFileChange,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // If parent clears `file` (e.g. Start Over), also clear the underlying
  // <input type="file"> so the user can re-select the same file.
  useEffect(() => {
    if (!file && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [file]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        onFileChange(droppedFile);
      }
    },
    [onFileChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null;
      onFileChange(selectedFile);
      // Allow selecting the same file again to trigger onChange.
      e.target.value = "";
    },
    [onFileChange]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onFileChange(null);
      if (inputRef.current) inputRef.current.value = "";
    },
    [onFileChange]
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : file
            ? "border-primary/40 bg-primary/5"
            : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label={`Upload ${label}`}
        />

        {file ? (
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary shrink-0">
              <CheckCircle2 className="size-6" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatSize(file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
              aria-label="Remove file"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center justify-center size-12 rounded-lg bg-muted text-muted-foreground">
              {icon}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                <span className="text-primary">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
