"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Presentation, Link2, Trash2, Plus, Save, Loader2, ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Mapping = { pptPlaceholder: string; excelColumn: string };

export default function MappingsPage() {
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPpt, setNewPpt] = useState("");
  const [newExcel, setNewExcel] = useState("");
  const [edited, setEdited] = useState<Record<number, Partial<Mapping>>>({});

  const fetchMappings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mapping");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setMappings(data.mappings || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load mappings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  const handleSave = async () => {
    const merged = mappings.map((m, i) => ({ ...m, ...edited[i] }));
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/mapping", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mappings: merged }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setMappings(merged);
      setEdited({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    const ppt = newPpt.trim();
    const excel = newExcel.trim();
    if (!ppt || !excel) return;
    const formattedPpt = ppt.startsWith("[") ? ppt : `[${ppt}]`;
    setMappings((prev) => [...prev, { pptPlaceholder: formattedPpt, excelColumn: excel }]);
    setNewPpt("");
    setNewExcel("");
  };

  const handleDelete = (index: number) => {
    setMappings((prev) => prev.filter((_, i) => i !== index));
    const next: Record<number, Partial<Mapping>> = {};
    Object.entries(edited).forEach(([k, v]) => {
      const i = Number(k);
      if (i < index) next[i] = v;
      else if (i > index) next[i - 1] = v;
    });
    setEdited(next);
  };

  const handleEdit = (index: number, field: keyof Mapping, value: string) => {
    setEdited((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: value },
    }));
  };

  const currentMappings = mappings.map((m, i) => ({ ...m, ...edited[i] }));

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Back to home"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <Header />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="size-5" />
                Placeholder Mappings
              </CardTitle>
              <CardDescription>
                Map PPT placeholders (e.g. [candidate_name]) to Excel column names.
                When the placeholder name matches the Excel column exactly, no entry
                is needed—it works automatically. Add custom mappings when names differ.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="size-8 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="overflow-hidden rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>PPT Placeholder</TableHead>
                          <TableHead>Excel Column</TableHead>
                          <TableHead className="w-12" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentMappings.map((m, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Input
                                value={m.pptPlaceholder ?? ""}
                                onChange={(e) =>
                                  handleEdit(i, "pptPlaceholder", e.target.value)
                                }
                                placeholder="[placeholder]"
                                className="font-mono text-sm"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={m.excelColumn ?? ""}
                                onChange={(e) =>
                                  handleEdit(i, "excelColumn", e.target.value)
                                }
                                placeholder="column_name"
                                className="font-mono text-sm"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleDelete(i)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex flex-wrap items-end gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Add new mapping
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={newPpt}
                          onChange={(e) => setNewPpt(e.target.value)}
                          placeholder="[new_placeholder]"
                          className="font-mono w-48"
                          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        />
                        <span className="flex items-center text-muted-foreground">→</span>
                        <Input
                          value={newExcel}
                          onChange={(e) => setNewExcel(e.target.value)}
                          placeholder="excel_column"
                          className="font-mono w-48"
                          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        />
                        <Button
                          variant="outline"
                          size="default"
                          onClick={handleAdd}
                          disabled={!newPpt.trim() || !newExcel.trim()}
                        >
                          <Plus className="size-4" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="size-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">How it works</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <code className="rounded bg-muted px-1.5 py-0.5">[column_name]</code> in
                PPT matches Excel column <code className="rounded bg-muted px-1.5 py-0.5">column_name</code>{" "}
                automatically.
              </li>
              <li>Add custom mappings when the PPT placeholder and Excel column names differ.</li>
              <li>Changes here are saved and used for all future generations.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
