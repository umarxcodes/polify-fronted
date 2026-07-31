
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const Table = ({ columns, data, onRowClick, loading, emptyState }) => {
  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-surface-200 bg-white">
        <div className="animate-pulse">
          <div className="h-14 bg-surface-50 border-b border-surface-200" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-surface-50/50 border-b border-surface-100 last:border-b-0">
              <div className="flex items-center gap-4 px-6 h-full">
                {columns.map((_, j) => (
                  <div key={j} className="skeleton h-4 flex-1" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-surface-200 bg-white">
        <div className="p-12 text-center">
          {emptyState || (
            <div>
              <p className="text-surface-500">No data available</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-surface-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-200 bg-surface-50/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={column.sortable ? column.onSort : undefined}
                  className={`
                    px-6 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer hover:text-surface-700 transition-colors' : ''}
                    ${column.align === 'right' ? 'text-right' : ''}
                    ${column.align === 'center' ? 'text-center' : ''}
                  `}
                >
                  <div className={`flex items-center gap-1 ${column.align === 'right' ? 'justify-end' : ''}`}>
                    {column.label}
                    {column.sortable && (
                      <span className="flex flex-col">
                        <ChevronUp size={12} className={`-mb-1 ${column.sortDir === 'asc' ? 'text-brand-500' : 'text-surface-300'}`} />
                        <ChevronDown size={12} className={`-mt-1 ${column.sortDir === 'desc' ? 'text-brand-500' : 'text-surface-300'}`} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {data.map((row, rowIndex) => (
              <motion.tr
                key={row.id || rowIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: rowIndex * 0.03 }}
                onClick={() => onRowClick?.(row)}
                className={`
                  transition-colors duration-150
                  ${onRowClick ? 'cursor-pointer hover:bg-surface-50' : ''}
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 text-sm text-surface-700 ${column.align === 'right' ? 'text-right' : ''} ${column.align === 'center' ? 'text-center' : ''}`}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
