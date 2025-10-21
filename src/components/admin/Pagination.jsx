import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const getPages = (page, totalPages) => {
  const pages = [];
  if (totalPages <= 5) {
    for (let i = 0; i < totalPages; i++) pages.push(i);
  } else {
    if (page <= 2) {
      pages.push(0, 1, 2, '...', totalPages - 1);
    } else if (page >= totalPages - 3) {
      pages.push(0, '...', totalPages - 3, totalPages - 2, totalPages - 1);
    } else {
      pages.push(0, '...', page - 1, page, page + 1, '...', totalPages - 1);
    }
  }
  return pages;
};

const Pagination = ({ page, totalPages, onPageChange }) => {
  const pages = getPages(page, totalPages);

  return (
    <div className="flex justify-center mt-6 gap-2 items-center">
      <button
        className={`w-7 h-7 rounded-full bg-white border flex items-center justify-center text-gray-500 text-xs hover:bg-gray-100 transition ${page === 0 ? 'cursor-default opacity-50' : 'cursor-pointer'}`}
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        title="Trang trước"
      >
        <FiChevronLeft size={16} />
      </button>
      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={idx} className="w-7 h-7 flex items-center justify-center text-xs text-gray-400">...</span>
        ) : (
          <button
            key={p}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${page === p
                ? 'bg-blue-500 text-white'
                : 'bg-white border text-gray-700 hover:bg-gray-100 cursor-pointer'
              }`}
            onClick={() => onPageChange(p)}
            disabled={page === p}
          >
            {p + 1}
          </button>
        )
      )}
      <button
        className={`w-7 h-7 rounded-full bg-white border flex items-center justify-center text-gray-500 text-xs hover:bg-gray-100 transition ${page === totalPages - 1 ? 'cursor-default opacity-50' : 'cursor-pointer'}`}
        disabled={page === totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        title="Trang sau"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;