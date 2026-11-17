import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T, index: number) => ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

/** Simple responsive table; rows rise in one after another. */
export function DataTable<T>({ columns, rows, rowKey, className, rowClassName }: { columns: Column<T>[]; rows: T[]; rowKey: (r: T) => string; className?: string; rowClassName?: (r: T) => string }) {
  return (
    <div className={cn("-mx-5 overflow-x-auto sm:-mx-6", className)}>
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-[13px] text-ink-3">
            {columns.map((c) => (
              <th key={c.key} className={cn("px-5 pb-3 font-medium first:pl-5 sm:first:pl-6 last:pr-5 sm:last:pr-6", c.align === "right" && "text-right", c.align === "center" && "text-center")}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={rowKey(r)} className={cn("rise border-b border-line last:border-0 transition-colors hover:bg-subtle/70", rowClassName?.(r))} style={{ "--i": i * 0.6 } as CSSProperties}>
              {columns.map((c) => (
                <td key={c.key} className={cn("px-5 py-3 first:pl-5 sm:first:pl-6 last:pr-5 sm:last:pr-6", c.align === "right" && "text-right", c.align === "center" && "text-center", c.className)}>
                  {c.render(r, i)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
