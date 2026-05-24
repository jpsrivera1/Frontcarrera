import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const PAGE_SIZE = 15;

const DataTable = ({ columns = [], data = [], loading = false, emptyText = 'Sin registros' }) => {
  const [page, setPage] = useState(1);
  const total = data.length;
  const pages = Math.ceil(total / PAGE_SIZE);
  const slice = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
        <svg className="animate-spin w-5 h-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Cargando...
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slice.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-gray-600">
                {emptyText}
              </td>
            </tr>
          ) : (
            slice.map((row, i) => (
              <tr
                key={i}
                className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-3)] transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-2 whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)] text-xs text-gray-500">
          <span>{total} registros</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded hover:bg-dark-300 disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            <span>Pág. {page} / {pages}</span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="p-1 rounded hover:bg-dark-300 disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
