import { cn } from "@/lib/utils";

export default function Table({ columns = [], rows = [], renderCell, empty, className }) {
  return (
    <div className={cn("surface overflow-hidden", className)}>
      <div className="overflow-x-auto min-h-[260px]">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10">
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/50"
                >
                  {columns.map((c) => (
                    <td key={c.key} className="px-5 py-4 align-middle text-foreground">
                      {renderCell ? renderCell(row, c.key) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
