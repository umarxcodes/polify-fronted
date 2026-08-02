import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange, className = '', dark }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <p className={`text-sm ${dark ? 'text-surface-400' : 'text-surface-500'}`}>
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-colors ${dark ? 'text-surface-400 hover:text-surface-200 hover:bg-surface-800' : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className={`px-3 py-2 text-sm ${dark ? 'text-surface-500' : 'text-surface-400'}`}>
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all duration-200
                ${currentPage === page
                  ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/25'
                  : (dark ? 'text-surface-400 hover:bg-surface-800' : 'text-surface-600 hover:bg-surface-100')
                }
              `}
            >
              {page}
            </button>
          )
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-colors ${dark ? 'text-surface-400 hover:text-surface-200 hover:bg-surface-800' : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
