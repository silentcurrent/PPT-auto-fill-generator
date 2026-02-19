"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Presentation } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  return (
    <header className="flex items-center gap-3">
      <Link
        href="/"
        className="flex items-center justify-center size-10 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        <Presentation className="size-5" />
      </Link>
      <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight text-balance">
            PPT AutoFill Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill presentations from Excel data in seconds
          </p>
        </div>
        {pathname === "/mappings" ? (
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline underline-offset-4 shrink-0"
          >
            Generator
          </Link>
        ) : (
          <Link
            href="/mappings"
            className="text-sm font-medium text-primary hover:underline underline-offset-4 shrink-0"
          >
            Placeholder Mappings
          </Link>
        )}
      </div>
    </header>
  );
}
