export function PlaceholderGuide() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6">
      <h3 className="text-sm font-semibold text-foreground">
        Placeholder Format
      </h3>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            In your PPTX template
          </p>
          <div className="flex flex-wrap gap-2">
            <code className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-foreground">
              {"{{CLIENT_NAME}}"}
            </code>
            <code className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-foreground">
              {"{{DATE}}"}
            </code>
            <code className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-foreground">
              {"{{REVENUE}}"}
            </code>
          </div>
        </div>
        <div className="h-px bg-border" />
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Excel columns must match
          </p>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-3 py-2 text-left font-semibold text-foreground">
                    CLIENT_NAME
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">
                    DATE
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">
                    REVENUE
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground">Acme Corp</td>
                  <td className="px-3 py-2 text-muted-foreground">2026</td>
                  <td className="px-3 py-2 text-muted-foreground">50000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
