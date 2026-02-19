import { Presentation } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center gap-3">
      <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-primary-foreground">
        <Presentation className="size-5" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-foreground tracking-tight text-balance">
          PPT AutoFill Generator
        </h1>
        <p className="text-sm text-muted-foreground">
          Fill presentations from Excel data in seconds
        </p>
      </div>
    </header>
  );
}
