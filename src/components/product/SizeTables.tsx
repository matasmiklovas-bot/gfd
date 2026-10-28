import type { SizeTable } from '@/lib/sizeGuide';

export function SizeTables({ tables }: { tables: SizeTable[] }) {
  return (
    <div className="space-y-10">
      {tables.map((t) => (
        <div key={t.title}>
          <h3 className="label mb-1">{t.title} <span className="text-muted">(cm)</span></h3>
          <p className="mb-4 text-[13px] text-muted">{t.note}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] border-collapse text-[14px] tabular-nums">
              <thead>
                <tr>
                  {t.columns.map((c) => (
                    <th key={c} scope="col" className="label border-b border-ink py-3 pr-3 text-left font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((row) => (
                  <tr key={String(row[0])}>
                    {row.map((cell, i) =>
                      i === 0 ? (
                        <th key={i} scope="row" className="border-b border-line py-3 pr-3 text-left font-semibold">
                          {cell}
                        </th>
                      ) : (
                        <td key={i} className="border-b border-line py-3 pr-3">
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
